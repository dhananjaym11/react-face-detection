/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import Webcam from 'react-webcam';
import useMeasure from 'react-use-measure';

import { useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

const WebcamDemo = () => {
  const [url, setUrl] = React.useState(null);
  const [ref, bounds] = useMeasure({ scroll: true });
  const [pageRef, pageBounds] = useMeasure({ scroll: true });

  useEffect(() => {
    const alertFn = window.alert;
    window.alert = () => {};
    setTimeout(() => {
      window.alert = alertFn;
      alert('test');
    }, 1000);
  }, []);

  const { width, height } = pageBounds;

  const { webcamRef, boundingBox } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame }) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  });

  const ovalHeight = height > 900 ? '450px' : '350px';

  let ovalWidth = '250px';
  if (width > 720) {
    ovalWidth = '400px';
  } else if (width > 500) {
    ovalWidth = '300px';
  }

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    setUrl(imageSrc);
  }, [webcamRef]);

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

  // bounds - oval
  // boundingBoxData - red border

  let isError = {};
  if (
    boundingBoxData?.top >= bounds.top &&
    boundingBoxData?.right <= bounds.right &&
    boundingBoxData?.bottom <= bounds.bottom &&
    boundingBoxData?.left >= bounds.left
  ) {
    isError = { ...isError, borderColor: 'black' };
  } else {
    isError = { ...isError, borderColor: 'red' };
  }

  return (
    <div ref={pageRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {boundingBox.map((box, index) => (
        <div
          key={`${index + 1}`}
          style={{
            border: '4px solid red',
            position: 'absolute',
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
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          height,
        }}
      >
        <Webcam
          ref={webcamRef}
          style={{ objectFit: 'cover', height: '100%' }}
          // onUserMediaError={(err) => console.log('## err', err)}
        />
        <div
          ref={ref}
          style={{
            position: 'absolute',
            width: ovalWidth,
            height: ovalHeight,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            boxShadow:
              'inset 0 0 0 0px rgba(164, 165, 170, 0.2), 0 0 0 9999px rgba(52, 73, 92, 0.5)',
            top: '10%',
            borderWidth: 5,
            borderStyle: 'dashed',
            borderColor: isError?.borderColor,
          }}
        />
      </div>
      <div>
        <button type="button" onClick={capturePhoto}>
          Capture
        </button>
        <button type="button" onClick={() => setUrl(null)}>
          Refresh
        </button>
        {url && (
          <div>
            <img src={url} alt="Screenshot" style={{ width: 500, height: 500 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamDemo;
