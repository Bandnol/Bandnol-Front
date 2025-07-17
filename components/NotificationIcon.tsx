import Announcement from '@/assets/icons/size_l/icon=alert.svg';
import Bookmark from '@/assets/icons/size_l/icon=bookmark.svg';
import SongUnread from '@/assets/icons/size_l/icon=exclamationmark-square-fill.svg';
import Like from '@/assets/icons/size_l/icon=heart.svg';
import Comment from '@/assets/icons/size_l/icon=message.svg';
import Report from '@/assets/icons/size_l/icon=report.svg';
import Song from '@/assets/icons/size_l/icon=song.svg';
import Superfan from '@/assets/icons/size_l/icon=thumbsup.svg';

const iconMap = {
  songReceived: Song,
  songSent: Song,
  songUnread: SongUnread,
  comment: Comment,
  announcement: Announcement,
  bookmark: Bookmark,
  like: Like,
  superfan: Superfan,
  report: Report,
} as const;

export type IconType = keyof typeof iconMap;

export default function NotificationIcon({ type }: { type: IconType }) {
  const IconComponent = iconMap[type];
  return <IconComponent width={36} height={36} />;
}
