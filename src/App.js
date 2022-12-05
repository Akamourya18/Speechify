import { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { useSpeechSynthesis } from 'react-speech-kit';
import './App.css';
function App() {
  const [ocr, setOcr] = useState(''); 
  const [imageData, setImageData] = useState(null); // image data
  const [progress, setProgress] = useState(0); // progress bar
  const { speak } = useSpeechSynthesis(); // speech synthesis
  const { cancel } =  useSpeechSynthesis(); 

  const worker = createWorker({ // create worker
    logger: (m) => {
      console.log(m);
      setProgress(parseInt(m.progress * 100)); 
    },
  });

  const handleOnClick = () => { // handle on click event of button
    speak({ text: ocr });
  };

  const handleOnClickTwo = () => { // handle on click event of button
    cancel();
  };

  const convertImageToText = async () => { 
    if (!imageData) return;
    await worker.load(); 
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text },
    } = await worker.recognize(imageData); // recognize image
    setOcr(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) { 
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="Main">
      <h1>OCR TOOL</h1>
    <div className="App">
      <div>
       {/* <p className="Heading">UPLOAD AN IMAGE</p> */}
        <label class="custom-file-upload">
          <input
            type="file"
            name=""
            id=""
            onChange={handleImageChange}
            accept="image/*"
          />
        </label>
      </div>

      {progress < 100 && progress > 0 && ( // progress bar
        <div>
          <div className="progress-label">Progress ({progress}%)</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
      <div className="imageDisplay">
        <img src={imageData} alt="" srcset="" />
        <div> <br></br>
          <p className='placeholderText'>
            <textarea className="textAreaStyle" placeholder={ocr}></textarea> <br></br>
            <button
              className="buttonStyle"
              onClick={() => {
                handleOnClick();
              }}
            >
              Listen
            </button> 
            <button
              className="buttonStyle"
              onClick={() => {
                handleOnClickTwo();
              }}
            >
              Stop
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
export default App;