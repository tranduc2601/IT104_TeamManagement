import { useState, useEffect } from "react";
import "../../styles/ModalCommon.css";

interface AddOrEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: { name: string; assignee: string; status: string }) => void;
  initialData?: { name: string; assignee: string; status: string };
  existingNames?: string[]; // for duplicate name validation
}

const AddOrEditTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingNames,
}: AddOrEditTaskModalProps) => {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("To do");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAssignee(initialData.assignee);
      // initialData.status may come as 'To do' or short code; normalize to display labels
      const normalized = ['To do','In Progress','Pending','Done'].includes(initialData.status)
        ? initialData.status
        : (initialData.status === 'todo' ? 'To do' : initialData.status);
      setStatus(normalized);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validate duplicate name if provided
    if (name.trim().length === 0) {
      setError('Tên nhiệm vụ không được để trống');
      return;
    }
    if (existingNames && existingNames.includes(name.trim()) && !(initialData && initialData.name === name.trim())) {
      setError('Tên nhiệm vụ đã tồn tại');
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), assignee, status });
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
            className={error ? 'input-error' : ''}
          />
          {error && <p className="error-text">{error}</p>}

          <label>Người phụ trách</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            required
          />

          <label>Trạng thái</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="To do">To do</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Done">Done</option>
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
