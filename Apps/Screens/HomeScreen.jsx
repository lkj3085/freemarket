import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Home/Header";
import Slider from "../components/Home/Slider";
import { collection, getDocs, getFirestore, orderBy } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import Categories from "../components/Home/Categories";
import LatestItemList from "../components/Home/LatestitemList";

export default function HomeScreen() {
  const db = getFirestore(app);

  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);

  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const getLatestItems = async () => {
    setLatestItemList([]);
    const querySnapshot = await getDocs(collection(db, "UserPost"));
    querySnapshot.forEach((doc) => {
      setLatestItemList((latestItemList) => [...latestItemList, doc.data()]);
    });
  };

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItems();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <Slider sliderList={sliderList} />
      <Categories categoryList={categoryList} />
      <LatestItemList latestItemList={latestItemList} heading={"최신 등록"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
});
