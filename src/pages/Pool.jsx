import { Trees, Users, Waves } from "lucide-react";
import FacilityDetail from "./FacilityDetail";
import { pool } from "../data";

export default function Pool() {
  return (
    <FacilityDetail facility={pool} featureIcons={[Waves, Trees, Users]} />
  );
}
