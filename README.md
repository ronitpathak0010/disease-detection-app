Krishi Raksha seeks to overcome the challenges of plant disease and pest diagnosis with the following objectives:

AI-Powered Diagnostics: Develop an AI-powered application that processes images of plants to diagnose diseases and pests effectively.

Real-Time Results: Provide real-time diagnostic results with actionable recommendations to help farmers take immediate measures.

Accessibility: Ensure the tool is highly accessible even to farmers with minimal technological literacy.

Sustainability: Promote sustainable agriculture by enabling precise, data-driven decision-making.

User-Friendliness: Incorporate features such as voice assistants and intuitive navigation to enhance usability for end users.


Scope of the Project:
Krishi Raksha is designed as an integrated digital solution for plant health management, with the following core functionalities:

AI-Powered Diagnostics: Utilize Gemini AI to perform real-time image analysis and provide immediate feedback on plant health.

Actionable Recommendations: Offer practical and actionable recommendations for every detection.

Scalability: Build a system capable of supporting various crops and farming practices, with future potential for IoT integration.

User Accessibility: Enhance accessibility for users with poor literacy or low technical skills through voice guidance and a user-friendly interface. 


The core of Krishi Raksha is AI; as such, Gemini AI has been used as the main engine for disease and pest diagnosis. To maximize efficiency and reduce implementation simplicity, 
the app bypasses traditional odel training and preprocessing. 


Direct AI Integration 

 API-Based Analysis: Gemini AI has been integrated through an API that offers on-the-spot 
processing of user-uploaded images. This eliminates the need for custom model training by 
developers and pre-processing of datasets.

 Plug-and-Play Implementation: With pre-trained models, the system is ready to analyze raw user 
inputs without additional overhead for augmenting or cleaning the data.

 Standardized Outputs: Gemini AI ensures uniformity in output formats, hence simplifying how 
diagnostic information is presented to the user. 

 
PSEUDO CODE:
 
START 
//Initialize application 
FUNCTION initializeApp() 
    SET up user interface 
    SET up event listeners for buttons 
END FUNCTION 
 
// Function to handle file selection 
FUNCTION onChooseFile() 
    DISPLAY file chooser dialog 
    IF file is selected THEN 
        UPLOAD file 
        DISPLAY file name 
    END IF 
END FUNCTION 
 
// Function to handle image capture 
FUNCTION onCaptureImage() 
    OPEN camera interface 
    IF image is captured THEN 
        UPLOAD captured image 
        DISPLAY image preview 
    END IF 
END FUNCTION 
  
// Function to analyze uploaded image 
FUNCTION analyzeImage(image) 
    SEND image to server for analysis 
    RECEIVE analysis results 
    DISPLAY results to user 
END FUNCTION 
 
// Function to handle back to homepage action 
FUNCTION onBackToHome() 
    NAVIGATE to homepage 
END FUNCTION 
 
// Main application flow 
FUNCTION main() 
    CALL initializeApp() 
    WHILE application is running DO 
        WAIT for user interaction 
        IF user chooses file THEN 
            CALL onChooseFile() 
        ELSE IF user captures image THEN 
            CALL onCaptureImage() 
        ELSE IF user clicks back button THEN 
            CALL onBackToHome() 
        END IF 
    END WHILE 
END FUNCTION 
 
// Start the application 
CALL main() 
END
 


CONCLUSION:
Krishi Raksha represents one of the first steps taken to update agriculture by using AI-powered 
diagnostics for disease and pests. Its development demonstrated the potential of leveraging pre- 
trained AI models like Gemini AI in empowering farmers with real-time, actionable insights. Though 
challenges remain, such as connectivity issues, data privacy, and user adoption, the foundational 
success of the app let it shine in its transformative potential.
