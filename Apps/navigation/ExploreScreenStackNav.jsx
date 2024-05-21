import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ExploreScreen from "../Screens/ExploreScreen";
import ProductDetail from "../Screens/ProductDetail";

const Stack = createStackNavigator();

export default function ExploreScreenStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Explore-tab"
        component={ExploreScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="product-detail"
        component={ProductDetail}
        options={{
          headerTitle: "상세",
        }}
      />
    </Stack.Navigator>
  );
}
