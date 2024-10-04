import githubIcon from '../../assets/icons/cv-icons/github.png';

export default function SocialInput({
  socialLink,
  resumeDataHandler,
  socialHandler,
  selectedSocial,
}) {
  return (
    <div className="w-full">
      <div className="label">
        <span className="label-text">Social Media</span>
      </div>
      <div className="join w-full">
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
            selectedSocial == 'github' ? 'btn-active' : ''
          } join-item`}
          onClick={() => socialHandler('github')}
        >
          <img src={githubIcon} width={18} />
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
          onChange={resumeDataHandler}
          value={socialLink}
          placeholder="Profile Link"
          className="input join-item input-bordered w-full"
        />
      </div>
    </div>
  );
}
