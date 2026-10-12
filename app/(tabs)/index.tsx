import { BANNERS } from '@/assets/assets'
import Header from '@/components/Header'
import { View, Text, ScrollView, Image, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const {width} = Dimensions.get('window')
export default function Home() {
  return (
    <SafeAreaView className='flex-1' edges={
      ['top']
    }>
      <Header title='Forever' showMenu showCart showLogo/>

      <ScrollView className='flex-1 px-4'
      showsVerticalScrollIndicator={false}>
        {/* banner slider */}
        <ScrollView horizontal pagingEnabled  showsHorizontalScrollIndicator={false}
        className='w-full h-48 rounded-xl'
        scrollEventThrottle={16}>
          {BANNERS.map((banner, index) => (
            <View key={index} className='relative w-full h-48
            bg-gray-200 overflow-hidden' style={{width: width - 32}}>
              <Image source={{uri: banner.image}} className='w-full h-full'
              resizeMode='cover' />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}