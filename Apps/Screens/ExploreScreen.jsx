import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestitemList from "../components/Home/LatestitemList";

export default function ExploreScreen() {
  const db = getFirestore(app);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getAllProduct();
  }, []);

  const getAllProduct = async () => {
    setProductList([]);

    const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      // console.log(doc.data());
      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  return (
    <ScrollView className="p-5 py-8 bg-white">
      <Text className="text-[30px] font-bold">ExploreScreen</Text>
      <LatestitemList latestItemList={productList} />
    </ScrollView>
  );
}
