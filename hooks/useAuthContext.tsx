import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  name: string;
  email: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 앱 감싸서 사용자 보호
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  return (
    <AuthContext.Provider value={{ name, email, setName, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

//이름, 이메일 상태 가져오기
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
