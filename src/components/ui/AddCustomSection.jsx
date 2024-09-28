import { useState } from 'react';

export default function AddCustomSection({
  sectionsOrder,
  inclusionObject,
  handleSectionOrder,
  handleInclusion,
  handleSectionData,
}) {
  const [sectionTitle, setSectionTitle] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSectionTitle(e.target.value);
    setError('');
  };

  // Handle button click
  const handleAddBtn = () => {
    if (sectionTitle.trim()) {
      // Check if the section title already exists in sectionOrder
      const sectionExists = sectionsOrder.some(
        (section) => section.toLowerCase() === sectionTitle.trim().toLowerCase()
      );

      if (sectionExists) {
        setError('This section already exists.');
      } else {
        handleSectionOrder([...sectionsOrder, sectionTitle]);
        handleSectionData({ title: sectionTitle, items: [] });
        handleInclusion({
          ...inclusionObject,
          [sectionTitle]: true,
        });
        setSectionTitle('');
      }
    } else {
      setError('Section title cannot be empty.');
    }
  };

  return (
    <>
      <div className="mb-2 flex w-full text-xl font-medium text-black">
        <span>Add Custom Section</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={sectionTitle}
          onChange={handleInputChange}
          placeholder="Section Title"
          className="input input-sm input-bordered input-accent w-full"
        />
        <button onClick={handleAddBtn} className="btn btn-accent btn-sm">
          Add
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </>
  );
}
