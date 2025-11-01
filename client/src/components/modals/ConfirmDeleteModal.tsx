import "../../styles/ModalCommon.css";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xoá",
  message = "Bạn có chắc muốn xóa không?",
  itemName,
}: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">
          {message}
          {itemName && (
            <>
              <br />
              <strong style={{ color: "#dc3545" }}>{itemName}</strong>
            </>
          )}
        </p>

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
