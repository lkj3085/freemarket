import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import LoginScreen from "./Apps/Screens/LoginScreen";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./Apps/navigation/TabNavigation";

export default function App() {
  return (
    <ClerkProvider publishableKey="pk_test_cmVzdGVkLWpheWJpcmQtNjAuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <View style={{ flex: 1, backgroundColor: "white", marginTop: 50 }}>
        <StatusBar style="auto" />
        <SignedIn>
          <NavigationContainer>
            <TabNavigation />
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <LoginScreen />
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}
