import { Armchair, Users, Utensils } from "lucide-react";
import FacilityDetail from "./FacilityDetail";
import { diningRoom } from "../data";

export default function DiningRoom() {
  return (
    <FacilityDetail
      facility={diningRoom}
      featureIcons={[Utensils, Armchair, Users]}
    />
  );
}
