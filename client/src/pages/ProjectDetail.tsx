import React, { useState } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import AddEditTaskModal from "../components/modals/Add_EditTaskModal";
import AddMemberModal from "../components/modals/AddMemberModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import MemberDetailModal from "../components/modals/MemberDetailModal";
import type { Task, Member } from "../interfaces/project";
import { initialTasks, members } from "../mock/projectData";
import "../styles/ProjectDetail.css";

const ProjectDetail: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [teamMembers, setTeamMembers] = useState<Member[]>(members);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "To do": true,
    "In Progress": true,
    Pending: false,
    Done: false,
  });

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMemberDetailModal, setShowMemberDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const toggleSection = (status: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const getPriorityBadgeClass = (priority: string) => {
    if (priority === "Thấp") return "badge-low";
    if (priority === "Trung Bình") return "badge-medium";
    if (priority === "Cao") return "badge-high";
    return "";
  };

  const getProgressBadgeClass = (progress: string) => {
    if (progress === "Đúng tiến độ") return "badge-success";
    if (progress === "Trễ hạn") return "badge-danger";
    if (progress === "Có rủi ro") return "badge-warning";
    return "";
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
    setShowDeleteModal(false);
  };

  // Accepts the modal shape: { name, assignee, status } where status is 'todo'|'inprogress'|...
  const handleSaveTask = (taskData: { name: string; assignee: string; status: string }) => {
    const statusMap: Record<string, Task['status']> = {
      todo: 'To do',
      inprogress: 'In Progress',
      pending: 'Pending',
      done: 'Done',
    };

    if (selectedTask) {
      // Edit existing task
      setTasks(
        tasks.map((t) =>
          t.id === selectedTask.id
            ? { ...t, name: taskData.name, assignee: taskData.assignee, status: statusMap[taskData.status] }
            : t
        )
      );
    } else {
      // Add new task
      const newTask: Task = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        name: taskData.name,
        assignee: taskData.assignee,
        priority: 'Trung Bình',
        startDate: new Date().toISOString().slice(5).replace('-', ' - '),
        endDate: '',
        progress: 'Chưa cập nhật' as Task['progress'],
        status: statusMap[taskData.status],
      };
      setTasks([...tasks, newTask]);
    }
    setShowTaskModal(false);
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setShowMemberDetailModal(true);
  };

  const groupedTasks = tasks.reduce((acc: Record<string, Task[]>, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  const statuses = ["To do", "In Progress", "Pending", "Done"];

  return (
    <div className="project-detail-page">
      <Header />

      {/* Main Content */}
      <div className="page-container">
        <div className="main-card">
          <div className="header-card">
            {/* Project Info on the left */}
            <div className="project-info-card">
              <div className="project-thumbnail">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                  alt="project"
                  className="thumbnail-image"
                />
              </div>
              <div className="project-meta">
                <h2 className="project-main-title">Xây dựng website thương mại điện tử</h2>
                <p className="project-description">
                  Dự án nhằm phát triển một nền tảng thương mại điện tử với các
                  tính năng như giỏ hàng, thanh toán và quản lý sản phẩm.
                </p>
                <button className="btn-add-task" onClick={handleAddTask}>
                  + Thêm nhiệm vụ
                </button>
              </div>
            </div>

            {/* Members on the right */}
            <div className="members-card header-members">
              <div className="members-header">
                <h3 className="members-title">Thành viên</h3>
                <button
                  className="btn-add-member"
                  onClick={() => setShowMemberModal(true)}
                >
                  + Thêm thành viên
                </button>
              </div>

              <div className="members-list">
                {teamMembers.map((member) => (
                  <div key={member.id} className="member-item">
                    <div
                      className="member-avatar"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initials}
                    </div>
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-role">{member.role}</div>
                    </div>
                    <button
                      className="member-menu"
                      onClick={() => handleMemberClick(member)}
                    >
                      ⋮
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks area below header */}
          <div className="tasks-container">
            <div className="task-controls">
              <select className="sort-select">
                <option>Sắp xếp theo</option>
                <option>Tên nhiệm vụ</option>
                <option>Người phụ trách</option>
                <option>Ngày bắt đầu</option>
              </select>
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm nhiệm vụ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="task-card">
              <h3 className="task-card-title">Danh Sách Nhiệm Vụ</h3>

              <div className="task-table-header">
                <div></div>
                <div>Tên Nhiệm Vụ</div>
                <div>Người Phụ Trách</div>
                <div>Ưu Tiên</div>
                <div>Ngày Bắt Đầu</div>
                <div>Hạn Chót</div>
                <div>Tiến độ</div>
                <div className="th-actions">Hành động</div>
              </div>

              {statuses.map((status) => {
                const statusTasks = groupedTasks[status] || [];
                const isExpanded = expandedSections[status];

                return (
                  <div key={status} className="task-section">
                    <div
                      onClick={() => toggleSection(status)}
                      className="section-header"
                    >
                      <span className="section-toggle">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <span className="section-title">{status}</span>
                    </div>

                    {isExpanded &&
                      statusTasks.map((task) => (
                        <div key={task.id} className="task-row">
                          <div></div>
                          <div>{task.name}</div>
                          <div>{task.assignee}</div>
                          <div>
                            <span
                              className={`badge ${getPriorityBadgeClass(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <div className="task-date">{task.startDate}</div>
                          <div className="task-date">{task.endDate}</div>
                          <div>
                            <span
                              className={`badge ${getProgressBadgeClass(
                                task.progress
                              )}`}
                            >
                              {task.progress}
                            </span>
                          </div>
                          <div className="td-actions">
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleEditTask(task)}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() => handleDeleteTask(task)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {showTaskModal && (
        <AddEditTaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleSaveTask}
          initialData={
            selectedTask
              ? { name: selectedTask.name, assignee: selectedTask.assignee, status: selectedTask.status }
              : undefined
          }
        />
      )}

      {showMemberModal && (
        <AddMemberModal
          isOpen={showMemberModal}
          onClose={() => setShowMemberModal(false)}
          onSubmit={(memberData) => {
            const newMember: Member = {
              id: teamMembers.length ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1,
              name: memberData.name,
              role: memberData.role,
              initials: memberData.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
              color: '#9ca3af',
              email: memberData.email,
              joinDate: new Date().toLocaleDateString(),
            };
            setTeamMembers([...teamMembers, newMember]);
            setShowMemberModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          message={`Bạn có chắc chắn muốn xóa nhiệm vụ "${taskToDelete?.name}"?`}
        />
      )}

      {showMemberDetailModal && selectedMember && (
        <MemberDetailModal
          isOpen={showMemberDetailModal}
          onClose={() => setShowMemberDetailModal(false)}
          member={{
            name: selectedMember.name,
            email: selectedMember.email ?? "",
            role: selectedMember.role,
            joinDate: selectedMember.joinDate ?? "",
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
