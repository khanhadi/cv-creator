import { useState } from 'react';
import CVPage from './components/CVPage';
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
      <div className="w-6/12 flex justify-center items-center">
        <CVPage resumeData={resumeData}></CVPage>
      </div>
    </div>
  );
}

export default App;
