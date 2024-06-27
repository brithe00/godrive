import { StyleSheet, View, ViewProps } from "react-native";

import { gql, useQuery } from "@apollo/client";

import { Button, Card, Layout, Text } from "@ui-kitten/components";

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

const Header = (props) => (
  <View {...props}>
    <Text category="h6">Maldives</Text>
    <Text category="s1">By Wikipedia</Text>
  </View>
);

const Footer = (props) => (
  <View
    {...props}
    // eslint-disable-next-line react/prop-types
    style={[props.style, styles.footerContainer]}
  >
    <Button style={styles.footerControl} size="small" status="basic">
      CANCEL
    </Button>
    <Button style={styles.footerControl} size="small">
      ACCEPT
    </Button>
  </View>
);

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 2,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerControl: {
    marginHorizontal: 2,
  },
});

export default function Index() {
  const { loading, error, data } = useQuery(GET_TRIPS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! ${error.message}</Text>;

  return (
    <>
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
            <Card style={styles.card} header={Header} footer={Footer}>
              <Text>
                The Maldives, officially the Republic of Maldives, is a small
                country in South Asia, located in the Arabian Sea of the Indian
                Ocean. It lies southwest of Sri Lanka and India, about 1,000
                kilometres (620 mi) from the Asian continent
              </Text>
            </Card>
          </View>
        ))}
      </View>
    </>
  );
}
