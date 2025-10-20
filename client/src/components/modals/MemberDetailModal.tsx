import "../../styles/ModalCommon.css";

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: { name: string; email: string; role: string; joinDate: string };
}

const MemberDetailModal = ({
  isOpen,
  onClose,
  member,
}: MemberDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box large-detail">
        <div className="modal-header">
          <h2 className="modal-title">Chi tiết thành viên</h2>
          <button className="circle-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-detail">
          <p><strong>Họ và tên:</strong> {member.name}</p>
          <p><strong>Email:</strong> {member.email}</p>
          <p><strong>Vai trò:</strong> {member.role}</p>
          <p><strong>Ngày tham gia:</strong> {member.joinDate}</p>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
