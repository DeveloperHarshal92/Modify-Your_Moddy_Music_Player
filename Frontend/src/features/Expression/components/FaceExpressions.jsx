import { useEffect, useRef, useState, useCallback } from "react";
import { detect, init } from "../utils/utils";
import { Camera, RefreshCw, Sparkles, Smile, Frown, Zap, Moon, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MAX_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 400;

const MOOD_META = {
  happy: { color: "#f2b23c", label: "Happy & Radiant", icon: Smile, desc: "Uplifting & Vibrant Beats" },
  energetic: { color: "#ff6b4a", label: "High Energy", icon: Flame, desc: "Fast-Paced & Driving Rhythms" },
  sad: { color: "#5fa3e0", label: "Melancholic", icon: Frown, desc: "Emotional & Deep Acoustics" },
  chill: { color: "#38d9a9", label: "Deep Chill", icon: Moon, desc: "Lo-Fi & Ambient Waves" },
  surprised: { color: "#b092e8", label: "Euphoric Wonder", icon: Zap, desc: "Dynamic & Unexpected Drops" },
};

const getMoodConfig = (mood) => {
  if (!mood) return { color: "#53e076", label: "Ready to Scan", desc: "AI Emotion Detection" };
  const key = mood.toLowerCase();
  return MOOD_META[key] || { color: "#53e076", label: mood, desc: "Personalized Selection" };
};

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const isDetectingRef = useRef(false);

  const [status, setStatus] = useState("initializing");
  const [expression, setExpression] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Explicitly stops the camera stream, releases the landmarker model
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

        // Kill camera stream synchronously before executing onClick callback
        killStream();

        Promise.resolve(onClick(result)).then((success) => {
          if (success === false) {
            setStatus("ready");
          } else {
            setStatus("done");
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
  }, []);

  function handleManualDetect() {
    if (!isReady || status === "done") return;
    startDetection();
  }

  const moodConfig = getMoodConfig(expression);
  const isScanning = status === "detecting" || status === "processing";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Graphite Surface Container */}
      <div className="w-full bg-[#1e1e1e] border border-[#303030] rounded-[4px] p-6 sm:p-8 flex flex-col items-center justify-center">
        {/* Subtitle */}
        <div className="text-xs uppercase tracking-wider text-[#999999] font-semibold mb-4">
          Biometric Expression Scanner
        </div>

        {/* Camera Viewfinder (4px radius) */}
        <div className="relative mb-6">
          <div
            className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-[4px] overflow-hidden bg-[#303030] border ${
              isScanning ? "border-white" : status === "done" ? "border-white" : "border-[#404040]"
            } flex items-center justify-center`}
          >
            {status !== "done" && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover transform -scale-x-100"
                playsInline
                muted
              />
            )}

            {/* Subtle Scanline */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <div className="w-full h-0.5 bg-white shadow-[0_0_10px_#ffffff] animate-scanline" />
              </div>
            )}

            {/* Completed State */}
            <AnimatePresence>
              {status === "done" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center justify-center p-4 text-center z-10"
                >
                  <Sparkles className="w-8 h-8 text-white mb-2" />
                  <span className="font-bold text-lg capitalize text-white tracking-tight">
                    {expression}
                  </span>
                  <span className="text-xs text-[#999999] mt-0.5">
                    {moodConfig.desc}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Trigger Button: Flat White Fill with 4px Radius */}
        {status !== "done" && status !== "processing" && (
          <button
            onClick={handleManualDetect}
            disabled={!isReady || status === "detecting"}
            className="btn-primary mb-3 text-sm px-6 py-2.5 cursor-pointer"
          >
            {status === "detecting" || status === "initializing" ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#121212]" />
            ) : (
              <Camera className="w-4 h-4 text-[#121212]" />
            )}
            <span>
              {!isReady || status === "initializing"
                ? "Starting camera…"
                : status === "detecting"
                ? "Scanning expression…"
                : status === "failed"
                ? "Retry Scan"
                : "Scan Facial Expression"}
            </span>
          </button>
        )}

        {/* Status Text */}
        <p className="text-xs text-[#999999] text-center mt-1">
          {status === "initializing" && "Calibrating camera model…"}
          {status === "ready" && "Center your face in the box and tap Scan."}
          {status === "detecting" && "Analyzing mood…"}
          {status === "processing" && `Matched: ${expression}. Loading track…`}
          {status === "done" && "Playing selected music stream…"}
          {status === "failed" && "No face detected. Ensure good lighting and try again."}
        </p>

        {/* Instant Vibe Chips */}
        <div className="mt-6 pt-5 border-t border-[#303030] w-full flex flex-col items-center">
          <span className="text-[11px] font-semibold text-[#999999] uppercase tracking-wider mb-2.5">
            Or select a mood manually
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {Object.entries(MOOD_META).map(([key]) => (
              <button
                key={key}
                onClick={() => {
                  killStream();
                  setStatus("processing");
                  setExpression(key);
                  Promise.resolve(onClick(key)).then(() => setStatus("done"));
                }}
                className="px-3 py-1 bg-[#303030] hover:bg-[#404040] text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer capitalize"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}