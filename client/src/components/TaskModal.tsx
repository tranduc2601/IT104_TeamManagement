

import { useState } from "react";
import styles from "../styles/TaskTable.module.css";
import type { Task, TaskStatus } from "../interfaces/Task.interface";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const STATUS_LIST: TaskStatus[] = ["todo", "inprogress", "pending", "done"];
const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  inprogress: "In Progress",
  pending: "Pending",
  done: "Done",
};

interface TaskTableProps {
  tasks: Task[];
  onDelete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

export default function TaskTable({ tasks, onDelete, onEdit }: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [visibleStatus, setVisibleStatus] = useState<Record<TaskStatus, boolean>>({
    todo: true,
    inprogress: true,
    pending: true,
    done: true,
  });

  // Thêm hoặc sửa nhiệm vụ (chỉ dùng khi quản lý state tại đây)
  // const handleSave = ...

  const handleDelete = () => {
    if (selectedTask && onDelete) {
      onDelete(selectedTask);
    }
    setShowDelete(false);
    setSelectedTask(null);
  };

  const toggleStatus = (status: TaskStatus) => {
    setVisibleStatus((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  return (
    <div className={styles.taskTableContainer} style={{ padding: 24, fontFamily: 'Roboto, sans-serif' }}>
      <div className={styles.statusToggles}>
        {STATUS_LIST.map((status) => (
          <button
            key={status}
            className={styles.toggleButton + (visibleStatus[status] ? ' ' + styles.active : '')}
            onClick={() => toggleStatus(status)}
          >
            {visibleStatus[status] ? `Ẩn ${STATUS_LABEL[status]}` : `Hiện ${STATUS_LABEL[status]}`}
          </button>
        ))}
        <button
            style={{ marginLeft: 'auto', width: 155, height: 38, borderRadius: 6, border: '1px solid #6c757d', background: 'rgba(0,0,0,1)', color: '#fff', fontWeight: 500, fontSize: 16 }}
            // parent page should handle adding a task (open modal)
            onClick={() => console.warn('Open add task modal from parent')}
          >
            + Thêm nhiệm vụ
          </button>
      </div>
      <table className={styles.table} style={{ fontSize: 14, fontWeight: 500 }}>
        <thead>
          <tr style={{ height: 40 }}>
            <th>ID</th>
            <th>Tên nhiệm vụ</th>
            <th>Người phụ trách</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Tiến độ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {STATUS_LIST.map((status) => (
            <>
              <tr key={status} style={{ background: '#f8fafc' }}>
                <td colSpan={7} style={{ textAlign: 'left', fontWeight: 700, fontSize: 18, padding: '8px 0', background: '#f8fafc' }}>
                  <span style={{ textTransform: 'capitalize' }}>{STATUS_LABEL[status]}</span>
                </td>
              </tr>
              {visibleStatus[status] &&
                tasks.filter((t) => t.status === status).map((t) => (
                  <tr key={t.id} style={{ height: 40 }}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.assignee}</td>
                    <td>{t.startDate}</td>
                    <td>{t.endDate || "-"}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: 6,
                          fontWeight: 500,
                          fontSize: 13,
                          color: '#fff',
                          background:
                            t.progress === 'Đúng tiến độ' ? '#198754' :
                            t.progress === 'Có rủi ro' ? '#ffc107' :
                            t.progress === 'Trễ hạn' ? '#dc3545' : '#6c757d',
                        }}
                      >
                        {t.progress}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        className={styles.edit}
                        style={{ width: 43, height: 31, borderRadius: 4, border: '1px solid #ffc107', background: '#ffc107', color: '#111', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedTask(t);
                          if (onEdit) onEdit(t);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className={styles.delete}
                        style={{ width: 43, height: 31, borderRadius: 4, border: '1px solid #dc3545', background: '#dc3545', color: '#fff', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedTask(t);
                          setShowDelete(true);
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
            </>
          ))}
        </tbody>
      </table>

      {/* Add/Edit is handled by parent page (ProjectDetail) to keep state centralized */}

      {showDelete && (
        <ConfirmDeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
