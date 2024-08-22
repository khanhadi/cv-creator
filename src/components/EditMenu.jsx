import { useState, useEffect, useMemo } from 'react';
import { Reorder } from 'framer-motion';
import { usePDF } from '@react-pdf/renderer';
import DraggableItem from './ui/DraggableItem';
import CVContent from './CVContent';
import SocialInput from './ui/SocialInput';
import ProfessionCard from './ui/ProfessionCard';
import EducationCard from './ui/EducationCard';

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
    sectionOrderHandler,
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
              <div className="flex flex-row gap-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Name</span>
                  </div>
                  <input
                    name="fullName"
                    value={resumeData.fullName}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Mobile No.</span>
                  </div>
                  <input
                    name="mobileNo"
                    value={resumeData.mobileNo}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
              </div>
              <div className="flex flex-row gap-2 mt-3">
                <label className="form-control w-full max-w-xs flex">
                  <div className="label">
                    <span className="label-text">Email</span>
                  </div>
                  <input
                    name="email"
                    value={resumeData.email}
                    onChange={resumeDataHandler}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <SocialInput
                  socialLink={resumeData.socialLink}
                  resumeDataHandler={resumeDataHandler}
                  socialHandler={socialHandler}
                  selectedSocial={selectedSocial}
                />
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
      default:
        return null;
    }
  }

  return (
    <div className="p-3 flex justify-center">
      <div className="w-11/12">
        <div className="flex text-white justify-around m-3 mb-5">
          <h1 className="text-white m-1">cvCreator.io</h1>

          {/* Generate Button */}
          <button
            onClick={OnGeneratePDF}
            disabled={!uiState.isGenerateButtonEnabled}
            className={`btn btn-accent btn-sm ${
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
              <div className="flex">
                <button className="btn btn-accent btn-sm">
                  <a href={instance.url} download="CV.pdf">
                    Download
                  </a>
                  <i className="icon icon-16 icon-download"></i>
                </button>
              </div>
            ))}
        </div>

        {/* Reorder Button */}
        <div className="flex justify-end">
          <label className="label gap-2 cursor-point  er">
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
      </div>
    </div>
  );
}
