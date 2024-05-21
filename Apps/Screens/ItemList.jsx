import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  getDocs,
  getFirestore,
  collection,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestitemList from "../components/Home/LatestitemList";

export default function ItemList() {
  const { params } = useRoute();
  const db = getFirestore(app);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params && getItemListByCategory();
  }, [params]);

  const getItemListByCategory = async () => {
    setItemList([]);
    setLoading(true);
    const q = query(
      collection(db, "UserPost"),
      where("category", "==", params.category)
    );
    const snapshot = await getDocs(q);
    setLoading(false);
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setItemList((itemList) => [...itemList, doc.data()]);
    });
    setLoading(false);
  };

  return (
    <View className="p-2">
      {loading ? (
        <ActivityIndicator size={"large"} color={"#3b82f6"} />
      ) : itemList?.length > 0 ? (
        <LatestitemList latestItemList={itemList} heading={"최신 등록"} />
      ) : (
        <Text className="p-5 text-[20px] justify-center text-center mt-24">
          등록된 상품 없음
        </Text>
      )}
    </View>
  );
}
