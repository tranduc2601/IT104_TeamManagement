import { useState, useEffect } from "react";
import "../../styles/ModalCommon.css";

interface AddOrEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: { name: string; assignee: string; status: string }) => void;
  initialData?: { name: string; assignee: string; status: string };
}

const AddOrEditTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddOrEditTaskModalProps) => {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("todo");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAssignee(initialData.assignee);
      setStatus(initialData.status);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, assignee, status });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box large">
        <h2 className="modal-title">
          {initialData ? "Sửa nhiệm vụ" : "Thêm nhiệm vụ"}
        </h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Tên nhiệm vụ</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Người phụ trách</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            required
          />

          <label>Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              {initialData ? "Lưu thay đổi" : "Thêm mới"}
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

export default AddOrEditTaskModal;
