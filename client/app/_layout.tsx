import { CartProvider } from "@/context/CartContext";
import "../global.css";
import { Stack } from "expo-router";
import { WishListProvider } from "@/context/WishListContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <CartProvider>
        <WishListProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <Toast/>
        </WishListProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
