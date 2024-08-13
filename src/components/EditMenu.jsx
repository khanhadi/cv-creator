import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Reorder } from 'framer-motion';
import DraggableItem from './ui/DraggableItem';
import CVContent from './CVContent';
import SocialInput from './ui/SocialInput';
import ProfessionCard from './ui/ProfessionCard';
import EducationCard from './ui/EducationCard';

export default function EditMenu({
  resumeData,
  inputHandler,
  socialHandler,
  experienceHandler,
  educationHandler,
  selectedSocial,
}) {
  const [reorderToggle, setReorderToggle] = useState(false);

  const [sectionsOrder, setSectionsOrder] = useState([
    'Professional Experience',
    'Education',
  ]);

  function handleReorderToggle(e) {
    setReorderToggle(e.target.checked);
  }

  function renderSection(sectionName) {
    switch (sectionName) {
      // Personal Information
      case 'Personal Information':
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
                    onChange={inputHandler}
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
                    onChange={inputHandler}
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
                    onChange={inputHandler}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <SocialInput
                  socialLink={resumeData.socialLink}
                  inputHandler={inputHandler}
                  socialHandler={socialHandler}
                  selectedSocial={selectedSocial}
                />
              </div>
            </div>
          </div>
        );

      // Professional Experience
      case 'Professional Experience':
        return (
          <div
            className={`collapse ${
              reorderToggle ? 'rounded-tl-none' : ''
            } collapse-arrow bg-white m-1`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl text-black font-medium">
              Professional Experience
            </div>
            <div className="collapse-content">
              <ProfessionCard
                experienceList={resumeData.experienceList}
                onExperienceUpdate={experienceHandler}
              />
            </div>
          </div>
        );

      // Education
      case 'Education':
        return (
          <div
            className={`collapse ${
              reorderToggle ? 'rounded-tl-none' : ''
            } collapse-arrow bg-white m-1`}
          >
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">Education</div>
            <div className="collapse-content">
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
        <div className="flex justify-around m-3 mb-5">
          <h1 className=" text-white m-1">cvCreator.io</h1>

          {/* Download Button */}
          <PDFDownloadLink
            className="text-white"
            document={
              <CVContent
                resumeData={resumeData}
                selectedSocial={selectedSocial}
              />
            }
            fileName={resumeData.fullName + '-CV.pdf'}
          >
            <button className="btn btn-accent btn-sm">
              Download
              <i className="icon icon-16 icon-download"></i>
            </button>
          </PDFDownloadLink>
        </div>

        <div>
          <label className="label justify-end gap-2 cursor-pointer">
            <span className="label-text text-white">Reorder</span>
            <input
              type="checkbox"
              onChange={handleReorderToggle}
              checked={reorderToggle}
              className="toggle toggle-accent border-white bg-white [--tglbg:black] hover:bg-zinc-200"
            />
          </label>
        </div>

        {/* Sections */}
        {renderSection('Personal Information')}
        <Reorder.Group
          axis="y"
          values={sectionsOrder}
          onReorder={setSectionsOrder}
        >
          {sectionsOrder.map((section) => {
            return (
              <DraggableItem
                key={section}
                item={section}
                renderSection={renderSection}
                isReorderingEnabled={reorderToggle}
              ></DraggableItem>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
}
