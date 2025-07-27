import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function WheelList({
  data,
  selectedValue,
  onSelect,
}: {
  data: number[];
  selectedValue: number;
  onSelect: (v: number) => void;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.toString()}
      style={{ height: 150 }}
      showsVerticalScrollIndicator={false}
      getItemLayout={(_, index) => ({
        length: 40,
        offset: 40 * index,
        index,
      })}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)}>
          <View
            style={{
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: item === selectedValue ? '#000' : 'transparent',
            }}
          >
            <Text
              style={{
                color: item === selectedValue ? '#fff' : '#888',
                fontSize: 18,
              }}
            >
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
