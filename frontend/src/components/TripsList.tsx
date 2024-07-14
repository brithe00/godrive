import TripCard from "./TripCard";

export default function TripsList({ trips }) {
  return (
    <>
      {trips.map((trip) => (
        <TripCard
          trip={trip}
          isFull={trip.passengers.length === trip.numberOfPassengers}
          key={trip.id}
        />
      ))}
    </>
  );
}
