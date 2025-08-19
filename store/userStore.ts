import { create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  nickname: string;
  ownId: string;
  photo: string;
  actions: {
    setNickname: (nickname: string) => void;
    setOwnId: (ownId: string) => void;
    setPhoto: (photo: string) => void;
    clearUser: () => void;
  };
}

const useUserStore = create(
  persist<UserState>(
    (set) => ({
      nickname: '',
      ownId: '',
      photo: '',
      actions: {
        setNickname: (nickname: string) => set({ nickname }),
        setOwnId: (ownId: string) => set({ ownId }),
        setPhoto: (photo: string) => set({ photo }),
        clearUser: () => set({ nickname: '', ownId: '', photo: '' }),
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // HACK: actions는 persist 제외
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['actions'].includes(key)),
        ),
    },
  ),
);

export const useUserNickname = () => useUserStore((state) => state.nickname);
export const useUserOwnId = () => useUserStore((state) => state.ownId);
export const useUserPhoto = () => useUserStore((state) => state.photo);
export const useUserActions = () => useUserStore((state) => state.actions);
