import React, { useRef } from "react";

const DisplayImages = ({ images }) => {
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const speak = (text) => {
    if (utteranceRef.current) {
      speechSynthesisRef.current.cancel();
      utteranceRef.current = null;
      return;
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.onend = () => {
      utteranceRef.current = null;
    };
    speechSynthesisRef.current.speak(utteranceRef.current);
  };

  return (
    <div className="image-display">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className="analysis-card">
            <div className="analysis-header">
              <h2 className="crop-name">{image.name}</h2>
              <div className="image-container">
                <img
                  src={image.imageUrl}
                  alt={image.name}
                  className="analysis-image"
                />
              </div>
            </div>
           
            <div className="analysis-content">
              <div className="analysis-section">
                <h3 className="section-title">
                  Problem Identified
                  <button
                    className="voice-icon"
                    onClick={() => speak(image.aiAnalysis ? image.aiAnalysis.join(" ") : "No problem details available.")}
                    aria-label="Listen to problem"
                  >
                    🔊
                  </button>
                </h3>
                <div className="problem-details">
                  {image.aiAnalysis?.map((problem, idx) => (
                    <p key={idx} className="analysis-item">{problem}</p>
                  ))}
                </div>
              </div>

              <div className="analysis-section">
                <h3 className="section-title">
                  Recommended Solutions
                  <button
                    className="voice-icon"
                    onClick={() => speak(image.solution ? image.solution.join(" ") : "No solution provided.")}
                    aria-label="Listen to solutions"
                  >
                    🔊
                  </button>
                </h3>
                <div className="solution-details">
                  {image.solution?.map((solution, idx) => (
                    <p key={idx} className="analysis-item">{solution}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <h3>No Images Uploaded</h3>
          <p>Upload an image to see the analysis results here.</p>
        </div>
      )}
    </div>
  );
};

export default DisplayImages;
    