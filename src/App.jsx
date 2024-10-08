import { useState, useRef, useEffect } from 'react';
import { defaultResumeData } from './defaultResumeData';
import { ToastProvider } from './utils/Toast';
import useResizeObserver from '@react-hook/resize-observer';
import PDFRenderer from './components/PDFRenderer';
import EditMenu from './components/EditMenu';
import { Eye, Edit2 } from 'lucide-react';

function App() {
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState('edit');
  const [socialButton, setSocialButton] = useState('linkedin');

  const [resumeData, setResumeData] = useState(() => {
    const savedData = localStorage.getItem('resumeData');
    return savedData ? JSON.parse(savedData) : defaultResumeData;
  });

  const defaultSectionsOrder = [
    'education',
    'professionalExperience',
    'projects',
    'Skills',
  ];

  const [sectionsOrder, setSectionsOrder] = useState(() => {
    const savedOrder = localStorage.getItem('sectionsOrder');
    return savedOrder ? JSON.parse(savedOrder) : defaultSectionsOrder;
  });

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('sectionsOrder', JSON.stringify(sectionsOrder));
  }, [sectionsOrder]);

  const previewContainerRef = useRef(null);

  const DOC_WIDTH_MM = 210; // A4 width in mm
  const DOC_HEIGHT_MM = 297; // A4 height in mm
  const MM_TO_PIXEL = 3.7795275591;

  useResizeObserver(previewContainerRef, (entry) => {
    const { width, height } = entry.contentRect;
    const docWidth = DOC_WIDTH_MM * MM_TO_PIXEL;
    const docHeight = DOC_HEIGHT_MM * MM_TO_PIXEL;

    // Calculate scale based on width
    const scaleByWidth = width / docWidth;

    // Calculate scale based on height
    const scaleByHeight = height / docHeight;

    // Use the smaller scale to ensure it fits in both dimensions
    const newScale = Math.min(scaleByWidth, scaleByHeight) - 0.1;

    // Limit the scale between 0.2 and 0.8
    setScale(Math.max(0.2, Math.min(newScale, 0.8)));
  });

  const handlers = {
    inclusionHandler: handleInclusion,
    resumeDataHandler: handleResumeData,
    socialHandler: handleSelectSocial,
    experienceHandler: handleExperienceUpdate,
    educationHandler: handleEducationUpdate,
    projectsHandler: handleProjectsUpdate,
    sectionOrderHandler: handleSectionsOrder,
    customSectionHandler: handleCustomSection,
    deleteCustomSectionHandler: handleDeleteCustomSection,
  };

  function handleResumeData(eventOrData, clear = false, reset = false) {
    if (reset) {
      setResumeData(defaultResumeData);
      setSectionsOrder(defaultSectionsOrder);
      return;
    }

    if (clear) {
      setSectionsOrder([]);
      setResumeData({});
    }

    if (eventOrData && eventOrData.target) {
      const { name, value } = eventOrData.target;
      setResumeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (typeof eventOrData === 'object') {
      setResumeData(eventOrData);
      setSectionsOrder(Object.keys(eventOrData.includeSections));
    }
  }

  function handleInclusion(updatedInclusionObject) {
    setResumeData((prevData) => ({
      ...prevData,
      includeSections: updatedInclusionObject,
    }));
  }

  function handleEducationUpdate(updatedEducationList) {
    setResumeData((prevData) => ({
      ...prevData,
      educationList: updatedEducationList,
    }));
  }

  function handleExperienceUpdate(updatedExperienceList) {
    setResumeData((prevData) => ({
      ...prevData,
      experienceList: updatedExperienceList,
    }));
  }

  function handleSelectSocial(button) {
    setSocialButton(button);
  }

  function handleSectionsOrder(order) {
    setSectionsOrder(order);
  }

  function handleProjectsUpdate(updatedProjectsList) {
    setResumeData((prevData) => ({
      ...prevData,
      projectsList: updatedProjectsList,
    }));
  }

  function handleCustomSection(updatedCustomSectionData) {
    setResumeData((prevData) => ({
      ...prevData,
      customSectionData: updatedCustomSectionData,
    }));
  }

  function handleDeleteCustomSection(sectionName) {
    setSectionsOrder((prevOrder) =>
      prevOrder.filter((section) => section !== sectionName)
    );

    setResumeData((prevData) => {
      const updatedIncludeSections = { ...prevData.includeSections };
      delete updatedIncludeSections[sectionName];

      const updatedCustomSectionData = prevData.customSectionData.filter(
        (section) => section.title !== sectionName
      );

      return {
        ...prevData,
        includeSections: updatedIncludeSections,
        customSectionData: updatedCustomSectionData,
      };
    });
  }

  function toggleViewMode() {
    setViewMode(viewMode === 'edit' ? 'preview' : 'edit');
  }

  return (
    <ToastProvider>
      <div className="flex h-screen min-h-screen font-normal antialiased">
        {/* Edit Menu */}
        <div
          className={`h-full w-full overflow-y-scroll bg-black lg:w-6/12 ${
            viewMode === 'edit' ? 'block' : 'hidden'
          } lg:block`}
        >
          <EditMenu
            resumeData={resumeData}
            selectedSocial={socialButton}
            sectionsOrder={sectionsOrder}
            scale={scale}
            handlers={handlers}
          ></EditMenu>
        </div>
        {/* CV Preview */}
        <div
          ref={previewContainerRef}
          className={`flex w-full items-center justify-center bg-base-100 lg:w-6/12 ${
            viewMode === 'preview' ? 'flex' : 'hidden'
          } lg:flex`}
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div className="border-2 border-slate-200 bg-white text-black shadow-2xl">
            <PDFRenderer
              resumeData={resumeData}
              selectedSocial={socialButton}
              sectionsOrder={sectionsOrder}
            ></PDFRenderer>
          </div>
        </div>
        <button
          className="btn btn-accent btn-md fixed bottom-6 right-6 z-40 rounded-lg text-lg font-semibold lg:hidden"
          onClick={toggleViewMode}
        >
          {viewMode === 'edit' ? (
            <>
              <Eye size={18} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <Edit2 size={18} />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>
    </ToastProvider>
  );
}

export default App;
