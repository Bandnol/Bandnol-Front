export type CalendarItem = {
  id: string;
  date: string;
  title: string;
  artistName: string;
  imageUrl: string;
  comment: string;
  senderNickname: string;
  recevierNickname: string;
};

export type CalendarApiResponse = {
  success: boolean;
  data: CalendarItem[];
  error: any;
};
export const mockRecommendingResponse: CalendarApiResponse = {
  success: true,
  data: [
    {
      id: '111111111111111111111',
      date: '2025-07-03',
      title: 'Blueming',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/103/46/650/10346650_1000.jpg',
      comment: '들으니까 행복해졌어요!!',
      senderNickname: 'sayo',
      recevierNickname: 'nayoung',
    },
    {
      id: '2222222222222222222222',
      date: '2025-07-10',
      title: 'Good Day',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm/album/images/010/93/562/1093562_500.jpg',
      comment: '오늘도 좋은 하루 보내세요~',
      senderNickname: 'sayo',
      recevierNickname: 'nayoung',
    },
  ],
  error: null,
};
export const mockRecommendedResponse: CalendarApiResponse = {
  success: true,
  data: [
    {
      id: '111111111111111111111',
      date: '2025-07-22',
      title: '소격동',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm/album/images/022/84/378/2284378_500.jpg',
      comment: '소격동을 기억하나요~~',
      senderNickname: 'sayo',
      recevierNickname: 'nayoung',
    },
    {
      id: '2222222222222222222222',
      date: '2025-07-19',
      title: '빨간 운동화',
      artistName: 'IU',
      imageUrl:
        'https://cdnimg.melon.co.kr/cm2/album/images/118/31/781/11831781_20250526162725_500.jpg',
      comment: '선물입니당~~',
      senderNickname: 'sayo',
      recevierNickname: 'nayoung',
    },
  ],
  error: null,
};
