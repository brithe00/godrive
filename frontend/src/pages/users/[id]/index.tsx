"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@apollo/client";
//import { GET_TRIP } from "@/graphql/queries/trip";

export default function User() {
  const params = useParams();

  //const { loading, data, error, refetch } = useQuery(GET_TRIP, {
  //  variables: { tripId: params?.id },
  // });

  //if (loading) return <div>Loading...</div>;
  //if (error) return <div>Error: {error.message}</div>;

  //console.log(data);

  return (
    <>
      <h1>hi</h1>
    </>
  );
}
