import { useState } from 'react';

export default function SocialInput({ socialLink, inputHandler }) {
  const [activeButton, setActiveButton] = useState('linkedin');

  function handleSelect(button) {
    setActiveButton(button);
  }

  return (
    <div>
      <div className="label">
        <span className="label-text">Social Media</span>
      </div>
      <div className="join">
        <button
          className={`btn ${
            activeButton == 'linkedin' ? 'btn-active' : ''
          } join-item`}
          onClick={() => handleSelect('linkedin')}
        >
          <i className="icon icon-linkedin"></i>
        </button>
        <button
          className={`btn ${activeButton == 'x' ? 'btn-active' : ''} join-item`}
          onClick={() => handleSelect('x')}
        >
          <i className="icon icon-x"></i>
        </button>
        <input
          type="text"
          name="socialLink"
          onChange={inputHandler}
          value={socialLink}
          placeholder="Profile Link"
          className="input join-item input-bordered"
        />
      </div>
    </div>
  );
}
