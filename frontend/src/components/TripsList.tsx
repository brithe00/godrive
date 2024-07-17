import { Trip } from "@/types/types";
import TripCard from "./TripCard";

interface TripsListProps {
  trips: Trip[];
}

export default function TripsList({ trips }: TripsListProps) {
  return (
    <>
      {trips.map((trip) => (
        <TripCard
          trip={trip}
          isFull={trip.passengers?.length === trip.numberOfPassengers}
          key={trip.id}
        />
      ))}
    </>
  );
}
