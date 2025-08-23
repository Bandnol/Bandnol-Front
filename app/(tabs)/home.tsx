import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { fetchSentRecoms } from '@/api/sentRecoms';
import { Typography } from '@/constants/typography';
import SearchMusicPage from './music-recommend/searchMusic';
import MyRecommendSwiper from './music-recommend/myRecommend';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showMyRecommend, setShowMyRecommend] = useState(false);
  const [myRecommendData, setMyRecommendData] = useState<any>(null);

  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const targetDate = new Date(dateString);
    
    return (
      today.getFullYear() === targetDate.getFullYear() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getDate() === targetDate.getDate()
    );
  };

  useEffect(() => {
    const checkTodayRecommendation = async () => {
      try {
        const response = await fetchSentRecoms();
        console.log('📦 fetchSentRecoms response:', response);
        
        if (response.success && Array.isArray(response.data) && response.data.length === 0) {
          // 오늘 추천 곡을 보내지 않은 경우 - 검색 페이지 표시
          setShowMyRecommend(false);
        } else if (response.success && response.data && !Array.isArray(response.data)) {
          // 추천 곡이 있는 경우 - 오늘 보낸 건지 확인
          const isRecommendedToday = isToday(response.data.createdAt);
          
          if (isRecommendedToday) {
            // 오늘 보낸 추천이 있으면 myRecommend 페이지 표시
            setShowMyRecommend(true);
            setMyRecommendData({
              title: response.data.recomsSong.title,
              artist: response.data.recomsSong.artistName,
              image: response.data.recomsSong.imgUrl,
              recomsId: response.data.id,
              comment: '', // 이후 추가 API로 가져와야 할 데이터
            });
          } else {
            // 오늘이 아닌 추천이면 검색 페이지 표시
            setShowMyRecommend(false);
          }
        } else {
          // 에러 또는 예상하지 못한 응답 - 검색 페이지 표시
          setShowMyRecommend(false);
        }
      } catch (error) {
        console.error('❌ fetchSentRecoms 오류:', error);
        // 에러 발생시 검색 페이지 표시
        setShowMyRecommend(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTodayRecommendation();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>로딩중...</Text>
      </View>
    );
  }

  if (showMyRecommend && myRecommendData) {
    return <MyRecommendSwiper {...myRecommendData} />;
  }

  return <SearchMusicPage />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body1,
    color: '#fff',
    marginTop: 16,
  },
});
