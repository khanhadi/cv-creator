import { useState, useCallback, useEffect } from 'react';
import { DraggableCardItem } from '../DraggableCardItem';
import { Reorder } from 'framer-motion';
import { Pencil, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function ProjectsCard({ projectsList, onProjectsUpdate }) {
  const defaultFormData = {
    projectName: '',
    description: '',
    date: '',
    link: '',
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

  const [localProjectsList, setLocalProjectsList] = useState(
    projectsList.map(ensureItemHasId)
  );

  useEffect(() => {
    setLocalProjectsList(projectsList.map(ensureItemHasId));
  }, [projectsList]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const handleSaveClick = () => {
    const updatedProjectsList =
      editIndex !== null && editIndex < localProjectsList.length
        ? localProjectsList.map((item, index) =>
            index === editIndex ? { ...formData, id: item.id } : item
          )
        : [...localProjectsList, { ...formData, id: uuidv4() }];

    setLocalProjectsList(updatedProjectsList);
    onProjectsUpdate(updatedProjectsList);

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
    setFormData(localProjectsList[index]);
  };

  const handleAddClick = () => {
    setEditIndex(localProjectsList.length);
    setFormData({ ...defaultFormData, id: uuidv4() });
  };

  const handleDeleteClick = () => {
    const updatedProjectsList = localProjectsList.filter(
      (_, index) => index !== editIndex
    );
    setLocalProjectsList(updatedProjectsList);
    onProjectsUpdate(updatedProjectsList);
    setTimeout(() => {
      setEditIndex(null);
      setFormData(defaultFormData);
    }, 10);
  };

  const OnReorderToggle = (e) => {
    setReorderToggle(e.target.checked);
  };

  const handleReorder = (newOrder) => {
    setLocalProjectsList(newOrder);
    onProjectsUpdate(newOrder);
  };

  return (
    <>
      <div className="flex justify-end">
        <label className="label gap-2 cursor-pointer">
          <span className="label-text">Reorder</span>
          <input
            type="checkbox"
            onChange={OnReorderToggle}
            checked={reorderToggle}
            className="toggle border-black bg-accent [--tglbg:black] hover:bg-accent"
          />
        </label>
      </div>
      <Reorder.Group values={localProjectsList} onReorder={handleReorder}>
        {localProjectsList.map((projectItem, index) => (
          <DraggableCardItem
            key={projectItem.id}
            item={projectItem}
            reorderToggle={reorderToggle}
          >
            <div
              className={`card bg-base-200 w-full shadow-sm mt-3 ${
                reorderToggle ? 'rounded-tl-none' : ''
              }`}
            >
              {editIndex === index ? (
                <div className="p-3">
                  <p className="font-semibold">Edit Project</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="form-control flex-grow w-full">
                      <div className="label">
                        <span className="label-text">Project Name</span>
                      </div>
                      <input
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                      />
                    </label>
                    <label className="form-control flex-grow w-full">
                      <div className="label">
                        <span className="label-text">Sub Heading</span>
                      </div>
                      <input
                        name="subHeading"
                        value={formData.subHeading}
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
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="form-control flex-grow w-full">
                      <div className="label">
                        <span className="label-text">Project Link</span>
                      </div>
                      <input
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="https://..."
                        className="input input-bordered w-full"
                      />
                    </label>
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
                  </div>
                  <div className="flex w-full justify-end gap-2 mt-4">
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
                    <p className="font-semibold">{projectItem.projectName}</p>
                    <p>&#8226;</p>
                    <p className="font-light text-sm">
                      {projectItem.subHeading}
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

      <div className="card bg-base-200 w-full shadow-sm mt-3">
        {editIndex === localProjectsList.length ? (
          <div className="p-3">
            <p className="font-semibold">Add Project</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Project Name</span>
                </div>
                <input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Sub Heading</span>
                </div>
                <input
                  name="subHeading"
                  value={formData.subHeading}
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
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Project Link</span>
                </div>
                <input
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="https://..."
                  className="input input-bordered w-full"
                />
              </label>
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
            </div>
            <div className="flex w-full justify-end gap-2 mt-4">
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
            <div className="flex justify-between items-center">
              <p>Add Project</p>
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
