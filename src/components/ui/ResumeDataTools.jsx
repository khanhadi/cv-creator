import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../../utils/Toast';
import validateResumeData from '../../utils/validateResumeData';
import Modal from '../ui/Modal';
import { Upload } from 'lucide-react';

export default function ResumeDataTools({
  resumeData,
  resumeDataHandler,
  uiState,
  setUiState,
  handlers,
}) {
  const [exportUrl, setExportUrl] = useState(null);
  const [modalState, setModalState] = useState({
    resetModal: {
      isOpen: false,
    },
    importModal: {
      isOpen: false,
    },
  });
  const [dragActive, setDragActive] = useState(false);

  const isProcessingExport = useRef(false);
  const exportLinkRef = useRef(null);
  const fileInputRef = useRef(null);

  const sendToast = useToast();

  useEffect(() => {
    if (exportUrl && exportLinkRef.current && !isProcessingExport.current) {
      isProcessingExport.current = true;
      exportLinkRef.current.click();
      URL.revokeObjectURL(exportUrl);

      setTimeout(() => {
        setExportUrl(null);
        isProcessingExport.current = false;
      }, 0);
    }
  }, [exportUrl, sendToast]);

  const handleExport = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isProcessingExport.current) return;
      const dataStr = JSON.stringify(resumeData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      sendToast('Resume data exported successfully!', 'success');
      const url = URL.createObjectURL(blob);
      setExportUrl(url);
    },
    [resumeData, sendToast]
  );

  const openImportModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      importModal: { isOpen: true },
    }));
  };

  const closeImportModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      importModal: { isOpen: false },
    }));
  };

  const handleImport = useCallback(
    (file) => {
      if (!file) {
        sendToast('No file selected', 'error');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (validateResumeData(importedData)) {
            handlers.resumeDataHandler(importedData, true);
            sendToast('Resume data imported successfully!', 'success');
            setUiState((prevState) => ({
              ...prevState,
              loadedFile: file.name,
            }));
            closeImportModal();
          } else {
            sendToast(
              'Invalid resume data format. Please check your file or export again.',
              'error'
            );
          }
        } catch (error) {
          console.error('Error importing resume data:', error);
          sendToast(
            'Error importing resume data. Please check the file format.',
            'error'
          );
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        sendToast('Error reading file. Please try again.', 'error');
      };

      reader.readAsText(file);
    },
    [handlers, sendToast, setUiState]
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImport(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImport(e.target.files[0]);
    }
  };

  const openResetModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      resetModal: { isOpen: true },
    }));
  };

  const closeResetModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      resetModal: { isOpen: false },
    }));
  };

  const handleResetConfirm = () => {
    resumeDataHandler({}, false, true);
    setUiState((prevState) => ({
      ...prevState,
      loadedFile: '',
    }));
    closeResetModal();
    sendToast('Resume data has been reset', 'success');
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex-col px-1 py-2 flex">
        <span className="text-white">{`Resume Data: ${uiState.loadedFile}`}</span>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn btn-sm btn-warning">
            Export
          </button>
          <a
            ref={exportLinkRef}
            href={exportUrl}
            download={resumeData.fullName.split(' ')[0] + `_resume_data.json`}
            style={{ display: 'none' }}
          />
          <button onClick={openImportModal} className="btn btn-sm btn-warning">
            Import
          </button>
          <button onClick={openResetModal} className="btn btn-sm btn-warning">
            Reset
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalState.importModal.isOpen}
        onClose={closeImportModal}
        title="Import Resume Data"
        size="max-w-md"
      >
        <div
          className={`flex flex-col p-4 items-center justify-center w-full h-64 border-2 border-dashed rounded-lg ${
            dragActive
              ? 'border-accent bg-accent bg-opacity-10'
              : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={48} className="text-gray-400 mb-4" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JSON files only
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn btn-sm btn-accent mt-4"
          >
            Select File
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalState.resetModal.isOpen}
        onClose={closeResetModal}
        title="Confirm Reset"
        size="max-w-md"
      >
        <p>
          Are you sure you want to <span className="font-semibold">reset</span>{' '}
          all resume data? This action cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn btn-sm btn-accent" onClick={closeResetModal}>
            Cancel
          </button>
          <button className="btn btn-sm btn-error" onClick={handleResetConfirm}>
            Reset
          </button>
        </div>
      </Modal>
    </div>
  );
}
