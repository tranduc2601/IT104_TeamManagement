import { useState } from "react";
import "../../styles/ModalCommon.css";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: { name: string; role: string; email: string }) => void;
}

const AddMemberModal = ({ isOpen, onClose, onSubmit }: AddMemberModalProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, role, email });
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
            required
          />

          <label>Vai trò</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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
