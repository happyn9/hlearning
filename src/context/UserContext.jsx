import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const UserContext = createContext(null);

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);   // infos user
  
  const [loading, setLoading] = useState(false);

  const refreshUser = async () => {

    setLoading(true);
    try {
      const me = await api.get("/auth/me");
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect (()=>{
    refreshUser();
  },[])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
