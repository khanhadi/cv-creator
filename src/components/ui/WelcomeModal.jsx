import { useState } from 'react';
import { X } from 'lucide-react';
import Modal from './Modal';

const WelcomeModal = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: 'Welcome to CV Creator',
      content: 'Create professional resumes with ease.',
      media: (
        <img
          src="/api/placeholder/400/300"
          alt="CV Creator overview"
          className="w-full rounded-lg"
        />
      ),
    },
    {
      title: 'Edit Your Resume',
      content: 'Customize sections, add experiences, and more.',
      media: (
        <img
          src="/api/placeholder/400/300"
          alt="Resume editing"
          className="w-full rounded-lg"
        />
      ),
    },
    {
      title: 'Import and Export',
      content: 'Save your progress and import existing resumes.',
      media: (
        <img
          src="/api/placeholder/400/300"
          alt="Import/Export feature"
          className="w-full rounded-lg"
        />
      ),
    },
    {
      title: 'Generate PDF',
      content: 'Create a polished PDF version of your resume.',
      media: (
        <img
          src="/api/placeholder/400/300"
          alt="PDF generation"
          className="w-full rounded-lg"
        />
      ),
    },
    {
      title: 'Get Started',
      content: 'Ready to create your professional resume?',
      media: (
        <img
          src="/api/placeholder/400/300"
          alt="Get started"
          className="w-full rounded-lg"
        />
      ),
    },
  ];

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="max-w-xl w-11/12">
      <div className="relative p-4">
        <button
          onClick={onClose}
          className="btn btn-circle btn-sm absolute right-2 top-2"
        >
          <X size={18} />
        </button>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold md:text-2xl">
            {pages[currentPage].title}
          </h2>
        </div>
        <div className="mb-4">{pages[currentPage].media}</div>
        <p className="mb-6 text-center text-sm md:text-base">
          {pages[currentPage].content}
        </p>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="btn btn-outline btn-sm w-full md:w-auto"
          >
            Previous
          </button>
          <div className="join">
            {pages.map((_, index) => (
              <button
                key={index}
                className={`btn join-item btn-xs md:btn-sm ${
                  currentPage === index ? 'btn-active' : ''
                }`}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {currentPage === pages.length - 1 ? (
            <button
              onClick={onClose}
              className="btn btn-primary btn-sm w-full md:w-auto"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={nextPage}
              className="btn btn-outline btn-sm w-full md:w-auto"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
