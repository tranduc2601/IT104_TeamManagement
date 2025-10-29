import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import AddEditTaskModal from "../components/modals/Add_EditTaskModal";
import AddMemberModal from "../components/modals/AddMemberModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import MemberDetailModal from "../components/modals/MemberDetailModal";
import MembersModal from "../components/modals/MembersModal";
import type {
  Task,
  Member,
  Project as FullProject,
} from "../interfaces/project";
import { initialTasks, members, mockProject } from "../mock/projectData";
import {
  getFullProjectById,
  updateFullProject,
  addFullProject,
} from "../utils/storage";
import { useParams } from "react-router-dom";
import "../styles/ProjectDetail.css";

const ProjectDetail: React.FC = () => {
  const params = useParams();
  const projectId = params.id ? Number(params.id) : mockProject.id;

  // load full project from storage if available; otherwise fallback to a sensible default
  // Always fallback to mockProject if no localStorage data
  const [project, setProject] = useState<FullProject>(() => {
    const stored = getFullProjectById(projectId);
    if (stored && stored.tasks && stored.members) return stored;
    // fallback: always use mockProject for missing/invalid data
    return mockProject;
  });

  const [tasks, setTasks] = useState<Task[]>(
    (() => {
      const stored = window.localStorage.getItem('tasks_mock');
      if (stored) {
        try {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr)) return arr;
        } catch { /* ignore parse error */ }
      }
      return project.tasks && project.tasks.length ? project.tasks : initialTasks;
    })()
  );
  const [teamMembers, setTeamMembers] = useState<Member[]>(
    project.members && project.members.length ? project.members : members
  );
  const [memberSearch, setMemberSearch] = useState("");
  const [memberSort, setMemberSort] = useState<string>("name");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "To do": true,
    "In Progress": true,
    Pending: false,
    Done: false,
  });

  // Trạng thái modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showMembersListModal, setShowMembersListModal] = useState(false);
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
      const next = tasks.filter((t) => t.id !== taskToDelete.id);
      setTasks(next);
      // persist
      const updatedProject = { ...project, tasks: next };
      setProject(updatedProject);
      try {
        updateFullProject(updatedProject);
      } catch (_e) {
        void _e;
      }
      // Also update localStorage directly for reliability
      window.localStorage.setItem(
        "projects_full",
        JSON.stringify([updatedProject])
      );
      setTaskToDelete(null);
    }
    setShowDeleteModal(false);
  };

  // Nhận dữ liệu modal: { name, assignee, status, startDate?, endDate?, priority?, progress? }
  const handleSaveTask = (taskData: {
    name: string;
    assignee: string;
    status: string;
    startDate?: string;
    endDate?: string;
    priority?: string;
    progress?: string;
  }) => {
    // taskData.status is expected to be display label like 'To do' / 'In Progress'
    // Helper to format date as 'MM - DD'
    const formatDate = (d: string | undefined): string => {
      if (!d) return new Date().toISOString().slice(5, 10).replace("-", " - ");
      // If already in 'MM - DD' format, return as is
      if (/^\d{2} - \d{2}$/.test(d)) return d;
      // Otherwise try to parse and format
      const dateObj = new Date(d);
      if (!isNaN(dateObj.getTime())) {
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        return `${mm} - ${dd}`;
      }
      return d; // return original if can't parse
    };
    if (selectedTask) {
      // Sửa nhiệm vụ
      const next = tasks.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              name: taskData.name,
              assignee: taskData.assignee,
              status: taskData.status as Task["status"],
              startDate: taskData.startDate ? formatDate(taskData.startDate) : t.startDate,
              endDate: taskData.endDate ? formatDate(taskData.endDate) : t.endDate,
              priority: (taskData.priority as Task["priority"]) ?? t.priority,
              progress: (taskData.progress as Task["progress"]) ?? t.progress,
            }
          : t
      );
      setTasks(next);
      window.localStorage.setItem('tasks_mock', JSON.stringify(next));
      const updatedProject = { ...project, tasks: next };
      setProject(updatedProject);
      try {
        updateFullProject(updatedProject);
      } catch (_e) {
        void _e;
      }
      window.localStorage.setItem(
        "projects_full",
        JSON.stringify([updatedProject])
      );
    } else {
      // Thêm nhiệm vụ mới
      const newTask: Task = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        name: taskData.name,
        assignee: taskData.assignee,
        priority: (taskData.priority as Task["priority"]) ?? "Trung Bình",
        startDate: formatDate(taskData.startDate),
        endDate: formatDate(taskData.endDate),
        progress: (taskData.progress as Task["progress"]) ?? "Đúng tiến độ",
        status: taskData.status as Task["status"],
      };
      const next = [...tasks, newTask];
      setTasks(next);
      window.localStorage.setItem('tasks_mock', JSON.stringify(next));
      const updatedProject = { ...project, tasks: next };
      setProject(updatedProject);
      try {
        addFullProject(updatedProject);
      } catch (_e) {
        void _e;
      }
      try {
        updateFullProject(updatedProject);
      } catch (_e) {
        void _e;
      }
      window.localStorage.setItem(
        "projects_full",
        JSON.stringify([updatedProject])
      );
    }
    setShowTaskModal(false);
  };

  // normalize tasks/members when project changes (prevent crashes from bad data)
  useEffect(() => {
    const normalizeTask = (t: unknown): Task => {
      const obj = (t as Partial<Task & Record<string, unknown>>) || {};
      const id =
        typeof obj.id === "number" ? obj.id : Number(String(obj.id ?? "")) || 0;
      const name = (obj.name as string) ?? "";
      const assignee = (obj.assignee as string) ?? "";
      const priority = (obj.priority as Task["priority"]) ?? "Trung Bình";
      const startDate = (obj.startDate as string) ?? "";
      const endDate = (obj.endDate as string) ?? "";
      const progress = (obj.progress as Task["progress"]) ?? "Đúng tiến độ";
      const status = (obj.status as Task["status"]) ?? "To do";
      return {
        id,
        name,
        assignee,
        priority,
        startDate,
        endDate,
        progress,
        status,
      };
    };

    // On project change, reload tasks from localStorage if available
    const stored = window.localStorage.getItem('tasks_mock');
    if (stored) {
      try {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          setTasks(arr);
          return;
        }
      } catch { /* ignore parse error */ }
    }
    const normTasks = (project.tasks ?? []).map(normalizeTask);
    setTasks(normTasks.length ? normTasks : []);

    const normMembers = (project.members ?? members) as Member[];
    setTeamMembers(normMembers);
  }, [project]);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setShowMemberDetailModal(true);
  };

  // Các trạng thái hiển thị theo thứ tự
  const statuses = ["To do", "In Progress", "Pending", "Done"];

  // Nhóm nhiệm vụ theo trạng thái để render từng section
  const groupedTasks = statuses.reduce((acc: Record<string, Task[]>, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="project-detail-page">
      <Header />

      {/* Main Content */}
      <div className="page-container">
        <div className="main-card">
          <div className="header-card">
            {/* Project Info on the left */}
            <div className="project-info-card">
              <div className="left-info">
                <div className="project-thumbnail">
                  <img
                    src={
                      project.thumbnail ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                    }
                    alt={project.name}
                    className="thumbnail-image"
                  />
                </div>
                <button className="btn-add-task" onClick={handleAddTask}>
                  + Thêm nhiệm vụ
                </button>
              </div>
              <div className="right-info project-meta">
                <h2 className="project-main-title">{project.name}</h2>
                <p className="project-description">{project.description}</p>
              </div>
            </div>

            {/* Members on the right */}
            <div className="members-card header-members">
              <div className="members-header">
                <h3 className="members-title">Thành viên</h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    className="btn-add-member"
                    onClick={() => setShowMemberModal(true)}
                  >
                    + Thêm thành viên
                  </button>
                  <button
                    className="ellipsis-btn"
                    title="Quản lý thành viên"
                    onClick={() => setShowMembersListModal(true)}
                  >
                    <i className="fa-solid fa-ellipsis" />
                  </button>
                </div>
              </div>

              {/* upper duplicate controls removed - keep the original controls below */}

              <div className="members-list">
                {(() => {
                  // Lọc
                  const q = memberSearch.trim().toLowerCase();
                  let list = teamMembers.filter((m) =>
                    [m.name, m.email ?? "", m.role]
                      .join(" ")
                      .toLowerCase()
                      .includes(q)
                  );
                  // Sắp xếp
                  list = list.sort((a, b) => {
                    if (memberSort === "name")
                      return a.name.localeCompare(b.name);
                    if (memberSort === "role")
                      return a.role.localeCompare(b.role);
                    return 0;
                  });

                  return list.map((member) => (
                    <div key={member.id} className="member-item-grid">
                      <div
                        className="member-avatar"
                        style={{ backgroundColor: member.color }}
                        onClick={() => handleMemberClick(member)}
                      >
                        {member.initials}
                      </div>
                      <div className="member-info">
                        <div className="member-name">{member.name}</div>
                        <div className="member-role">{member.role}</div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* sort & search moved into members card */}
              <div className="member-controls">
                <select
                  className="sort-select"
                  value={memberSort}
                  onChange={(e) => setMemberSort(e.target.value)}
                >
                  <option value="name">Tên</option>
                  <option value="role">Vai trò</option>
                </select>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm thành viên"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tasks area below header */}
          <div className="tasks-container">
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
              ? {
                  name: selectedTask.name,
                  assignee: selectedTask.assignee,
                  status: selectedTask.status,
                  startDate: selectedTask.startDate,
                  endDate: selectedTask.endDate,
                  priority: selectedTask.priority,
                  progress: selectedTask.progress,
                }
              : undefined
          }
          existingNames={tasks.map((t) => t.name)}
        />
      )}

      {showMemberModal && (
        <AddMemberModal
          isOpen={showMemberModal}
          onClose={() => setShowMemberModal(false)}
          existingEmails={
            teamMembers.map((m) => m.email).filter(Boolean) as string[]
          }
          onSubmit={(memberData) => {
            const newMember: Member = {
              id: teamMembers.length
                ? Math.max(...teamMembers.map((m) => m.id)) + 1
                : 1,
              name: memberData.name,
              role: memberData.role,
              initials: memberData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
              color: "#9ca3af",
              email: memberData.email,
              joinDate: new Date().toLocaleDateString(),
            };
            const nextMembers = [...teamMembers, newMember];
            setTeamMembers(nextMembers);
            const updatedProject = { ...project, members: nextMembers };
            setProject(updatedProject);
            updateFullProject(updatedProject);
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

      {showMembersListModal && (
        <MembersModal
          isOpen={showMembersListModal}
          onClose={() => setShowMembersListModal(false)}
          members={teamMembers}
          onSave={(updated) => {
            setTeamMembers(updated);
            const updatedProject = { ...project, members: updated };
            setProject(updatedProject);
            updateFullProject(updatedProject);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
