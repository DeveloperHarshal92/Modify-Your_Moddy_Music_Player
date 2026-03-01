import { useEffect, useRef, useState } from "react";

import { init, detect } from "../utils/utils";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Click Detect");

  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef });

    return () => {
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#333",
        height: "100vh",
        color: "white",
        paddingTop: "40px",
      }}
    >
      <video 
        ref={videoRef}
        style={{ width: "400px", borderRadius: "12px" }}
        playsInline
        muted
      />
      <h2>{expression}</h2>
      <button
      style={{
        textAlign: "center",
        backgroundColor: "#444",
        color: "white",
        padding : "0.5rem",
        borderRadius : "10px"
      }}
        onClick={() => {
          detect({ landmarkerRef, videoRef, setExpression });
        }}
      >
        Detect Expression
      </button>
    </div>
  );
}
