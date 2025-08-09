import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';

interface Artist {
  id: string;
  name: string;
  imgUrl: string;
}

interface Props {
  selectedArtists: Artist[];
}

const InterestedArtistList = ({ selectedArtists }: Props) => {
  return selectedArtists.length === 0 ? (
    <Text
      style={{ color: Colors.palette.Gray400, fontSize: 14, marginTop: 10 }}
    >
      선택한 아티스트가 없습니다.
    </Text>
  ) : (
    <FlatList
      data={selectedArtists}
      horizontal
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ marginTop: 10 }}
      renderItem={({ item }) => (
        <View style={{ marginRight: 10, alignItems: 'center' }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              overflow: 'hidden',
              backgroundColor: Colors.palette.Gray700,
            }}
          >
            {item.imgUrl ? (
              <Image
                source={{ uri: item.imgUrl }}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            ) : (
              <View
                style={{ flex: 1, backgroundColor: Colors.palette.Gray500 }}
              />
            )}
          </View>
          <Text
            style={[
              Typography.caption,
              {
                color: Colors.palette.Gray100,
                fontSize: 12,
                marginTop: 4,
                textAlign: 'center',
              },
            ]}
          >
            {item.name}
          </Text>
        </View>
      )}
    />
  );
};

export default InterestedArtistList;
