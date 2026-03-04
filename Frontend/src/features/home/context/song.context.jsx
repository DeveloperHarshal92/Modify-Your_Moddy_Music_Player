import { useState } from "react";
import { createContext } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url:
      "https://ik.imagekit.io/developerHarsh/cohort-2/modify/songs/Maiyya_Mainu_JaB2_H1hb.mp3",
    posterUrl:
      "https://ik.imagekit.io/developerHarsh/cohort-2/modify/posters/Maiyya_Mainu_Euv1KRoSb.jpeg",
   title: "Maiyya Mainu",
    mood: "happy",
  });

  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ song, loading, setSong, setLoading }}>
      {children}
    </SongContext.Provider>
  );
};
