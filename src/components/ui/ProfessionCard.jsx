import { useState } from 'react';
import addIcon from '../../assets/icons/add.svg';
import pencilIcon from '../../assets/icons/pencil.svg';

export default function ProfessionCard({ experienceList, onExperienceUpdate }) {
  const defaultFormData = { companyName: '', jobTitle: '' };

  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSaveClick() {
    const updatedExperienceList =
      editIndex !== null && editIndex < experienceList.length
        ? experienceList.map((item, index) =>
            index === editIndex ? formData : item
          )
        : [...experienceList, formData];
    onExperienceUpdate(updatedExperienceList);
    setFormData(defaultFormData);
    setEditIndex(null);
  }

  function handleCancelClick() {
    setFormData(defaultFormData);
    setEditIndex(null);
  }

  function handleEditClick(index) {
    console.log(index);
    setEditIndex(index);
    setFormData(experienceList[index]);
  }

  function handleAddClick() {
    setEditIndex(experienceList.length);
    setFormData(defaultFormData);
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
              <div className="flex w-full justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelClick}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel{' '}
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

      {editIndex === experienceList.length ? (
        <div className="card bg-zinc-100 w-full shadow-sm mt-3">
          <div className="p-3">
            <p className="font-semibold">New Experience</p>
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
            <div className="flex w-full justify-end gap-2 mt-2">
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
        </div>
      ) : (
        <div className="card bg-zinc-100 w-full shadow-sm h-14 mt-3">
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
        </div>
      )}
    </>
  );
}
