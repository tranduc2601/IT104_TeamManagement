import React, { useState } from "react";
import "../../styles/ModalCommon.css";
import type { Member } from "../../interfaces/project";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onSave: (members: Member[]) => void;
}

const MembersModal: React.FC<MembersModalProps> = ({ isOpen, onClose, members, onSave }) => {
  const [localMembers, setLocalMembers] = useState<Member[]>(members);
  const [showConfirm, setShowConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  React.useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  if (!isOpen) return null;

  const handleRoleChange = (id: number, value: string) => {
    setLocalMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: value } : m)));
  };

  const handleDelete = (id: number) => {
    // show confirm modal via local state (ask before removing)
    setMemberToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (memberToDelete != null) {
      setLocalMembers((prev) => prev.filter((m) => m.id !== memberToDelete));
    }
    setMemberToDelete(null);
    setShowConfirm(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box large-detail">
        <div className="modal-header">
          <h2 className="modal-title">Thành viên</h2>
          <button className="circle-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ marginBottom: 12, color: "#6b7280" }}>Thành viên</h4>
            <div>
              {localMembers.map((m) => (
                <div key={m.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 10 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: m.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{m.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{m.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: 260 }}>
            <h4 style={{ marginBottom: 12, color: "#6b7280" }}>Vai trò</h4>
            <div>
              {localMembers.map((m) => (
                <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: 10 }}>
                  <input
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.id, e.target.value)}
                    style={{ flex: 1, height: 36, borderRadius: 6, border: "1px solid #d1d5db", padding: "6px 8px" }}
                  />
                  <button
                    onClick={() => handleDelete(m.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 18 }}
                    title="Xóa"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: 24 }}>
          <button
            className="btn-cancel"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              onSave(localMembers);
              onClose();
            }}
          >
            Lưu
          </button>
        </div>
        {showConfirm && (
          <ConfirmDeleteModal
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => confirmDelete()}
            message={`Bạn có chắc chắn muốn xóa thành viên này?`}
          />
        )}
      </div>
    </div>
  );
};

export default MembersModal;
