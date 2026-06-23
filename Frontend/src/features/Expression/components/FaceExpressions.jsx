import { useEffect, useRef, useState, useCallback } from "react";
import { detect, init } from "../utils/utils";
import "../style/faceExpressions.scss";

const MAX_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 400;

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const isDetectingRef = useRef(false);

  const [status, setStatus] = useState("initializing");
  const [expression, setExpression] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Explicitly stops the camera stream, releases the landmarker model,
  // and zeroes out every ref so nothing can touch a dead stream/model later.
  const killStream = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (landmarkerRef.current) {
      landmarkerRef.current = null;
    }
  }, []);

  const cancelRunRef = useRef(null);

  const runDetection = useCallback(() => {
    if (isDetectingRef.current || !videoRef.current || !landmarkerRef.current) return;

    isDetectingRef.current = true;
    setStatus("detecting");

    let attempts = 0;
    let cancelledLocal = false;
    let pollTimer = null;

    function tryDetect() {
      if (cancelledLocal || !videoRef.current) return;

      attempts += 1;
      const result = detect({ landmarkerRef, videoRef, setExpression });

      if (result) {
        isDetectingRef.current = false;
        setStatus("processing");
        
        Promise.resolve(onClick(result)).then((success) => {
          if (success === false) {
            setStatus("ready");
          } else {
            setStatus("done");
            killStream();
          }
        });
        
        return;
      }

      if (attempts >= MAX_ATTEMPTS) {
        isDetectingRef.current = false;
        setStatus("failed");
        return;
      }

      pollTimer = setTimeout(tryDetect, POLL_INTERVAL_MS);
    }

    tryDetect();

    return () => {
      cancelledLocal = true;
      if (pollTimer) clearTimeout(pollTimer);
      isDetectingRef.current = false;
    };
  }, [onClick, killStream]);

  const startDetection = useCallback(() => {
    if (cancelRunRef.current) cancelRunRef.current();
    cancelRunRef.current = runDetection();
  }, [runDetection]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (cancelled || !videoRef.current) return;

      try {
        await init({ landmarkerRef, videoRef, streamRef });
      } catch (err) {
        console.error("Camera/model init failed:", err);
        if (!cancelled) setStatus("failed");
        return;
      }

      if (cancelled || !videoRef.current) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        return;
      }

      setIsReady(true);
      setStatus("ready");
    }

    setup();

    return () => {
      cancelled = true;
      if (cancelRunRef.current) cancelRunRef.current();
      killStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleManualDetect() {
    if (!isReady || status === "done") return;
    startDetection();
  }

  return (
    <div className="face-expression">
      <div className={`face-expression__video-wrap ${status === "detecting" || status === "processing" ? "detecting" : ""}`}>
        {status !== "done" && (
          <video ref={videoRef} className="face-expression__video" playsInline muted />
        )}
        {(status === "detecting" || status === "processing") && (
          <div className="face-expression__overlay">
            <span className="face-expression__pulse" />
          </div>
        )}
        {status === "done" && (
          <div className="face-expression__done-state">✓</div>
        )}
      </div>

      {status !== "done" && status !== "processing" && (
        <button
          className="face-expression__detect-btn"
          onClick={handleManualDetect}
          disabled={!isReady || status === "detecting"}
        >
          {status === "failed" ? "Try again" : "Detect mood"}
        </button>
      )}

      <p className="face-expression__status">
        {status === "initializing" && "Starting camera…"}
        {status === "ready" && "Camera ready. Click below when you're ready!"}
        {status === "detecting" && "Reading your expression…"}
        {status === "processing" && `Mood detected: ${expression}. Finding song…`}
        {status === "done" && `Redirecting to song…`}
        {status === "failed" && "Couldn't detect a face."}
      </p>
    </div>
  );
}