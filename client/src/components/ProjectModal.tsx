import { useState, useEffect } from "react";
import styles from "../styles/Modal.module.css";
import { PROJECT_VALIDATION } from "../interfaces/project";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  defaultValue?: { name: string; description: string };
  existingNames?: string[];
  editingId?: number | null;
};

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  defaultValue = { name: "", description: "" },
  existingNames = [],
  editingId = null 
}: Props) => {
  const [name, setName] = useState(defaultValue.name);
  const [description, setDescription] = useState(defaultValue.description);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  // Reset form when modal opens/closes or when editing different project
  useEffect(() => {
    if (isOpen) {
      setName(defaultValue.name || "");
      setDescription(defaultValue.description || "");
      setErrors({});
    }
  }, [isOpen, defaultValue.name, defaultValue.description, editingId]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Tên dự án không được để trống";
    } else if (name.trim().length < PROJECT_VALIDATION.NAME_MIN_LENGTH) {
      newErrors.name = `Tên dự án phải có ít nhất ${PROJECT_VALIDATION.NAME_MIN_LENGTH} ký tự`;
    } else if (name.trim().length > PROJECT_VALIDATION.NAME_MAX_LENGTH) {
      newErrors.name = `Tên dự án không được vượt quá ${PROJECT_VALIDATION.NAME_MAX_LENGTH} ký tự`;
    } else {
      // Check for duplicate names (case-insensitive)
      const isDuplicate = existingNames.some(
        existingName => existingName.toLowerCase() === name.trim().toLowerCase()
      );
      if (isDuplicate && !editingId) {
        newErrors.name = "Tên dự án đã tồn tại";
      }
    }

    // Validate description
    if (description.trim().length > PROJECT_VALIDATION.DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Mô tả không được vượt quá ${PROJECT_VALIDATION.DESCRIPTION_MAX_LENGTH} ký tự`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(name.trim(), description.trim());
      setName("");
      setDescription("");
      setErrors({});
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          {editingId ? "Sửa Dự Án" : "Thêm Dự Án"}
        </h2>
        
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={name}
            placeholder="Tên dự án *"
            onChange={(e) => setName(e.target.value)}
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            maxLength={PROJECT_VALIDATION.NAME_MAX_LENGTH}
          />
          {errors.name && (
            <div style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              {errors.name}
            </div>
          )}
          <div style={{ fontSize: "0.75rem", color: "#6c757d", marginTop: "0.25rem" }}>
            {name.length}/{PROJECT_VALIDATION.NAME_MAX_LENGTH} ký tự
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <textarea
            value={description}
            placeholder="Mô tả dự án"
            onChange={(e) => setDescription(e.target.value)}
            className={`${styles.input} ${errors.description ? styles.inputError : ""}`}
            maxLength={PROJECT_VALIDATION.DESCRIPTION_MAX_LENGTH}
            rows={4}
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
          {errors.description && (
            <div style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              {errors.description}
            </div>
          )}
          <div style={{ fontSize: "0.75rem", color: "#6c757d", marginTop: "0.25rem" }}>
            {description.length}/{PROJECT_VALIDATION.DESCRIPTION_MAX_LENGTH} ký tự
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleClose} className={styles.cancel}>
            Huỷ
          </button>
          <button onClick={handleSave} className={styles.save}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
