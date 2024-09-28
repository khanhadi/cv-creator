const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'max-w-md', // 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl',
  closeOnClickOutside = true,
}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleOutsideClick}
        ></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${size} sm:w-full`}
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {title && (
              <h3
                className="text-lg font-semibold leading-6 text-gray-900"
                id="modal-title"
              >
                {title}
              </h3>
            )}
            <div className="mt-2">{children}</div>
          </div>
          {actions && (
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
