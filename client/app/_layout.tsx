import { CartProvider } from "@/context/CartContext";
import "../global.css";
import { Stack } from "expo-router";
import { WishListProvider } from "@/context/WishListContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
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
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
