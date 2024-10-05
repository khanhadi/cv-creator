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
          className={`btn w-6 ${
            selectedSocial == 'linkedin' ? 'btn-active' : ''
          } join-item`}
          onClick={() => socialHandler('linkedin')}
        >
          <i className="icon icon-linkedin"></i>
        </button>
        <button
          className={`btn w-[34px] px-0 ${
            selectedSocial == 'github' ? 'btn-active' : ''
          } join-item`}
          onClick={() => socialHandler('github')}
        >
          <img width={16} src={githubIcon} />
        </button>
        <button
          className={`btn w-6 ${
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
