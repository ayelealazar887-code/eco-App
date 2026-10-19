import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/constants/types";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/context/WishListContext";
import { dummyProducts } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishList();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProduct = async () => {
    setProduct(dummyProducts.find((product) => product._id == id) as any);
    setLoading(false);
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }
  const isLiked = isInWishlist(product._id);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image carosel */}
        <View className="relative h-[450px] bg-gray-100 mb-6">
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );

              setActiveImageIndex(index);
            }}
          >
            {product.images?.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: width, height: 450 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View
            className="absolute top-12 left-4 right-4
      flex-row justify-between items-center z-10"
          >
            <TouchableOpacity
              className="w-10 h-10 bg-white/80
        rounded-full items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-10 h-10 bg-white/80
        rounded-full items-center justify-center"
              onPress={() => toggleWishlist(product)}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          {/* pagination */}
          <View
            className="
      absolute bottom-4 left-0 right-0 flex-row justify-center gap-2"
          >
            {product.images?.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full
            ${
              index === activeImageIndex ? "w-6 bg-blue-500" : "w-2 bg-gray-300"
            }`}
              />
            ))}
          </View>
        </View>

        {/* ptoduct info */}
        <View className="px-5">
          {/* Product title and rating */}
          <View className="flex-row justify-between items-start mb-2">
            {/* Product title */}
            <Text className="text-2xl font-bold text-primary flex-1 mr-3">
              {product.name}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center shrink-0">
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text className="text-sm font-bold ml-1">4.7</Text>
              <Text className="text-xs text-secondary ml-1">(85)</Text>
            </View>
          </View>
          {/* price */}
          <Text className="text-2xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </Text>
          {/* size */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text className="text-base font-bold text-primary">Size</Text>
              <View className="flex-row gap-3 mb-6 flex-wrap">
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full
            items-center justify-center border 
            ${
              selectedSize === size
                ? "bg-primary border-primary"
                : "bg-white border-gray-100"
            }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSize === size ? "text-white" : "text-primary"
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {/* description */}
          <Text className="text-base text-primary font-bold">Description</Text>
          <Text className="text-secondary leading-6 mb-6">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* footer */}
      <View className="absolute bottom-0 right-0 flex-row p-4 pb-8 bg-white border-t border-gray-100">
  <TouchableOpacity
    className="w-4/5 flex-row items-center justify-center bg-primary py-4 rounded-full shadow-lg"
  >
    <Ionicons name="bag-outline" size={20} color="white" />
    <Text className="text-white font-bold text-base ml-2">
      Add to Cart
    </Text>
  </TouchableOpacity>
</View>
    </View>
  );
}
