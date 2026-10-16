import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ProductCardProps } from '@/constants/types'
import { Link } from 'expo-router'

export default function ProductCard({product}: ProductCardProps
 ) {
  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity>
        <View className='bg-white rounded-lg shadow-md p-4 mb-4'>
          <Text className='text-lg font-bold'>{product.name}</Text>
          <Text className='text-gray-600'>{product.description}</Text>
          <Text className='text-gray-800 font-semibold mt-2'>${product.price}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}