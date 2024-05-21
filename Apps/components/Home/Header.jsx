import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const { user } = useUser();
  return (
    <View>
      <View className="flex flex-row items-center gap-4">
        <Image
          source={{ uri: user?.imageUrl }}
          className="rounded-full w-12 h-12"
        />
        <View>
          <Text className="text-[16px]">환영합니다</Text>
          <Text className="text-[20px] font-bold">{user?.fullName}</Text>
        </View>
      </View>

      {/* search bar */}
      <View className="p-[9px] px-5 flex flex-row items-center  bg-white rounded-full mt-5 border-[1px] border-orange-400 ">
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          placeholder="검색"
          className="ml-2 text-[18px]"
          onChangeText={(value) => console.log(value)}
        />
      </View>
    </View>
  );
}
