import { useState } from "react";
import { createContext } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ song, loading, setSong, setLoading }}>
      {children}
    </SongContext.Provider>
  );
};
