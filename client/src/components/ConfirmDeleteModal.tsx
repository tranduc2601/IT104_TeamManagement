import styles from "../styles/Modal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Xác nhận xoá</h2>
        <p className={styles.confirmText}>Bạn có chắc chắn muốn xoá dự án này không?</p>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>Huỷ</button>
          <button onClick={onConfirm} className={styles.delete}>Xoá</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
