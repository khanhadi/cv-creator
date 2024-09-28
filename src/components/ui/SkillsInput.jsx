import { useState, useRef, useEffect } from 'react';

export default function SkillsInput({ initialSkills, inputHandler }) {
  const [skills, setSkills] = useState(initialSkills);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputHandler({ target: { name: 'skills', value: skills } });
  }, [skills, inputHandler]);

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

  return (
    <div className="input-bordered mx-auto flex w-full flex-wrap items-center gap-2 rounded-lg border bg-white p-2">
      {skills.map((skill, index) => (
        <div key={index} className="badge badge-warning flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(index);
            }}
            className="mr-2 text-black"
          >
            &times;
          </button>
          {skill}
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
