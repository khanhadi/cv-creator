import { PDFDownloadLink } from '@react-pdf/renderer';
import CVContent from './CVContent';
import SocialInput from './ui/SocialInput';

export default function EditMenu({ resumeData, inputHandler }) {
  return (
    <div className="w-6/12 bg-black p-3 flex justify-center">
      <div className="w-11/12">
        <div className="flex justify-around m-3 mb-5">
          <h1 className=" text-white m-1">cvCreator.io</h1>

          {/* Download Button */}
          <PDFDownloadLink
            className="text-white"
            document={<CVContent resumeData={resumeData} />}
            fileName={resumeData.fullName + '-CV.pdf'}
          >
            <button className="btn btn-accent btn-sm">
              Download
              <i className="icon icon-16 icon-download"></i>
            </button>
          </PDFDownloadLink>
        </div>

        <div className="collapse collapse-arrow bg-white m-1">
          <input type="radio" name="my-accordion-2" defaultChecked />
          <div className="collapse-title text-xl text-black font-medium">
            Personal Information
          </div>
          <div className="collapse-content">
            <div className="flex flex-row gap-2">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Name</span>
                </div>
                <input
                  name="fullName"
                  value={resumeData.fullName}
                  onChange={inputHandler}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Mobile No.</span>
                </div>
                <input
                  name="mobileNo"
                  value={resumeData.mobileNo}
                  onChange={inputHandler}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
            </div>
            <div className="flex flex-row gap-2 items-end mt-3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  name="email"
                  value={resumeData.email}
                  onChange={inputHandler}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <SocialInput
                socialLink={resumeData.socialLink}
                inputHandler={inputHandler}
              ></SocialInput>
            </div>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-white m-1">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl text-black font-medium">
            Professional Experience
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        <div className="collapse collapse-arrow text-black bg-white m-1">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl font-medium">Education</div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
      </div>
    </div>
  );
}
