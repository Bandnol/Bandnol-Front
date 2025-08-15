import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Artist {
  id: string;
  name: string;
  imgUrl: string;
}

const IA_STORAGE_KEY = '@interested_artists_v1';

interface Props {
  selectedArtists: Artist[];
  onArtistPress?: (artist: Artist) => void;
}

const InterestedArtistList = ({ selectedArtists, onArtistPress }: Props) => {
  const router = useRouter();

  const [persisted, setPersisted] = React.useState<Artist[]>([]);

  // Load persisted artists on mount
  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(IA_STORAGE_KEY);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) setPersisted(arr);
        }
      } catch (e) {
        console.warn('[InterestedArtistList] load persisted failed', e);
      }
    })();
  }, []);

  // Persist when incoming prop updates with non-empty list
  React.useEffect(() => {
    const arr = Array.isArray(selectedArtists) ? selectedArtists : [];
    if (!arr.length) return;
    setPersisted(arr);
    AsyncStorage.setItem(IA_STORAGE_KEY, JSON.stringify(arr)).catch(() => {});
  }, [selectedArtists]);

  // Make a 3-column grid layout stable by adding placeholders when items < multiple of 3
  const buildGrid = (items: Artist[]) => {
    const max = 6; // we already slice to 6 below
    const sliced = (items ?? []).slice(0, max);
    const remainder = sliced.length % 3;
    const needPlaceholders = remainder === 0 ? 0 : 3 - remainder; // 1->2, 2->1, 0->0
    const placeholders = Array.from({ length: needPlaceholders }, (_, i) => ({
      id: `__ph-${i}`,
      name: '',
      imgUrl: '',
      __placeholder: true as const,
    }));
    return [...sliced, ...placeholders];
  };

  const source = (selectedArtists?.length ? selectedArtists : persisted) ?? [];
  const raw = source.slice(0, 6);
  const data = buildGrid(raw);
  console.log('[InterestedArtistList] selectedArtists:', selectedArtists);
  console.log('[InterestedArtistList] data (first 6):', data);

  return (
    <View style={styles.container}>
      {!raw.length && !persisted.length ? (
        <Text style={styles.noArtistText}>선택한 아티스트가 없습니다.</Text>
      ) : (
        data.map((item, idx) => {
          const isPlaceholder = (item as any).__placeholder === true;
          const cellStyle = [
            styles.artistContainer,
            idx % 3 === 2 && styles.artistContainerThird,
          ] as const;
          return isPlaceholder ? (
            <View key={item.id} style={cellStyle}>
              <View style={styles.artistImageWrapper} />
              <Text style={styles.artistName}> </Text>
            </View>
          ) : (
            <TouchableOpacity
              key={item.id}
              style={cellStyle}
              onPress={() => {
                console.log(
                  '[InterestedArtistList] navigating to artist page:',
                  item.id,
                  item.name,
                );
                router.push({
                  pathname: `/artist/${item.id}`,
                  params: { name: item.name },
                });
              }}
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
                      { backgroundColor: Colors.palette.Gray800 },
                    ]}
                  />
                )}
              </View>
              <Text style={styles.artistName}>{item.name}</Text>
            </TouchableOpacity>
          );
        })
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
  artistContainerThird: {
    marginRight: 0,
  },
  artistImageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: Colors.palette.Gray800,
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
