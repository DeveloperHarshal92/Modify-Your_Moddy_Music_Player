import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

let globalLandmarker = null;
let isInitializing = false;

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
    if (!globalLandmarker && !isInitializing) {
        isInitializing = true;
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            globalLandmarker = await FaceLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "VIDEO",
                    numFaces: 1
                }
            );
        } finally {
            isInitializing = false;
        }
    } else if (isInitializing) {
        // Wait for it to finish initializing if another component triggered it
        while (isInitializing) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    landmarkerRef.current = globalLandmarker;

    let stream = null;
    let attempts = 0;
    while (!stream && attempts < 3) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err) {
            attempts++;
            if (attempts >= 3) throw err;
            await new Promise((r) => setTimeout(r, 500));
        }
    }
    
    streamRef.current = stream;
    videoRef.current.srcObject = streamRef.current;
    
    try {
        await videoRef.current.play();
    } catch (err) {
        if (err.name !== "AbortError") {
            throw err;
        }
    }
};

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now()
    );

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[ 0 ].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");

        console.log(getScore("mouthFrownLeft"))

        let currentExpression = "Neutral";

        if (smileLeft > 0.5 && smileRight > 0.5) {
            currentExpression = "happy";
        } else if (jawOpen > 0.2 && browUp > 0.2) {
            currentExpression = "surprised";
        } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
            currentExpression = "sad";
        }

        setExpression(currentExpression);

        return currentExpression
    }
};