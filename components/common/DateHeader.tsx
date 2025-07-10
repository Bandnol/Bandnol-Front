type Props = {
  className?: string;
  style?: any;
};

export default function DateHeader({ style }: Props) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${
    ['일', '월', '화', '수', '목', '금', '토'][today.getDay()]
  }요일`;

  return <>{formattedDate}</>;
}
