import { useState, useRef } from 'react';

export default function SkillsInput() {
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      setSkills([...skills, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDelete = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleContainerClick = () => {
    inputRef.current.focus();
  };

  return (
    <div
      className="w-full mx-auto border rounded-lg flex items-center flex-wrap gap-2 input-bordered bg-white p-2"
      onClick={handleContainerClick}
    >
      {skills.map((skill, index) => (
        <div key={index} className="badge badge-warning flex items-center">
          {skill}
          <button
            onClick={() => handleDelete(index)}
            className="ml-2 text-black"
          >
            x
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a skill and press &#9166;"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="ml-2 flex-grow border-none outline-none"
      />
    </div>
  );
}
