import React, { useContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface ContextProps {
  user: UserProps | undefined;
  setUser: (value: UserProps) => void;
  UserSignOut: () => void;
}

interface UserProps {
  uuid: string;
  email: string;
  fullName: string;
  nickName: string;
  birthDate: string;
  genre: string;
  scheduleUUID: string;
}

export const AuthContext = React.createContext<ContextProps>(
  {} as ContextProps
);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserProps>();

  const UserSignOut = () => {
    localStorage.removeItem("@schedule:user-uuid-1.0.0");
    localStorage.removeItem("@schedule:user-schedule-uuid-1.0.0");
    setUser({} as UserProps);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, UserSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
