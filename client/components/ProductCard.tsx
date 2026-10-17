import { View, Text, TouchableOpacity } from "react-native";
import { ProductCardProps } from "@/constants/types";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { Image } from "react-native";
import { use } from "react";
import { useWishList } from "@/context/WishListContext";

export default function ProductCard({ product }: ProductCardProps) {
  const {toggleWishlist, isInWishlist} = useWishList();
  const isLiked = isInWishlist(product._id);
  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity
        className="w-[48%] mb-4 bg-white
      rounded-lg overflow-hidden"
      >
        <View className="relative h-56 w-full bg-gray-100">
          <Image
            source={{ uri: product.images[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* favorite */}
          <TouchableOpacity
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product)
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "headset-outline"}
              size={20}
              color={isLiked ? COLORS.accent : COLORS.primary}
            />
          </TouchableOpacity>
          {/* featured */}
          {
            product.isFeatured && (
              <View className="absolute top-2 left-2 bg-blue-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">Featured</Text>
              </View>
            )
          }
        </View>

        {/* product info */}
        <View className="px-2 py-1">
          <View className='flex-row items-center mb-1'>
            <Ionicons name='star' size={16} color='#FFD700' />
            <Text className="text-secondary text-xs ml-1">4.6</Text>
          </View>
          <Text className="text-gray-500" numberOfLines={1}>{product.name}</Text>
          <View>
            <Text className="text-lg font-bold">${product.price.toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
