import { useState, useCallback } from 'react';
import addIcon from '../../assets/icons/add.svg';
import pencilIcon from '../../assets/icons/pencil.svg';
import SkillsInput from './SkillsInput';

export default function ProfessionCard({ experienceList, onExperienceUpdate }) {
  const defaultFormData = {
    skills: [],
  };

  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  function handleSaveClick() {
    const updatedExperienceList =
      editIndex !== null && editIndex < experienceList.length
        ? experienceList.map((item, index) =>
            index === editIndex ? formData : item
          )
        : [...experienceList, formData];
    onExperienceUpdate(updatedExperienceList);

    setTimeout(() => {
      setEditIndex(null);
      setFormData(defaultFormData);
    }, 10);
  }

  function handleCancelClick() {
    setEditIndex(null);
    setFormData(defaultFormData);
  }

  function handleEditClick(index) {
    setEditIndex(index);
    setFormData(experienceList[index]);
  }

  function handleAddClick() {
    setEditIndex(experienceList.length);
    setFormData(defaultFormData);
  }

  function handleDeleteClick() {
    let updatedExperienceList = experienceList;
    updatedExperienceList.splice(editIndex, 1);
    onExperienceUpdate(updatedExperienceList);
    setTimeout(() => {
      setEditIndex(null);
      setFormData(defaultFormData);
    }, 10);
  }

  return (
    <>
      {experienceList.map((experienceItem, index) => (
        <div key={index} className="card bg-zinc-100 w-full shadow-sm mt-3">
          {editIndex === index ? (
            <div className="p-3">
              <p className="font-semibold">Edit Experience</p>
              <div className="flex flex-row gap-2">
                <label className="form-control flex-grow w-full">
                  <div className="label">
                    <span className="label-text">Company</span>
                  </div>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control flex-grow w-full">
                  <div className="label">
                    <span className="label-text">Job Title</span>
                  </div>
                  <input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
                <textarea
                  name="description"
                  className="textarea textarea-bordered h-24"
                  placeholder="..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </label>
              <div className="flex flex-row gap-2">
                <label className="form-control flex-grow w-full">
                  <div className="label">
                    <span className="label-text">Date</span>
                  </div>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
                <label className="form-control flex-grow w-full">
                  <div className="label">
                    <span className="label-text">Location</span>
                  </div>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Skills</span>
                </div>
                <SkillsInput
                  initialSkills={formData.skills}
                  inputHandler={handleInputChange}
                ></SkillsInput>
              </div>
              <div className="flex w-full justify-end gap-2 mt-2">
                <button
                  onClick={handleDeleteClick}
                  className="btn btn-error btn-sm mr-auto"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelClick}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  className="btn btn-accent btn-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <div className="h-8 flex items-center gap-1">
                <p className="font-semibold">{experienceItem.companyName}</p>
                <p>&#8226;</p>
                <p className="font-light text-sm">{experienceItem.jobTitle}</p>
                <button
                  onClick={() => handleEditClick(index)}
                  className="btn btn-square btn-accent btn-sm ml-auto"
                >
                  <img draggable="false" src={pencilIcon}></img>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="card bg-zinc-100 w-full shadow-sm mt-3">
        {editIndex === experienceList.length ? (
          <div className="p-3">
            <p className="font-semibold">Edit Experience</p>
            <div className="flex flex-row gap-2">
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Company</span>
                </div>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Job Title</span>
                </div>
                <input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <textarea
                name="description"
                className="textarea textarea-bordered h-24"
                placeholder="..."
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </label>
            <div className="flex flex-row gap-2">
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Date</span>
                </div>
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Location</span>
                </div>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div>
              <div className="label">
                <span className="label-text">Skills</span>
              </div>
              <SkillsInput
                initialSkills={formData.skills}
                inputHandler={handleInputChange}
              ></SkillsInput>
            </div>
            <div className="flex w-full justify-end gap-2 mt-2">
              <button
                onClick={handleDeleteClick}
                className="btn btn-error btn-sm mr-auto"
              >
                Delete
              </button>
              <button
                onClick={handleCancelClick}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                className="btn btn-accent btn-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex justify-between items-center">
              <p>Add Experience</p>
              <button
                onClick={handleAddClick}
                className="btn btn-square btn-accent btn-sm"
              >
                <img draggable="false" src={addIcon}></img>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
