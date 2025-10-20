import "../../styles/ModalCommon.css";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Bạn có chắc muốn xóa nhiệm vụ này không?",
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h3 className="modal-title">Xác nhận xoá</h3>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button onClick={onConfirm} className="btn-danger">
            Xóa
          </button>
          <button onClick={onClose} className="btn-cancel">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
