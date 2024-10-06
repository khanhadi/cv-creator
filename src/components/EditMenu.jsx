import { useState, useEffect, useMemo } from 'react';
import { Reorder } from 'framer-motion';
import { usePDF } from '@react-pdf/renderer';
import { Trash2 } from 'lucide-react';
import ResumeDataTools from './ui/ResumeDataTools';
import DraggableItem from './ui/DraggableItem';
import CVContent from './CVContent';
import SocialInput from './ui/SocialInput';
import EducationCard from './ui/cards/EducationCard';
import ProfessionCard from './ui/cards/ProfessionCard';
import ProjectsCard from './ui/cards/ProjectsCard';
import AddCustomSection from './ui/AddCustomSection';
import CustomSectionCard from './ui/cards/CustomSectionCard';
import Modal from './ui/Modal';

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
    deleteCustomSectionHandler,
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
      deleteCustomSectionHandler(sectionName); // Use the new handler from App.jsx
      closeDeleteModal();
    }
  };

  function renderSection(sectionName) {
    const { reorderToggle } = uiState;

    switch (sectionName) {
      case 'personalInformation':
        return (
          <div className="collapse collapse-arrow m-1 bg-white">
            <input type="radio" name="my-accordion-2" defaultChecked />
            <div className="collapse-title text-xl font-medium text-black">
              Personal Information
            </div>
            <div className="collapse-content">
              <div className="flex flex-col gap-2 sm:flex-row">
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
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <label className="form-control flex w-full sm:w-1/2">
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
            } collapse-arrow m-1 bg-white`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title flex text-xl font-medium text-black">
              <input
                type="checkbox"
                checked={resumeData.includeSections.professionalExperience}
                onChange={() =>
                  OnIncludeCheckboxChange('professionalExperience')
                }
                className="checkbox-accent checkbox z-10 mr-2"
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
            } collapse-arrow m-1 bg-white`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title flex text-xl font-medium text-black">
              <input
                type="checkbox"
                checked={resumeData.includeSections.education}
                onChange={() => OnIncludeCheckboxChange('education')}
                className="checkbox-accent checkbox z-10 mr-2"
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
            } collapse-arrow m-1 bg-white`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title flex text-xl font-medium text-black">
              <input
                type="checkbox"
                checked={resumeData.includeSections.projects}
                onChange={() => OnIncludeCheckboxChange('projects')}
                className="checkbox-accent checkbox z-10 mr-2"
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
              } collapse-arrow m-1 bg-white`}
            >
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title flex text-xl font-medium text-black">
                <input
                  type="checkbox"
                  checked={resumeData.includeSections[sectionName]}
                  onChange={() => OnIncludeCheckboxChange(sectionName)}
                  className="checkbox-accent checkbox z-10 mr-2"
                />
                {customSection}
                {/* Delete custom section button */}
                <button
                  onClick={() => openDeleteModal(sectionName)}
                  className="btn btn-error btn-sm z-10 ml-auto h-7 min-h-7"
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

  return (
    <div className="flex justify-center p-3">
      <div className="mb-20 w-11/12 py-4">
        <div className="items-center-center mb-2 flex gap-2 p-1">
          <div className="flex flex-col">
            <h1 className="text-2xl font-light text-white">
              cv<span className="font-extrabold text-accent">creator</span>
            </h1>
            <h1 className="flex gap-1 text-sm font-light text-white">
              by{' '}
              <a
                href="https://khanhadi.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="hover:text-accent-focus flex font-extrabold text-accent">
                  khanhadi
                </span>
              </a>
            </h1>
          </div>
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
              <a href={instance.url} className="ml-auto" download="CV.pdf">
                <button className="btn btn-accent btn-sm">
                  Download
                  <i className="icon icon-16 icon-download"></i>
                </button>
              </a>
            ))}
        </div>
        <div className="flex">
          <ResumeDataTools
            resumeData={resumeData}
            resumeDataHandler={resumeDataHandler}
            uiState={uiState}
            setUiState={setUiState}
            handlers={handlers}
          ></ResumeDataTools>

          {/* Reorder Button */}
          <label className="cursor-point label ml-auto gap-2 self-end">
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
        <div className={`card m-1 w-full bg-white p-4`}>
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
        title="Confirm Delete"
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
          <button className="btn btn-accent btn-sm" onClick={closeDeleteModal}>
            Cancel
          </button>
          <button
            className="btn btn-error btn-sm"
            onClick={handleDeleteConfirm}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
