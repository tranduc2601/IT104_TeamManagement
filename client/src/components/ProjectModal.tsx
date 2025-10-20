import { useState, useEffect } from "react";
import styles from "../styles/Modal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultValue?: string;
};

const ProjectModal = ({ isOpen, onClose, onSave, defaultValue = "" }: Props) => {
  const [name, setName] = useState(defaultValue);

  useEffect(() => {
    setName(defaultValue); 
  }, [defaultValue]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{defaultValue ? "Sửa Dự Án" : "Thêm Dự Án"}</h2>
        <input
          type="text"
          value={name}
          placeholder="Tên dự án"
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>Huỷ</button>
          <button onClick={() => onSave(name)} className={styles.save}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
