import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Product } from '@/constants/types';
import { useCart } from '@/context/CartContext';
import { useWishList } from '@/context/WishListContext';

export default function ProductDetails() {
    const {id} = useLocalSearchParams();
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const { addToCart, cartItems} = useCart();
    const {toggleWishlist, isInWishlist} = useWishList();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <View>
      <Text>[id]</Text>
    </View>
  )
}