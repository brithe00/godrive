import { Text, View } from "react-native";

import { gql, useQuery } from "@apollo/client";

const GET_TRIPS = gql`
  query Trips {
    trips {
      id
      startLocation
      stopLocations
      endLocation
      status
      price
      driver
      date
      passengers {
        id
        email
      }
    }
  }
`;

export default function Index() {
  const { loading, error, data } = useQuery(GET_TRIPS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! ${error.message}</Text>;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen !!!!!!!</Text>
      {data.trips.map((trip) => (
        <View key={trip.id}>
          <Text>Id : {trip.id}</Text>
          <Text>Start : {trip.startLocation}</Text>
          <Text>Stop : {trip.stopLocations}</Text>
          <Text>End : {trip.endLocation}</Text>
          <Text>Status : {trip.status}</Text>
          <Text>Price : {trip.price}</Text>
          <Text>
            Passengers :{" "}
            {trip.passengers.map((passenger, index) => (
              <Text key={index}>{passenger.email}</Text>
            ))}
          </Text>
        </View>
      ))}
    </View>
  );
}
