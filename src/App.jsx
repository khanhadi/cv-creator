import { useState } from 'react';
import PDFRenderer from './components/PDFRenderer';
import EditMenu from './components/EditMenu';

function App() {
  const [resumeData, setResumeData] = useState({
    firstName: '',
    lastName: '',
  });

  function onInput(event) {
    const { name, value } = event.target;
    setResumeData({
      ...resumeData,
      [name]: value,
    });
  }

  return (
    <div className="min-h-screen flex">
      <EditMenu resumeData={resumeData} inputHandler={onInput}></EditMenu>
      <div className="w-6/12 flex overflow-scroll justify-center items-center">
        <div className="shadow-2xl">
          <PDFRenderer resumeData={resumeData}></PDFRenderer>
        </div>
      </div>
    </div>
  );
}

export default App;
