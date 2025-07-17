export const notifications = [
  {
    id: 1,
    type: 'songReceived',
    time: '지금',
  },
  {
    id: 2,
    type: 'songSent',
    nickname: '훈심이',
    time: '1일 전',
  },
  {
    id: 3,
    type: 'songUnread',
    nickname: '훈심이',
    time: '18초 전',
  },
  {
    id: 4,
    type: 'comment',
    nickname: '훈심이',
    time: '20시간 전',
  },
  {
    id: 5,
    type: 'announcement',
    date: '2024-07-18',
    timeStart: '00:00',
    timeEnd: '06:00',
    time: '4분 전',
  },
  {
    id: 6,
    type: 'bookmark',
    nickname: 'noshel',
    time: '2일 전',
  },
  {
    id: 7,
    type: 'like',
    nickname: 'noshel',
    time: '2일 전',
  },

  {
    id: 8,
    type: 'superfan',
    artist: '페퍼톤스',
    time: '6일 전',
  },
  {
    id: 9,
    type: 'report',
    reportMonth: '6월',
    time: '7월 1일',
  },
] as const;
