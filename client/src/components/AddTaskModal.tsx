import { useState } from "react";
import "../styles/TaskModal.css";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: { name: string; status: string; assignee: string }) => void;
}

const AddTaskModal = ({ isOpen, onClose, onSubmit }: AddTaskModalProps) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("todo");
  const [assignee, setAssignee] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, status, assignee });
    setName("");
    setStatus("todo");
    setAssignee("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Thêm Nhiệm Vụ</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Tên nhiệm vụ</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Trạng thái</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <label>Người phụ trách</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn-submit">
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

export default AddTaskModal;
