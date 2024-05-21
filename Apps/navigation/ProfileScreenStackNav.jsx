import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../Screens/ProfileScreen";
import MyProducts from "../Screens/MyProducts";
import ProductDetail from "../Screens/ProductDetail";

const Stack = createStackNavigator();

export default function ProfileScreenStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="profile-tab"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="my-product"
        component={MyProducts}
        options={{
          headerTitle: "내 상품",
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
