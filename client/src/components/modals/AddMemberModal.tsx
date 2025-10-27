import { useState } from "react";
import "../../styles/ModalCommon.css";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: { name: string; role: string; email: string }) => void;
  existingEmails?: string[]; // used to validate duplicate emails
}

const AddMemberModal = ({ isOpen, onClose, onSubmit, existingEmails }: AddMemberModalProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Họ tên không được để trống');
      return;
    }
    if (!email.trim()) {
      setError('Email không được để trống');
      return;
    }
    // simple duplicate email check
    if (existingEmails && existingEmails.some(em => em.toLowerCase() === email.trim().toLowerCase())) {
      setError('Thành viên đã tồn tại');
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), role, email: email.trim() });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box medium">
        <h2 className="modal-title">Thêm Thành Viên</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Vai trò</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? 'input-error' : ''}
          />
          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Thêm
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
