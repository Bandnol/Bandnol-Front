export type RecommendingItem = {
  date: string;
  title: string;
  artistName: string;
  imageUrl: string;
  comment: string;
};

export type RecommendedItem = RecommendingItem & {
  senderNickname: string;
};

export const mockCalendarData = {
  recommending: [
    {
      date: '2025-07-03',
      comment: '들으니까 행복해졌어요!!',
      title: 'Blueming',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
    },
    {
      date: '2025-07-13',
      comment: '오늘도 좋은 하루 보내세요~',
      title: 'Good Day',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
    },
  ],
  recommended: [
    {
      senderNickname: 'gummies',
      date: '2025-07-22',
      title: '소격동',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
      comment: '소격동을 기억하나요~~',
    },

    {
      senderNickname: 'bear',
      date: '2025-07-19',
      title: '빨간 운동화',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
      comment: '선물입니당~~',
    },
  ],
};
