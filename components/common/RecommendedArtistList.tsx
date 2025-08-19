import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';

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
  selected?: Artist[];
}

const RecommendedArtistList = ({
  artistData,
  onSelectArtist,
  fetchMore,
  sortType,
  setError,
  selected = [],
}: Props) => {
  const isSelected = (artist: Artist) => {
    return selected.some((a) => a.id === artist.id);
  };
  return (
    <View style={styles.gridWrap}>
      {artistData.map((item, index) => {
        const selected = isSelected(item);
        return (
          <TouchableOpacity
            key={`${item.id}-${index}`}
            style={styles.artistContainer}
            onPress={() => onSelectArtist(item)}
          >
            <View style={[
              styles.artistImageWrapper,
              selected && styles.selectedImageWrapper
            ]}>
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
              {selected && (
                <View style={styles.selectedOverlay}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.artistName,
              selected && styles.selectedArtistName
            ]}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
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
  selectedImageWrapper: {
    borderWidth: 2,
    borderColor: Colors.palette.point,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 73, 50, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
  },
  checkmark: {
    color: Colors.palette.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedArtistName: {
    color: Colors.palette.point,
  },
});

export default RecommendedArtistList;
