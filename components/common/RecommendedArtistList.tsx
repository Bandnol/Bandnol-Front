import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Artist {
  id: string;
  name: string;
  imgUrl: string | null;
}

interface Props {
  artistData: Artist[];
  onSelectArtist: (artist: Artist) => void;
  fetchMore: (
    cursor?: string | null,
  ) => Promise<{ nextCursor?: string | null } | void>;
  sortType: 'random' | 'popularity';
  setError: (error: string | null) => void;
}

const RecommendedArtistList = ({
  artistData,
  onSelectArtist,
  fetchMore,
  sortType,
  setError,
}: Props) => {
  return (
    <View style={styles.gridWrap}>
      {artistData.map((item, index) => (
        <TouchableOpacity
          key={`${item.id}-${index}`}
          style={styles.artistContainer}
          onPress={() => onSelectArtist(item)}
        >
          <View style={styles.artistImageWrapper}>
            {item.imgUrl ? (
              <Image source={{ uri: item.imgUrl }} style={styles.artistImage} />
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
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  artistContainer: {
    width: '25%',
    marginBottom: 16,
    alignItems: 'center',
    paddingRight: 8,
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
    marginTop: 8,
    textAlign: 'center',
  },
});

export default RecommendedArtistList;
