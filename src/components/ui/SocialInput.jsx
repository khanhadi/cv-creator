export default function SocialInput({
  socialLink,
  inputHandler,
  socialHandler,
  selectedSocial,
}) {
  return (
    <div className="w-full">
      <div className="label">
        <span className="label-text">Social Media</span>
      </div>
      <div className="join w-full max-w-xs">
        <button
          className={`btn ${
            selectedSocial == 'linkedin' ? 'btn-active' : ''
          } join-item`}
          onClick={() => socialHandler('linkedin')}
        >
          <i className="icon icon-linkedin"></i>
        </button>
        <button
          className={`btn ${
            selectedSocial == 'x' ? 'btn-active' : ''
          } join-item`}
          onClick={() => socialHandler('x')}
        >
          <i className="icon icon-x"></i>
        </button>
        <input
          type="text"
          name="socialLink"
          onChange={inputHandler}
          value={socialLink}
          placeholder="Profile Link"
          className="input join-item input-bordered w-full"
        />
      </div>
    </div>
  );
}
