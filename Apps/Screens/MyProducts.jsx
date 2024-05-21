import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import LatestitemList from "../components/Home/LatestitemList";
import { useNavigation } from "@react-navigation/native";

export default function MyProducts() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [productList, setProductList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    user && getUserPost();
  }, [user]);

  useEffect(() => {
    navigation.addListener("focus", (e) => {
      getUserPost();
    });
  }, [navigation]);

  const getUserPost = async () => {
    setProductList([]);
    const q = query(
      collection(db, "UserPost"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      // console.log(doc.data());
      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <LatestitemList latestItemList={productList} />
    </View>
  );
}
