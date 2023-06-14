import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import useMeasure from "react-use-measure";

import { CameraOptions, useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

const width = 500;
const height = 500;

const WebcamDemo = (): JSX.Element => {
  const [url, setUrl] = React.useState(null);
  const [ref, bounds] = useMeasure({ scroll: true });
  const { webcamRef, boundingBox, isLoading, detected, facesDetected } =
    useFaceDetection({
      faceDetectionOptions: {
        model: "short",
      },
      faceDetection: new FaceDetection.FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      }),
      camera: ({ mediaSrc, onFrame }: CameraOptions) =>
        new Camera(mediaSrc, {
          onFrame,
          width,
          height,
        }),
    });

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    setUrl(imageSrc);
  }, [webcamRef]);

  // console.log('## bounds', bounds);
  // console.log('## boundingBox', boundingBox);
  // boundingBox.forEach((box) => {
  //   console.log({
  //     top: `${box.yCenter * width}%`,
  //     left: `${box.xCenter * width}%`,
  //     width: `${box.width * width}%`,
  //     height: `${box.height * width}%`,
  //   });
  // });

  let boundingBoxData = {};
  boundingBox.forEach((box) => {
    boundingBoxData = {
      top: box.yCenter * width,
      left: box.xCenter * width,
      bottom: box.yCenter * width + box.height * width,
      right: box.xCenter * width + box.width * width,
      width: box.width * width,
      height: box.height * width,
    };
  });

  // console.log('## boundingBoxData', boundingBoxData);

  // bounds - oval
  // boundingBoxData - red border

  let isError = {};
  if (
    boundingBoxData?.top >= bounds.top &&
    boundingBoxData?.right <= bounds.right &&
    boundingBoxData?.bottom <= bounds.bottom &&
    boundingBoxData?.left >= bounds.left
  ) {
    console.log("## inside div", isError);
    isError = { ...isError, borderColor: "black" };
  } else {
    console.log("## outside div", isError);
    isError = { ...isError, borderColor: "red" };
  }

  console.log("isError", isError.borderColor);

  return (
    <div>
      {/* <p>{`Loading: ${isLoading}`}</p>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p> */}
      <div style={{ width, height, position: "relative" }}>
        {boundingBox.map((box, index) => (
          <div
            key={`${index + 1}`}
            style={{
              border: "4px solid red",
              position: "absolute",
              top: `${box.yCenter * 100}%`,
              left: `${box.xCenter * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 1,
            }}
          />
        ))}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Webcam
            ref={webcamRef}
            forceScreenshotSourceSize
            style={{
              height,
              width,
            }}
          />
          <div
            ref={ref}
            style={{
              position: "absolute",
              width: "60%",
              height: "70%",
              borderRadius: "50%",
              backgroundColor: "transparent",
              boxShadow:
                "inset 0 0 0 0px rgba(164, 165, 170, 0.2), 0 0 0 9999px rgba(52, 73, 92, 0.5)",
              top: "10%",
              borderWidth: 5,
              borderStyle: "dashed",
              borderColor: isError?.borderColor,
            }}
          />
        </div>
        <button
          type="button"
          onClick={capturePhoto}
          disabled={isError?.borderColor !== "black"}
        >
          Capture
        </button>
        <button type="button" onClick={() => setUrl(null)}>
          Refresh
        </button>
        {url && (
          <div>
            <img src={url} alt="Screenshot" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamDemo;
