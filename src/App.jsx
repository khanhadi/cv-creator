import { useState } from 'react';
import EditMenu from './components/EditMenu';
import CVContent from './components/CVContent';

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
          <CVContent resumeData={resumeData}></CVContent>
        </div>
      </div>
    </div>
  );
}

export default App;
