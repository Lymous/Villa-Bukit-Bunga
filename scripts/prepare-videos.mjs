import { spawn } from "node:child_process";
import {
  access,
  mkdir,
  readFile,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "public/videos");
const ffmpeg = process.env.VILLA_FFMPEG_BIN || "ffmpeg";
const ffprobe = process.env.VILLA_FFPROBE_BIN || "ffprobe";
const jobs = [
  {
    key: "private",
    source: "private/Villa Bukit Bunga 1_1.mp4",
    name: "private-tour",
  },
  {
    key: "yard",
    source: "villa_yard/VID_20261025_164954.mp4",
    name: "halaman-villa",
  },
];

function run(binary, args, capture = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, {
      stdio: ["ignore", capture ? "pipe" : "ignore", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk).slice(-4000);
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve(stdout)
        : reject(new Error(`${binary} exited ${code}: ${stderr}`)),
    );
  });
}

for (const job of jobs) await access(join(root, job.source));
await mkdir(output, { recursive: true });
const manifestPath = join(root, "src/video-manifest.json");
const manifest = JSON.parse(
  await readFile(manifestPath, "utf8").catch(() => "{}"),
);

for (const job of jobs) {
  console.log(`Preparing ${job.key}: ${job.source}`);
  const source = join(root, job.source);
  const sourceStat = await stat(source);
  const target = join(output, `${job.name}.mp4`);
  const working = join(output, `${job.name}.working.mp4`);
  await run(ffmpeg, [
    "-hide_banner",
    "-loglevel",
    "error",
    "-nostdin",
    "-y",
    "-threads",
    "2",
    "-i",
    source,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0?",
    "-map_metadata",
    "-1",
    "-map_chapters",
    "-1",
    "-vf",
    "fps=30,scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "26",
    "-profile:v",
    "main",
    "-pix_fmt",
    "yuv420p",
    "-threads",
    "2",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    working,
  ]);
  const metadata = JSON.parse(
    await run(
      ffprobe,
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration:stream=codec_type,width,height",
        "-of",
        "json",
        working,
      ],
      true,
    ),
  );
  const video = metadata.streams.find(
    (stream) => stream.codec_type === "video",
  );
  const duration = Number(metadata.format.duration);
  if (!video || !(duration > 0))
    throw new Error(`Invalid output for ${job.key}`);
  await rename(working, target);
  const poster = join(output, `${job.name}-poster.jpg`);
  await run(ffmpeg, [
    "-hide_banner",
    "-loglevel",
    "error",
    "-nostdin",
    "-y",
    "-ss",
    "1",
    "-i",
    target,
    "-frames:v",
    "1",
    "-q:v",
    "3",
    poster,
  ]);
  const preparedStat = await stat(target);
  manifest[job.key] = {
    src: `/videos/${job.name}.mp4`,
    poster: `/videos/${job.name}-poster.jpg`,
    type: "video/mp4",
    duration,
    width: video.width,
    height: video.height,
    bytes: preparedStat.size,
    original: job.source,
  };
  await writeFile(
    `${manifestPath}.tmp`,
    JSON.stringify(manifest, null, 2) + "\n",
  );
  await rename(`${manifestPath}.tmp`, manifestPath);
  console.log(
    `${job.key}: ${(sourceStat.size / 1024 ** 2).toFixed(1)} MB → ${(preparedStat.size / 1024 ** 2).toFixed(1)} MB, ${duration.toFixed(1)} seconds`,
  );
}
