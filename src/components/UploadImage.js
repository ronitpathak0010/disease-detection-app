import React, { useRef, useState, useEffect } from 'react';
import { storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Webcam from 'react-webcam';
import './UploadImage.css'; // Import the CSS file

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyATlytcuc23xgRi6vzFFVKMtwCYrt4m2Hc');

const UploadImage = ({ onImageUpload, onBackToHome }) => {
  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [diseaseName, setDiseaseName] = useState('');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const webcamRef = useRef(null);

  // Clear state when the component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Reset all state variables
    setImage(null);
    setImageSrc(null);
    setDiseaseName('');
    setProgress(0);
    setErrorMessage('');
    setShowCamera(false);
    setAnalysisResult(null);
  }, []); // Empty dependency array ensures this runs only on mount

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const analyzeImage = async (file) => {
    try {
      const base64Image = await fileToGenerativePart(file);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        "Analyze this image of a plant leaf. Provide a detailed description of any disease or problem observed under the 'Problem' section and the suggested solutions under the 'Solution' section as bullet points.",
        base64Image,
      ]);

      const response = result.response.text();

      // Split the response into 'Problem' and 'Solution' sections
      const sections = response.split(/Solution:/i);

      const problemDescription = sections[0]
        .replace(/[*]/g, "") // Remove unwanted * symbols
        .trim()
        .split(/\.\s+/) // Split into bullet points
        .map((sentence) => sentence.trim());

      const possibleSolution = sections[1]
        ? sections[1]
            .replace(/[*]/g, "") // Remove unwanted * symbols
            .trim()
            .split(/\.\s+/) // Split into bullet points
            .map((sentence) => sentence.trim())
        : ["No solution provided."];

      return { problemDescription, possibleSolution };
    } catch (error) {
      console.error("Image analysis failed:", error);
      return {
        problemDescription: ["Analysis failed. Please try again."],
        possibleSolution: ["No solution provided."],
      };
    }
  };

  const fileToGenerativePart = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve({
          inlineData: {
            data: reader.result.split(',')[1],
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImageSrc(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (image && diseaseName) {
      const storageRef = ref(storage, `images/${image.name || 'captured_image'}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressPercent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progressPercent);
        },
        (error) => {
          console.error('Upload failed:', error);
          setErrorMessage('Upload failed. Please try again.');
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const analysisResult = await analyzeImage(image);

            const newImage = {
              name: diseaseName,
              imageUrl: downloadUrl,
              timestamp: new Date(),
              aiAnalysis: analysisResult.problemDescription,
              solution: analysisResult.possibleSolution,
            };

            await addDoc(collection(db, 'diseases'), newImage);
           
            if (onImageUpload) {
              onImageUpload(newImage);
            }

            setProgress(0);
            setDiseaseName('');
            setImage(null);
            setImageSrc(null);
            setShowCamera(false);
          } catch (error) {
            console.error('Failed to save data in Firestore:', error);
           
          }
        }
      );
    } else {
      setErrorMessage('Please provide both an image and a Crop/plant name.');
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImageSrc(imageSrc);
      setImage(dataURItoBlob(imageSrc));
      setShowCamera(false);
    }
  };

  const retakeImage = () => {
    setImageSrc(null);
    setImage(null);
    setShowCamera(true);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="upload-section">
      {/* Back to Homepage Button */}
      <button className="back-home-button" onClick={onBackToHome}>
        Back to Homepage
      </button>

      <div className="input-group">
        <input
          type="text"
          className="crop-input"
          placeholder="Enter Crop Name"
          value={diseaseName}
          onChange={(e) => setDiseaseName(e.target.value)}
        />
        <button
          className="voice-icon"
          onClick={() => speak('Enter the crop name')}
          aria-label="Voice assistance"
        >
          🔊
        </button>
      </div>

      {showCamera ? (
        <div className="camera-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <div className="camera-controls">
            <button className="action-button capture" onClick={captureImage}>
              Capture
            </button>
            <button className="action-button cancel" onClick={() => setShowCamera(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {!imageSrc && (
            <div className="file-upload-container">
              <label className="file-input-label">
                Choose File
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
              <span className="voice-icon" onClick={() => speak('Upload an image')}>
                🔊
              </span>
              <p className="upload-divider">or</p>
              <button
                className="capture-button"
                onClick={() => setShowCamera(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="camera-icon"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Capture Image
              </button>
            </div>
          )}
        </>
      )}

      {imageSrc && (
        <div className="preview-container">
          <img src={imageSrc} alt="Captured" className="preview-image" />
          <div className="preview-controls">
            <button className="action-button retake" onClick={retakeImage}>
              Retake
              <span className="voice-icon" onClick={() => speak('Retake the image')}>
                🔊
              </span>
            </button>
            <div className="upload-button-group">
              <button className="upload-button" onClick={handleUpload}>
                Upload
              </button>
              <button
                className="upload-voice-icon"
                onClick={() => speak('Upload the image')}
                aria-label="Voice assistance for upload"
              >
                🔊
              </button>
            
            </div>
          </div>
        </div>
      )}

      {progress > 0 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-bar-inner"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

  {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {analysisResult && (
        <div className="analysis-result">
          <h3>Analysis Result:</h3>
          <ul>
            {analysisResult.problemDescription.map((problem, index) => (
              <li key={index}>{problem}</li>
            ))}
          </ul>
          <h4>Possible Solutions:</h4>
          <ul>
            {analysisResult.possibleSolution.map((solution, index) => (
              <li key={index}>{solution}</li>
            ))}
          </ul>
          <div className="image-container">
            <img src={imageSrc} alt="Analysis" className="analysis-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;  
