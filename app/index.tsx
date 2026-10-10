import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">
        Welcome to NativeWind!
      </Text>
      <Text className="mt-2 text-base text-gray-600">
        Your Expo app is working.
      </Text>
    </View>
  );
}