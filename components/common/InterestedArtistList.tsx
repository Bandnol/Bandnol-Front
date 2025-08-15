import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

interface Artist {
  id: string;
  name: string;
  imgUrl: string;
}

interface Props {
  selectedArtists: Artist[];
  onArtistPress?: (artist: Artist) => void;
}

const InterestedArtistList = ({ selectedArtists, onArtistPress }: Props) => {
  const data = (selectedArtists ?? []).slice(0, 6);

  return (
    <View style={styles.container}>
      {!data.length ? (
        <Text style={styles.noArtistText}>선택한 아티스트가 없습니다.</Text>
      ) : (
        data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.artistContainer}
            onPress={() => onArtistPress && onArtistPress(item)}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <View style={styles.artistImageWrapper}>
              {item.imgUrl ? (
                <Image
                  source={{ uri: item.imgUrl }}
                  style={styles.artistImage}
                />
              ) : (
                <View
                  style={[
                    styles.artistImage,
                    { backgroundColor: Colors.palette.Gray600 },
                  ]}
                />
              )}
            </View>
            <Text style={styles.artistName}>{item.name}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: Colors.palette.Gray800,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  artistContainer: {
    width: '30%',
    marginRight: '3.33%',
    alignItems: 'center',
  },
  artistImageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: Colors.palette.Gray700,
  },
  artistImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  artistName: {
    ...Typography.body2,
    color: Colors.palette.Gray100,
    margin: 8,
    textAlign: 'center',
  },
  noArtistText: {
    color: Colors.palette.Gray400,
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
});

export default InterestedArtistList;
