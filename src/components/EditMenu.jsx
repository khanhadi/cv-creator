export default function EditMenu({ resumeData, inputHandler }) {
  return (
    <div className="w-6/12 bg-black p-3 flex justify-center">
      <div className="w-11/12">
        <h1 className=" text-white m-1">cvCreator.io</h1>
        <div className="collapse collapse-arrow bg-white m-1">
          <input type="radio" name="my-accordion-2" defaultChecked />
          <div className="collapse-title text-xl text-black font-medium">
            Personal Information
          </div>
          <div className="collapse-content">
            <div className="flex flex-row gap-2">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  name="firstName"
                  value={resumeData.firstName}
                  onChange={inputHandler}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  name="lastName"
                  value={resumeData.lastName}
                  onChange={inputHandler}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
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
