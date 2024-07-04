import TripCard from "./TripCard";

export default function TripsList({ trips }) {
  return (
    <>
      {trips.map((trip) => (
        <TripCard trip={trip} key={trip.id} />
      ))}
    </>
  );
}
