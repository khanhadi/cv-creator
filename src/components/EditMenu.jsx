import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Reorder } from 'framer-motion';
import { usePDF } from '@react-pdf/renderer';
import { Trash2 } from 'lucide-react';
import { useToast } from '../utils/Toast';
import DraggableItem from './ui/DraggableItem';
import CVContent from './CVContent';
import SocialInput from './ui/SocialInput';
import EducationCard from './ui/cards/EducationCard';
import ProfessionCard from './ui/cards/ProfessionCard';
import ProjectsCard from './ui/cards/ProjectsCard';
import AddCustomSection from './ui/AddCustomSection';
import CustomSectionCard from './ui/cards/CustomSectionCard';
import Modal from './ui/Modal';
import validateResumeData from '../utils/validateResumeData';

export default function EditMenu({
  resumeData,
  selectedSocial,
  sectionsOrder,
  scale,
  handlers,
}) {
  const {
    inclusionHandler,
    resumeDataHandler,
    socialHandler,
    experienceHandler,
    educationHandler,
    projectsHandler,
    sectionOrderHandler,
    customSectionHandler,
  } = handlers;

  const document = useMemo(
    () => (
      <CVContent
        resumeData={resumeData}
        selectedSocial={selectedSocial}
        sectionsOrder={sectionsOrder}
      />
    ),
    [resumeData, selectedSocial, sectionsOrder]
  );

  const sendToast = useToast();

  const [exportUrl, setExportUrl] = useState(null);
  const exportLinkRef = useRef(null);
  const fileInputRef = useRef(null);
  const isProcessingExport = useRef(false);

  const [instance, update] = usePDF({ document });
  const [uiState, setUiState] = useState({
    reorderToggle: false,
    doneEditing: false,
    isGenerateButtonEnabled: true,
    loadedFile: '',
  });
  const [modalState, setModalState] = useState({
    deleteSection: {
      isOpen: false,
      sectionName: null,
    },
  });

  ////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setUiState((prevState) => ({
      ...prevState,
      isGenerateButtonEnabled: true,
      doneEditing: false,
    }));
  }, [resumeData, sectionsOrder]);

  const OnReorderToggle = (e) => {
    setUiState((prevState) => ({
      ...prevState,
      reorderToggle: e.target.checked,
    }));
  };

  const OnGeneratePDF = () => {
    setUiState((prevState) => ({
      ...prevState,
      doneEditing: true,
      isGenerateButtonEnabled: false,
    }));
    update(document);
  };

  const OnIncludeCheckboxChange = (sectionName) => {
    const updatedInclusionObject = {
      ...resumeData.includeSections,
      [sectionName]: !resumeData.includeSections[sectionName],
    };

    inclusionHandler(updatedInclusionObject);
  };
  ////////////////////////////////////////////////////////////////////////////
  const onCustomSectionDataUpdate = (updatedData) => {
    const { title, items } = updatedData;

    let sectionExists = false;
    const updatedCustomSectionData = resumeData.customSectionData.map(
      (section) => {
        if (section.title === title) {
          sectionExists = true;
          return { ...section, items };
        }
        return section;
      }
    );

    if (!sectionExists) {
      updatedCustomSectionData.push({ title, items });
    }

    customSectionHandler(updatedCustomSectionData);
  };
  const getCustomSectionData = (customSectionData, sectionTitle) => {
    const existingSection = customSectionData.find(
      (section) => section.title === sectionTitle
    );

    if (existingSection) {
      return existingSection;
    } else {
      const newSection = {
        title: sectionTitle,
        items: [],
      };
      return newSection;
    }
  };
  const openDeleteModal = (sectionName) => {
    setModalState((prevState) => ({
      ...prevState,
      deleteSection: { isOpen: true, sectionName },
    }));
  };
  const closeDeleteModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      deleteSection: { isOpen: false, sectionName: null },
    }));
  };
  const handleDeleteConfirm = () => {
    const { sectionName } = modalState.deleteSection;
    if (sectionName) {
      handleDeleteCustomSection(sectionName);
      closeDeleteModal();
    }
  };
  const handleDeleteCustomSection = (sectionName) => {
    const updatedSectionsOrder = sectionsOrder.filter(
      (section) => section !== sectionName
    );
    sectionOrderHandler(updatedSectionsOrder);

    const updatedIncludeSections = { ...resumeData.includeSections };
    delete updatedIncludeSections[sectionName];
    inclusionHandler(updatedIncludeSections);

    const updatedCustomSectionData = resumeData.customSectionData.filter(
      (section) => section.title !== sectionName
    );
    customSectionHandler(updatedCustomSectionData);
  };
  ////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (exportUrl && exportLinkRef.current && !isProcessingExport.current) {
      isProcessingExport.current = true;
      exportLinkRef.current.click();
      URL.revokeObjectURL(exportUrl);

      // Use setTimeout to defer the state update
      setTimeout(() => {
        setExportUrl(null);
        isProcessingExport.current = false;
      }, 0);
    }
  }, [exportUrl, sendToast]);

  const handleExport = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isProcessingExport.current) return;
      const dataStr = JSON.stringify(resumeData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      sendToast('Resume data exported successfully!', 'success');
      const url = URL.createObjectURL(blob);
      setExportUrl(url);
    },
    [resumeData, sendToast]
  );

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleImport = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) {
        sendToast('No file selected', 'error');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (validateResumeData(importedData)) {
            handlers.resumeDataHandler(importedData, true);
            sendToast('Resume data imported successfully!', 'success');
            setUiState((prevState) => ({
              ...prevState,
              loadedFile: file.name,
            }));
          } else {
            sendToast(
              'Invalid resume data format. Please check your file or export again.',
              'error'
            );
          }
        } catch (error) {
          console.error('Error importing resume data:', error);
          sendToast(
            'Error importing resume data. Please check the file format.',
            'error'
          );
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        sendToast('Error reading file. Please try again.', 'error');
      };

      reader.readAsText(file);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handlers, sendToast]
  );

  function renderSection(sectionName) {
    const { reorderToggle } = uiState;

    switch (sectionName) {
      case 'personalInformation':
        return (
          <div className="collapse collapse-arrow bg-white m-1">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl text-black font-medium">
              Personal Information
            </div>
            <div className="collapse-content">
              <div className="flex flex-col sm:flex-row gap-2 ">
                <label className="form-control w-full sm:w-1/2">
                  <div className="label">
                    <span className="label-text">Name</span>
                  </div>
                  <input
                    name="fullName"
                    value={resumeData.fullName}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control w-full sm:w-1/2">
                  <div className="label">
                    <span className="label-text">Mobile No.</span>
                  </div>
                  <input
                    name="mobileNo"
                    value={resumeData.mobileNo}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <label className="form-control w-full sm:w-1/2 flex">
                  <div className="label">
                    <span className="label-text">Email</span>
                  </div>
                  <input
                    name="email"
                    value={resumeData.email}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
                <div className="w-full sm:w-1/2">
                  <SocialInput
                    socialLink={resumeData.socialLink}
                    resumeDataHandler={resumeDataHandler}
                    socialHandler={socialHandler}
                    selectedSocial={selectedSocial}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'professionalExperience':
        return (
          <div
            className={`collapse ${
              reorderToggle ? 'rounded-tl-none' : ''
            } collapse-arrow bg-white m-1`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title flex text-xl text-black font-medium">
              <input
                type="checkbox"
                checked={resumeData.includeSections.professionalExperience}
                onChange={() =>
                  OnIncludeCheckboxChange('professionalExperience')
                }
                className="checkbox z-10 checkbox-accent mr-2"
              />
              Professional Experience
            </div>
            <div className="collapse-content text-black">
              <ProfessionCard
                experienceList={resumeData.experienceList}
                onExperienceUpdate={experienceHandler}
              />
            </div>
          </div>
        );

      case 'education':
        return (
          <div
            className={`collapse ${
              reorderToggle ? 'rounded-tl-none' : ''
            } collapse-arrow bg-white m-1`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title flex text-black text-xl font-medium">
              <input
                type="checkbox"
                checked={resumeData.includeSections.education}
                onChange={() => OnIncludeCheckboxChange('education')}
                className="checkbox z-10 checkbox-accent mr-2"
              />
              Education
            </div>
            <div className="collapse-content text-black">
              <EducationCard
                educationList={resumeData.educationList}
                onEducationUpdate={educationHandler}
              />
            </div>
          </div>
        );
      case 'projects':
        return (
          <div
            className={`collapse ${
              reorderToggle ? 'rounded-tl-none' : ''
            } collapse-arrow bg-white m-1`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title flex text-black text-xl font-medium">
              <input
                type="checkbox"
                checked={resumeData.includeSections.projects}
                onChange={() => OnIncludeCheckboxChange('projects')}
                className="checkbox z-10 checkbox-accent mr-2"
              />
              Projects
            </div>
            <div className="collapse-content text-black">
              <ProjectsCard
                projectsList={resumeData.projectsList}
                onProjectsUpdate={projectsHandler}
              />
            </div>
          </div>
        );
      default: {
        // Handle custom sections
        const customSection = sectionsOrder.find(
          (section) => section === sectionName
        );

        if (customSection) {
          const sectionData = getCustomSectionData(
            resumeData.customSectionData,
            customSection
          );
          return (
            <div
              className={`collapse ${
                reorderToggle ? 'rounded-tl-none' : ''
              } collapse-arrow bg-white m-1`}
            >
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title flex text-black text-xl font-medium">
                <input
                  type="checkbox"
                  checked={resumeData.includeSections[sectionName]}
                  onChange={() => OnIncludeCheckboxChange(sectionName)}
                  className="checkbox z-10 checkbox-accent mr-2"
                />
                {customSection}
                <button
                  onClick={() => openDeleteModal(sectionName)}
                  className="btn btn-error btn-sm h-7 min-h-7 ml-auto z-10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="collapse-content text-black">
                <CustomSectionCard
                  sectionTitle={customSection}
                  sectionItemsList={sectionData.items}
                  onSectionUpdate={onCustomSectionDataUpdate}
                />
              </div>
            </div>
          );
        }
        return null;
      }
    }
  }
  ////////////////////////////////////////////////////////////////////////////
  return (
    <div className="p-3 flex justify-center">
      <div className="w-11/12 py-4">
        <div className="flex gap-2 mb-2 p-1 items-center-center">
          <h1 className="text-white font-light text-2xl">
            cv<span className="text-accent font-extrabold">creator</span>
          </h1>
          {/* Generate Button */}
          <button
            onClick={OnGeneratePDF}
            disabled={!uiState.isGenerateButtonEnabled}
            className={`btn btn-accent btn-sm ml-auto ${
              !uiState.isGenerateButtonEnabled ? 'hidden' : ''
            }`}
          >
            Generate PDF
          </button>
          {/* Download Button */}
          {uiState.doneEditing &&
            (instance.loading ? (
              <span className="loading loading-spinner text-accent"></span>
            ) : (
              <button className="btn btn-accent btn-sm ml-auto">
                <a href={instance.url} download="CV.pdf">
                  Download
                </a>
                <i className="icon icon-16 icon-download"></i>
              </button>
            ))}
        </div>
        <div className="flex">
          <div className="flex justify-center items-center">
            <div className="flex flex-col  px-1 py-2">
              <span className="text-white">{`Resume Data: ${uiState.loadedFile}`}</span>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="btn btn-sm btn-warning"
                >
                  Export
                </button>
                <a
                  ref={exportLinkRef}
                  href={exportUrl}
                  download={
                    resumeData.fullName.split(' ')[0] + `_resume_data.json`
                  }
                  style={{ display: 'none' }}
                />
                <button
                  onClick={handleImportClick}
                  className="btn btn-sm btn-warning"
                >
                  Import
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="file-input file-input-sm hidden"
            />
          </div>

          {/* Reorder Button */}
          <label className="label gap-2 ml-auto cursor-point self-end">
            <span className="label-text text-white">Reorder</span>
            <input
              type="checkbox"
              onChange={OnReorderToggle}
              checked={uiState.reorderToggle}
              className="toggle border-white bg-accent [--tglbg:black] hover:bg-accent"
            />
          </label>
        </div>
        {/* Sections */}
        {renderSection('personalInformation')}
        <Reorder.Group
          axis="y"
          values={sectionsOrder}
          onReorder={sectionOrderHandler}
          key={scale}
        >
          {sectionsOrder.map((section) => (
            <DraggableItem
              key={section}
              item={section}
              renderSection={renderSection}
              isReorderingEnabled={uiState.reorderToggle}
            />
          ))}
        </Reorder.Group>

        {/* Add Custom Section */}
        <div className={`card p-4 w-full bg-white m-1`}>
          <AddCustomSection
            sectionsOrder={sectionsOrder}
            inclusionObject={resumeData.includeSections}
            handleSectionOrder={sectionOrderHandler}
            handleInclusion={inclusionHandler}
            handleSectionData={onCustomSectionDataUpdate}
          ></AddCustomSection>
        </div>
      </div>

      <Modal
        isOpen={modalState.deleteSection.isOpen}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        size="max-w-md"
      >
        <p>
          Are you sure you want to delete the{' '}
          <span className="font-semibold">
            {modalState.deleteSection.sectionName}
          </span>{' '}
          section? This action cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn btn-sm btn-accent" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
