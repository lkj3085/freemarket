import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function ProductDetail({ navigation }) {
  const { params } = useRoute();
  const [product, setProduct] = useState([]);
  const { user } = useUser();
  const db = getFirestore(app);
  const nav = useNavigation();

  const sendEmailMessage = () => {
    const subject = "Regarding" + product.title;
    const body =
      "안녕하세요" + product.userName + "\n" + "이 상품 구매하고 싶습니다.";
    Linking.openURL(
      "mailto:" + product.userEmail + "?" + subject + "&body=" + body
    );
  };

  const deleteUserPost = () => {
    Alert.alert("삭제하겠습니까?", "재확인", [
      {
        text: "yes",
        onPress: () => deleteFromFirestore(),
      },
      {
        text: "Cancel",
        onPress: () => console.log("취소 완료"),
        style: "cancel",
      },
    ]);
  };

  const deleteFromFirestore = async () => {
    const q = query(
      collection(db, "UserPost"),
      where("title", "==", product.title)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref).then((resp) => {
        console.log(resp);
        nav.goBack();
      });
    });
  };

  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          onPress={() => shareProduct()}
          name="share-social-sharp"
          size={24}
          color={"black"}
          style={{ marginRight: 15 }}
        />
      ),
    });
  };

  const shareProduct = () => {
    const content = {
      message: product?.title + "\n" + product.desc,
    };
    Share.share(content).then(
      (resp) => {
        console.log(resp);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    console.log(params);
    params && setProduct(params.product);
    shareButton();
  }, [params, navigation]);

  return (
    <ScrollView style={{ flexGrow: 1, backgroundColor: "white" }}>
      <Image source={{ uri: product.image }} className="w-full h-[320px] " />

      <View className="p-3">
        <View className="items-baseline">
          <Text className="text-[24px] font-bold">{product?.title}</Text>
          <Text className=" bg-blue-200 text-blue-500 p-1 px-2 rounded-full mt-2">
            {product.category}
          </Text>
        </View>
        <Text className="mt-3 font-bold text-[20px]">제품 설명</Text>
        <Text className="mt-2 text-[17px] font-bold">{product?.desc}</Text>
      </View>
      <View className="p-3 flex flex-row items-center gap-3 border-[1px] border-gray-400 m-2">
        <Image
          source={{ uri: product.userImage }}
          className="w-12 h-12  rounded-full"
        />
        <View className>
          <Text className="font-bold text-[18px]">{product.userName}</Text>
          <Text className="text-gray-500">{product.userEmail}</Text>
        </View>
      </View>

      {user?.primaryEmailAddress.emailAddress === product.userEmail ? (
        <TouchableOpacity
          onPress={() => deleteUserPost()}
          className="z-40 bg-red-500 p-4 m-5 rounded-full"
        >
          <Text className="text-center text-white">삭제</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => sendEmailMessage()}
          className="z-40 bg-blue-500 p-4 m-5 rounded-full"
        >
          <Text className="text-center text-white">메세지 보내기</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
