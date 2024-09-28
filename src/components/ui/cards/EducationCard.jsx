import { useState, useCallback, useEffect } from 'react';
import { DraggableCardItem } from '../DraggableCardItem';
import { Reorder } from 'framer-motion';
import { Pencil, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function EducationCard({ educationList, onEducationUpdate }) {
  const defaultFormData = {
    institutionName: '',
    courseTitle: '',
    description: '',
    date: '',
    grade: '',
  };

  const [editIndex, setEditIndex] = useState(null);
  const [reorderToggle, setReorderToggle] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const ensureItemHasId = (item) => {
    if (!item.id) {
      return { ...item, id: uuidv4() };
    }
    return item;
  };

  const [localEducationList, setLocalEducationList] = useState(
    educationList.map(ensureItemHasId)
  );

  useEffect(() => {
    setLocalEducationList(educationList.map(ensureItemHasId));
  }, [educationList]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const handleSaveClick = () => {
    const updatedEducationList =
      editIndex !== null && editIndex < localEducationList.length
        ? localEducationList.map((item, index) =>
            index === editIndex ? { ...formData, id: item.id } : item
          )
        : [...localEducationList, { ...formData, id: uuidv4() }];

    setLocalEducationList(updatedEducationList);
    onEducationUpdate(updatedEducationList);

    setTimeout(() => {
      setEditIndex(null);
      setFormData(defaultFormData);
    }, 10);
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setFormData(defaultFormData);
  };

  const handleEditClick = (index) => {
    setReorderToggle(false);
    setEditIndex(index);
    setFormData(localEducationList[index]);
  };

  const handleAddClick = () => {
    setEditIndex(localEducationList.length);
    setFormData({ ...defaultFormData, id: uuidv4() });
  };

  const handleDeleteClick = () => {
    const updatedEducationList = localEducationList.filter(
      (_, index) => index !== editIndex
    );
    setLocalEducationList(updatedEducationList);
    onEducationUpdate(updatedEducationList);
    setTimeout(() => {
      setEditIndex(null);
      setFormData(defaultFormData);
    }, 10);
  };

  const OnReorderToggle = (e) => {
    setReorderToggle(e.target.checked);
  };

  const handleReorder = (newOrder) => {
    setLocalEducationList(newOrder);
    onEducationUpdate(newOrder);
  };

  return (
    <>
      <div className="flex justify-end">
        <label className="label cursor-pointer gap-2">
          <span className="label-text">Reorder</span>
          <input
            type="checkbox"
            onChange={OnReorderToggle}
            checked={reorderToggle}
            className="toggle border-black bg-accent [--tglbg:black] hover:bg-accent"
          />
        </label>
      </div>
      <Reorder.Group values={localEducationList} onReorder={handleReorder}>
        {localEducationList.map((educationItem, index) => (
          <DraggableCardItem
            key={educationItem.id}
            item={educationItem}
            reorderToggle={reorderToggle}
          >
            <div
              className={`card mt-3 w-full bg-base-200 shadow-sm ${
                reorderToggle ? 'rounded-tl-none' : ''
              }`}
            >
              {editIndex === index ? (
                <div className="p-3">
                  <p className="font-semibold">Edit Education</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="form-control w-full flex-grow">
                      <div className="label">
                        <span className="label-text">Institution</span>
                      </div>
                      <input
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                      />
                    </label>
                    <label className="form-control w-full flex-grow">
                      <div className="label">
                        <span className="label-text">Course Title</span>
                      </div>
                      <input
                        name="courseTitle"
                        value={formData.courseTitle}
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
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="form-control w-full flex-grow">
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
                    <label className="form-control w-full flex-grow">
                      <div className="label">
                        <span className="label-text">Grade</span>
                      </div>
                      <input
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex w-full justify-end gap-2">
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
                <div className="max-w-full p-3">
                  <div className="flex h-8 items-center gap-2">
                    <p className="font-semibold">
                      {educationItem.institutionName}
                    </p>
                    <p>&#8226;</p>
                    <p className="text-sm font-light">
                      {educationItem.courseTitle}
                    </p>
                    <button
                      onClick={() => handleEditClick(index)}
                      className="btn btn-square btn-accent btn-sm ml-auto"
                    >
                      <Pencil></Pencil>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DraggableCardItem>
        ))}
      </Reorder.Group>

      <div className="card mt-3 w-full bg-base-200 shadow-sm">
        {editIndex === localEducationList.length ? (
          <div className="p-3">
            <p className="font-semibold">Add Education</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="form-control w-full flex-grow">
                <div className="label">
                  <span className="label-text">Institution</span>
                </div>
                <input
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control w-full flex-grow">
                <div className="label">
                  <span className="label-text">Course Title</span>
                </div>
                <input
                  name="courseTitle"
                  value={formData.courseTitle}
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
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="form-control w-full flex-grow">
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
              <label className="form-control w-full flex-grow">
                <div className="label">
                  <span className="label-text">Grade</span>
                </div>
                <input
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="mt-4 flex w-full justify-end gap-2">
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
                Add
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex items-center justify-between">
              <p>Add Education</p>
              <button
                onClick={handleAddClick}
                className="btn btn-square btn-accent btn-sm"
              >
                <Plus></Plus>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
