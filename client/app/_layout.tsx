import { CartProvider } from "@/context/CartContext";
import "../global.css";
import { Stack } from "expo-router";
import { WishListProvider } from "@/context/WishListContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
        </WishListProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
