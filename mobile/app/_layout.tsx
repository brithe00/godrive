import { Stack } from "expo-router";

import Constants from "expo-constants";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";

export default function RootLayout() {
  const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });

  {
    /*
    let hostIP = "";
  if (Constants !== undefined) {
    if (Constants.expoConfig && Constants.expoConfig.hostUri) {
      hostIP = Constants.expoConfig.hostUri.split(`:`)[0];
    }
  }
  const client = new ApolloClient({
    uri: hostIP ? `http://${hostIP}:7000/graphql` : "http://produrl/graphql",
    cache: new InMemoryCache(),
  });
  */
  }

  return (
    <ApolloProvider client={client}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </ApplicationProvider>
    </ApolloProvider>
  );
}
