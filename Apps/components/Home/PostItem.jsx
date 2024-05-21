import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function PostItem({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("product-detail", { product: item })}
      className="flex-1 mt-2 p-2 rounded-lg border-[1px] border-slate-200"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-[140px] rounded-lg"
      />
      <View>
        <Text className="p-1 rounded-full text-red-600 ">{item.category}</Text>
        <Text className="text-[15px] font-bold mt-2">{item.title}</Text>
        <Text className="text-[20px] font-bold text-blue-500">
          {item.price} 원
        </Text>
      </View>
    </TouchableOpacity>
  );
}
