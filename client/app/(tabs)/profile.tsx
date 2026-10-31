import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/constants";
import { useClerk, useUser } from "@clerk/expo";
import Toast from "react-native-toast-message";

export default function Profile() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/profile");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Couldn't log out",
        text2:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    }
  }

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <Header title="Profile" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Profile" />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingTop: 16 }
        }
      >
        {!user ? (
          <View className="items-center w-full">
            <TouchableOpacity
              className="bg-primary w-3/5 py-3 rounded-full items-center shadow-lg"
              onPress={() => router.push("/sign-in")}
            >
              <Text className="text-white font-bold text-lg">Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-3/5 py-3 rounded-full items-center border border-primary mt-3"
              onPress={() => router.push("/sign-up")}
            >
              <Text className="text-primary font-bold text-lg">
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* profile info */}
            <View className="items-center mb-8">
              <View className="mb-3">
                {user.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="size-20 border-2 border-white shadow-sm rounded-full"
                  />
                ) : (
                  <View className="size-20 rounded-full bg-gray-200 items-center justify-center">
                    <Ionicons name="person" size={40} color={COLORS.secondary} />
                  </View>
                )}
              </View>
              <Text className="text-xl font-bold text-primary">
                {user.fullName || "Your account"}
              </Text>
              <Text className="text-secondary text-sm">
                {user.primaryEmailAddress?.emailAddress ??
                  user.emailAddresses[0]?.emailAddress}
              </Text>
              {/* admin panel if user is admin*/}
              {user.publicMetadata?.role === 'admin' && (
                <TouchableOpacity onPress={() => router.push('/admin')}
                className="mt-4 bg-primary px-6 py-2 rounded-full">
                  <Text className="text-bold text-white">Admin Panel</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Menu */}
            <View className="bg-white rounded-xl border border-gray-100/75 p-2 mb-4">
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity key={item.id}
                className={`flex-row items-center p-4 ${index != PROFILE_MENU.length - 1 ? "border-b border-gray-100"
                  :""
                 }`} onPress={()=>router.push(item.route as any)}>
                  <View className="w-10 h-10 bg-surface rounded-full
                  items-center justify-center mr-4">
                    <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                  </View>
                  <Text className="flex-1 text-primary font-medium">{item.title}</Text>
                  <Ionicons name='chevron-forward' size={20} color={COLORS.secondary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout  */}
            <TouchableOpacity className="flex-row items-center justify-center p-4"
            onPress={handleLogout}>
              <Text className="text-red-500 font-bold ml-2">Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
