import { View, Text, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { useCallback } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View>
      <Image
        source={require("../../assets/images/login.png")}
        className="w-full h-[400px] object-cover"
      />

      <View className="p-8 bg-white mt-[-20px] rounded-t-3xl shadow-md">
        <Text className="text-[30px] font-bold">프리마켓</Text>
        <Text className="text-[18px] text-slate-500 mt-6">
          오래된 물건을 팔고 돈을 벌 수 있는 판매 마켓
        </Text>

        <TouchableOpacity
          onPress={onPress}
          className="p-4 bg-blue-500 mt-20 rounded-full"
        >
          <Text className="text-white text-center text-[18px]">시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
