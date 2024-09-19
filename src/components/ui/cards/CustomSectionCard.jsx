import { useState, useCallback, useEffect } from 'react';
import { DraggableCardItem } from '../DraggableCardItem';
import { Reorder } from 'framer-motion';
import { Pencil, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function CustomSectionCard({
  sectionTitle,
  sectionItemsList,
  onSectionUpdate,
}) {
  const defaultFormData = {
    heading: '',
    subHeading: '',
    description: '',
    date: '',
    additionalInfo: '',
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

  const [localSectionItemsList, setLocalSectionItemsList] = useState(
    sectionItemsList.map(ensureItemHasId)
  );

  useEffect(() => {
    setLocalSectionItemsList(sectionItemsList.map(ensureItemHasId));
  }, [sectionItemsList]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const handleSaveClick = () => {
    const updatedSectionItemsList =
      editIndex !== null && editIndex < localSectionItemsList.length
        ? localSectionItemsList.map((item, index) =>
            index === editIndex ? { ...formData, id: item.id } : item
          )
        : [...localSectionItemsList, { ...formData, id: uuidv4() }];

    setLocalSectionItemsList(updatedSectionItemsList);
    onSectionUpdate({ title: sectionTitle, items: updatedSectionItemsList });

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
    setFormData(sectionItemsList[index]);
  };

  const handleAddClick = () => {
    setEditIndex(sectionItemsList.length);
    setFormData({ ...defaultFormData, id: uuidv4() });
  };

  const handleDeleteClick = () => {
    const updatedSectionItemsList = sectionItemsList;
    updatedSectionItemsList.splice(editIndex, 1);
    setLocalSectionItemsList(updatedSectionItemsList);
    onSectionUpdate({ title: sectionTitle, items: updatedSectionItemsList });
    setTimeout(() => {
      setEditIndex(null);
      setFormData(defaultFormData);
    }, 10);
  };

  const OnReorderToggle = (e) => {
    setReorderToggle(e.target.checked);
  };

  const handleReorder = (newOrder) => {
    setLocalSectionItemsList(newOrder);
    onSectionUpdate({ title: sectionTitle, items: newOrder });
  };

  const renderSectionItem = (item, index) => {
    return (
      <div className="p-3">
        <div className="h-8 flex items-center gap-1">
          <p className="font-semibold">{item.heading}</p>
          <p>&#8226;</p>
          <p className="font-light text-sm">{item.subHeading}</p>
          <button
            onClick={() => handleEditClick(index)}
            className="btn btn-square btn-accent btn-sm ml-auto"
          >
            {/* <img draggable="false" src={pencilIcon} alt="Edit" /> */}
            <Pencil></Pencil>
          </button>
        </div>
      </div>
    );
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
      <Reorder.Group values={localSectionItemsList} onReorder={handleReorder}>
        {localSectionItemsList.map((item, index) => (
          <DraggableCardItem
            key={item.id}
            item={item}
            reorderToggle={reorderToggle}
          >
            <div
              className={`card bg-base-200 w-full shadow-sm mt-3 ${
                reorderToggle ? 'rounded-tl-none' : ''
              }`}
            >
              {editIndex === index ? (
                <div className="p-3">
                  <p className="font-semibold">Edit Item</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="form-control flex-grow w-full">
                      <div className="label">
                        <span className="label-text">Heading</span>
                      </div>
                      <input
                        name="heading"
                        value={formData.heading}
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
                        <span className="label-text">Additional Info</span>
                      </div>
                      <input
                        name="location"
                        value={formData.additionalInfo}
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
                renderSectionItem(item, index)
              )}
            </div>
          </DraggableCardItem>
        ))}
      </Reorder.Group>

      <div className="card bg-base-200 w-full shadow-sm mt-3">
        {editIndex === sectionItemsList.length ? (
          <div className="p-3">
            <p className="font-semibold">Add Item</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="form-control flex-grow w-full">
                <div className="label">
                  <span className="label-text">Heading</span>
                </div>
                <input
                  name="heading"
                  value={formData.heading}
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
                  <span className="label-text">Additional Info</span>
                </div>
                <input
                  name="location"
                  value={formData.additionalInfo}
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
              <p>Add Item</p>
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
