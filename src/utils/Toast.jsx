import { createContext, useContext, useState } from 'react';

// Toast component
const Toast = ({ message, type }) => {
  let alertClass = 'alert-info';
  if (type === 'success') alertClass = 'alert-success';
  if (type === 'error') alertClass = 'alert-error';

  return (
    <div className={`alert ${alertClass} shadow-lg`}>
      <span className="text-sm sm:text-base">{message}</span>
    </div>
  );
};

// Create a context for the toast
const ToastContext = createContext();

// ToastProvider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const sendToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000); // Remove toast after 3 seconds
  };

  return (
    <ToastContext.Provider value={sendToast}>
      {children}
      <div className="toast toast-end fixed bottom-0 right-0 z-50 max-w-sm p-4 sm:bottom-4 sm:right-4 sm:w-auto sm:p-0">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast
export const useToast = () => useContext(ToastContext);
