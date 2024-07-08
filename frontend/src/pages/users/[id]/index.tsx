"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/queries/user";

// f97cb263-60a4-4d50-afed-df7d29d289e4

export default function User() {
  const params = useParams();

  const { loading, data, error, refetch } = useQuery(GET_USER, {
    variables: { getUserByIdId: params?.id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <>
      <h1>hi</h1>
    </>
  );
}
