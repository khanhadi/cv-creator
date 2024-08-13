import { useState, useRef } from 'react';
import { testResumeData } from './testResumeData';
import useResizeObserver from '@react-hook/resize-observer';
import PDFRenderer from './components/PDFRenderer';
import EditMenu from './components/EditMenu';

function App() {
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState('edit');
  const [resumeData, setResumeData] = useState(testResumeData);
  const [socialButton, setSocialButton] = useState('linkedin');

  const previewContainerRef = useRef(null);

  const DOC_WIDTH_MM = 168;
  const MM_TO_PIXEL = 3.7795275591;

  useResizeObserver(previewContainerRef, (entry) => {
    const { width } = entry.contentRect;
    const docWidth = DOC_WIDTH_MM * MM_TO_PIXEL;
    const newScale = width / docWidth;
    setScale(newScale <= 1 ? newScale : 1);
  });

  function handleEducationUpdate(updatedEducationList) {
    setResumeData({
      ...resumeData,
      educationList: updatedEducationList,
    });
  }

  function handleExperienceUpdate(updatedExperienceList) {
    setResumeData({
      ...resumeData,
      experienceList: updatedExperienceList,
    });
  }

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

  function toggleViewMode() {
    setViewMode(viewMode === 'edit' ? 'preview' : 'edit');
  }

  return (
    <div className="max-h-screen h-screen flex">
      {/* Edit Menu */}
      <div
        className={`w-full lg:w-6/12 bg-black overflow-y-scroll h-full ${
          viewMode === 'edit' ? 'block' : 'hidden'
        } lg:block`}
      >
        <EditMenu
          resumeData={resumeData}
          inputHandler={onInput}
          socialHandler={handleSelectSocial}
          experienceHandler={handleExperienceUpdate}
          educationHandler={handleEducationUpdate}
          selectedSocial={socialButton}
        ></EditMenu>
      </div>

      {/* CV Preview */}
      <div
        ref={previewContainerRef}
        className={`p-10 w-full lg:w-6/12 flex justify-center items-center ${
          viewMode === 'preview' ? 'flex' : 'hidden'
        } lg:flex`}
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <div className="shadow-2xl border-slate-200 border-2">
          <PDFRenderer
            resumeData={resumeData}
            selectedSocial={socialButton}
          ></PDFRenderer>
        </div>
      </div>
      <button
        className="lg:hidden fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={toggleViewMode}
      >
        {viewMode === 'edit' ? 'Show Preview' : 'Show Edit Menu'}
      </button>
    </div>
  );
}

export default App;
