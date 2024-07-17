import { useState } from 'react';
import { testResumeData } from './testResumeData';
import PDFRenderer from './components/PDFRenderer';
import EditMenu from './components/EditMenu';

function App() {
  const [resumeData, setResumeData] = useState(testResumeData);
  const [socialButton, setSocialButton] = useState('linkedin');

  function onInput(event) {
    const { name, value } = event.target;
    setResumeData({
      ...resumeData,
      [name]: value,
    });
  }

  function handleSelectSocial(button) {
    setSocialButton(button);
  }

  return (
    <div className="min-h-screen flex">
      <EditMenu
        resumeData={resumeData}
        inputHandler={onInput}
        socialHandler={handleSelectSocial}
        selectedSocial={socialButton}
      ></EditMenu>
      <div className="w-6/12 flex overflow-scroll justify-center items-center">
        <div className="shadow-2xl border-slate-200 border-2">
          <PDFRenderer
            resumeData={resumeData}
            selectedSocial={socialButton}
          ></PDFRenderer>
        </div>
      </div>
    </div>
  );
}

export default App;
