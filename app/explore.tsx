import { View, Text } from "react-native";

export default function ExploreScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">
        Explore Page
      </Text>
      <Text className="mt-2 text-gray-600">
        Welcome to the explore screen!
      </Text>
    </View>
  );
}