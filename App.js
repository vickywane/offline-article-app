import "react-native-gesture-handler";
import * as React from "react";
import {Text, TouchableOpacity} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import {InMemoryCache} from "apollo-cache-inmemory";
import Realm from "realm";
import {setContext} from "@apollo/client/link/context";
import FlashMessage, {showMessage} from "react-native-flash-message"
import {checkInternetConnection} from "react-native-offline"

import Login from "./src/screens/login";
import CreateAccount from "./src/screens/create-account";
import Home from "./src/screens/Home";
import CreateRecording from "./src/screens/CreateRecording";
import {REALM_GRAPHQL_ENDPOINT, REALM_ID} from "./src/credentials";
import {RecordingSchema} from "./src/schema";

const Stack = createStackNavigator();
const app = new Realm.App({id: REALM_ID});

const link = createHttpLink({
    uri: REALM_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, {headers}) => {
    const token = app.currentUser.accessToken;
    return {
        headers: {
            ...headers,
            Authorization: `Bearer ${token}`,
        },
    };
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(link),
});

export default function App() {
    const [isConnected, setConnection] = React.useState(null)

    React.useEffect(() => {
        const syncInterval = setInterval(() => {
            checkInternetConnection().then(isConnected => setConnection(isConnected)).catch(e => console.log(`error getting connection status : ${e}`))
        }, 1000);

        return () => clearInterval(syncInterval);
    })

    React.useEffect(() => {
        if (!isConnected) {
            showMessage({
                description: "App is currently offline, all recordings  would be stored offline then synced when connected",
                message: "App is offline",
                type: "info",
                icon: "warning",
                duration: 2500,
                style: {
                    paddingVertical: 15,
                    backgroundColor: "#FFBF00"
                },
                titleStyle: {
                    fontSize: 18
                },
                textStyle: {
                    fontSize: 14
                },
            })
        }
    }, [isConnected])

    return (
        <ApolloProvider client={client}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        options={{
                            headerShown: false,
                        }}
                        name="login"
                        component={Login}
                    />
                    <Stack.Screen
                        options={{
                            headerShown: false,
                        }}
                        name="create-account"
                        component={CreateAccount}
                    />

                    <Stack.Screen
                        options={{
                            headerLeft: null,
                            title: "Latest Recordings",
                            headerStyle: {
                                backgroundColor: "#282c34",
                            },
                            headerTintColor: "#fff",
                            headerTitleStyle: {
                                fontSize: 17,
                                fontWeight: "600",
                            },
                        }}
                        name="Home"
                        component={Home}
                    />

                    <Stack.Screen
                        options={{
                            title: "Record Audio",
                            headerStyle: {
                                backgroundColor: "#282c34",
                            },
                            headerTintColor: "#fff",
                            headerTitleStyle: {
                                fontWeight: "normal",
                                fontSize: 17
                            },
                        }}
                        name="CreateRecording"
                        component={CreateRecording}
                    />
                </Stack.Navigator>

                <FlashMessage position={'top'}/>
            </NavigationContainer>
        </ApolloProvider>
    );
}
