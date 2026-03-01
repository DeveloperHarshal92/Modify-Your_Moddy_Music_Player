import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({landmarkerRef,videoRef,streamRef}) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  streamRef.current= await navigator.mediaDevices.getUserMedia({ video: true });
  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();
};

export const detect = ({landmarkerRef,videoRef,setExpression}) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now(),
  );

  if (!results.faceBlendshapes?.length) {
    setExpression("No face detected");
    return;
  }

  const blendshapes = results.faceBlendshapes[0].categories;

  const score = (name) =>
    blendshapes.find((b) => b.categoryName === name)?.score || 0;

  const smile = score("mouthSmileLeft") > 0.5 && score("mouthSmileRight") > 0.5;

  const surprised = score("jawOpen") > 0.25 && score("browInnerUp") > 0.25;

  const sad =
    score("mouthFrownLeft") > 0.001 && score("mouthFrownRight") > 0.001;

  let result = "Neutral 😐";
  if (smile) result = "Happy 😄";
  else if (surprised) result = "Surprised 😲";
  else if (sad) result = "Sad 😢";

  setExpression(result);
};
