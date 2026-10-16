import { View, Text, TouchableOpacity } from 'react-native'
import { CategoryItemProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'

const Categories = ({item, isSelected,
    onPress}: CategoryItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} 
    className='mr-4 items-center'>
        <View className={`w-16 h-16 rounded-full items-center justify-center ${isSelected ? 'bg-blue-500' : 'bg-gray-200'}`}>
            <Ionicons name={item.icon as any} size={24} color={isSelected ? 'white' : 'black'} />
        </View>
        <Text className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-black'}`}>{item.name}</Text>
    </TouchableOpacity>
  )
}

export default Categories