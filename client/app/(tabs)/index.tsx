import { BANNERS, dummyProducts } from '@/assets/assets'
import Header from '@/components/Header'
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useEffect, useState} from 'react'
import { useRouter } from 'expo-router'
import { CATEGORIES } from '@/constants'
import Categories from '@/components/Categories'
import { Product } from '@/constants/types'
import ProductCard from '@/components/ProductCard'

const {width} = Dimensions.get('window')
export default function Home() {
  const router = useRouter()
  const [activeBannerIndex, setActiveBannerIndex] = useState(0)
  const categories = [{id: 'all', name: 'All', icon: "grid"}, {id: 'home', name: 'Home', icon: "home"},
    ...CATEGORIES]
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    setProducts(dummyProducts);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, [])
  
  return (
    <SafeAreaView className='flex-1' edges={
      ['top']
    }>
      <Header title='Forever' showMenu showCart showLogo/>

      <ScrollView className='flex-1 px-4'
      showsVerticalScrollIndicator={false}>
        {/* banner slider */}
        <View className='mb-4'>
        <ScrollView horizontal pagingEnabled  showsHorizontalScrollIndicator={false}
        className='w-full h-48 rounded-xl'
        scrollEventThrottle={16}
        onScroll={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width)
          setActiveBannerIndex(index)
        }}>
          {BANNERS.map((banner, index) => (
            <View key={index} className='relative w-full h-48
            bg-gray-200 overflow-hidden' style={{width: width - 32}}>
              <Image source={{uri: banner.image}} className='w-full h-full'
              resizeMode='cover' />

              <View className='absolute inset-0 bg-black/40' />
              
              <View className='absolute bottom-4 left-4 z-10 '>
                <Text className='text-white font-bold text-lg'>{banner.title}</Text>
                <Text className='text-white'>{banner.subtitle}</Text>
                <TouchableOpacity className='mt-2 px-4 py-2 bg-white rounded-full'>
                  <Text className='text-blue-500 font-bold'>Get Started</Text>
                </TouchableOpacity>

              </View>
              
            </View>
          ))}
        </ScrollView>
        {/* pagination */}
        <View className='flex-row justify-center mt-4'>
          {BANNERS.map((_, index) => (
            <View key={index} className={`h-2 rounded-full mx-1 ${index == activeBannerIndex ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300'}`} />
          ))}
        </View>
        </View>

        {/* categories */}
        <View className='mb-6'>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='text-lg font-bold'>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row space-x-4'>
              {categories.map((category, index) => (
                <Categories key={index} item={category}
                isSelected={false}
                onPress={() => router.push({
                  pathname: "/shop", params: {category: category.id === "all" ? "" : category.name}
                })} />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* products */}
        <View className='mb-6'>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='text-lg font-bold'>
              Popular Products
            </Text>
            <TouchableOpacity onPress={() => router.push({pathname: "/shop", params: {category: ""}})}>
              <Text className='text-blue-500 font-bold'>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View className='flex-row flex-wrap justify-between'>
              {products.slice(0, 9).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </View>
          )}
        </View>

        {/* newslatter */}
        <View className='mb-6 p-4 bg-gray-100 rounded-2xl items-center'>
          <Text className='text-lg font-bold text-center'>Join Our Newsletter</Text>
          <Text className='text-gray-500 text-center'>Subscribe to our newsletter to get the latest updates and get 10% off your first purchase.</Text>
          <TouchableOpacity className='mt-4 w-4/5 py-2 bg-blue-500 rounded-full items-center'>
            <Text className='text-white font-bold text-base'>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}