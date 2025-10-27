import React from "react";
import { useToast } from "../context/ToastContext";
import "../styles/Toast.css";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-wrapper" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-content">
            {t.title && <div className="toast-title">{t.title}</div>}
            <div className="toast-message">{t.message}</div>
          </div>
          <button className="toast-close" onClick={() => removeToast(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
