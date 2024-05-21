import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import product from "../../assets/images/product.png";
import search from "../../assets/images/search.png";
import logout from "../../assets/images/logout.jpg";
import profile from "../../assets/images/profile.png";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { isLoaded, signOut } = useAuth();

  const menuList = [
    {
      id: 1,
      name: "My Product",
      icon: product,
      path: "my-product",
    },
    {
      id: 2,
      name: "Explore",
      icon: search,
      path: "explore",
    },
    {
      id: 3,
      name: "big J",
      icon: profile,
      url: "",
    },
    {
      id: 4,
      name: "로그아웃",
      icon: logout,
    },
  ];

  const onMenuPress = (item) => {
    if (item.name == "logout") {
      signOut();
      return;
    }
    item?.path ? navigation.navigate(item.path) : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userEmail}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <FlatList
        data={menuList}
        numColumns={3}
        style={{ marginTop: 20 }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.menuListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onMenuPress(item)}
          >
            {item.icon && <Image source={item?.icon} style={styles.menuIcon} />}
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 10,
  },
  userEmail: {
    fontSize: 18,
    marginTop: 5,
  },
  menuListContainer: {
    marginTop: 20,
  },
  menuItem: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    margin: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 50,
    height: 50,
  },
  menuText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
});
