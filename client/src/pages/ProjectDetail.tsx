
import { useState } from "react";
import TaskTable from "../components/TaskModal";
import AddOrEditTaskModal from "../components/modals/Add_EditTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import AddMemberModal from "../components/modals/AddMemberModal";
import MemberDetailModal from "../components/modals/MemberDetailModal";
import "../styles/ProjectDetail.css";

import type { Task, TaskStatus } from "../interfaces/Task.interface";
import { mockTasks as initialTasks } from "../mock/mockTask";

export default function ProjectDetail() {
  // State quản lý nhiệm vụ và modal
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "assignee" | "startDate">("name");
  const [showAddTask, setShowAddTask] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showEditTask, setShowEditTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMemberDetail, setShowMemberDetail] = useState(false);

  // Dữ liệu giả lập
  const mockMember = {
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    role: "Frontend Developer",
    joinDate: "12/08/2025",
  };

  // Xử lý thêm nhiệm vụ
  const handleAddTask = (data: { name: string; assignee: string; status: string }) => {
    const newTask: Task = {
      id: tasks.length + 1,
      name: data.name,
      assignee: data.assignee,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      progress: "Chưa cập nhật",
      priority: "Trung bình",
      status: data.status as TaskStatus,
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
  };

  // Xử lý xoá nhiệm vụ
  const handleDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      setShowConfirmDelete(false);
      setTaskToDelete(null);
    }
  };

  // Xử lý tìm kiếm
  const filteredTasks = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase())
  );

  // Xử lý sắp xếp
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "assignee") return a.assignee.localeCompare(b.assignee);
    if (sortBy === "startDate") return a.startDate.localeCompare(b.startDate);
    return 0;
  });

  return (
    <div className="project-detail-page">
      {/* Header */}
      <header className="project-header">
        <h1 className="project-title">Chi tiết Dự Án</h1>
        <button
          style={{
            width: 132,
            height: 31,
            borderRadius: 4,
            border: "1px solid rgba(108, 117, 125, 1)",
            background: "black",
            color: "white",
            fontWeight: 500,
            fontSize: 16,
          }}
          onClick={() => setShowAddMember(true)}
        >
          + Thêm thành viên
        </button>
      </header>

      {/* Thông tin dự án */}
      <section className="project-info">
        <img
          src="/images/project-thumb.png"
          alt="project thumbnail"
          className="project-thumb"
        />
        <div className="project-meta">
          <h2 className="meta-title">Website thương mại điện tử</h2>
          <p className="meta-desc">
            Dự án phát triển hệ thống bán hàng trực tuyến với quản lý sản phẩm,
            đơn hàng, và thanh toán tích hợp.
          </p>
        </div>
      </section>

      {/* Thanh điều khiển nhiệm vụ */}
      <div className="task-toolbar">
        <button
          style={{
            width: 155,
            height: 38,
            borderRadius: 6,
            border: "1px solid black",
            background: "#0d6efd",
            color: "#fff",
            fontWeight: 500,
            fontSize: 16,
          }}
          onClick={() => setShowAddTask(true)}
        >
          + Thêm nhiệm vụ
        </button>
        <select
          style={{ marginLeft: 16, height: 38, borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "assignee" | "startDate")}
        >
          <option value="name">Sắp xếp theo tên</option>
          <option value="assignee">Sắp xếp theo người phụ trách</option>
          <option value="startDate">Sắp xếp theo ngày bắt đầu</option>
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm nhiệm vụ"
          className="search-input"
          style={{ marginLeft: 16, width: 240 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bảng nhiệm vụ */}
      <TaskTable
        tasks={sortedTasks}
        onDelete={(task) => {
          setTaskToDelete(task);
          setShowConfirmDelete(true);
        }}
        onEdit={(task) => {
          setTaskToEdit(task);
          setShowEditTask(true);
        }}
      />

      {/* Modal thêm nhiệm vụ */}
      {showAddTask && (
        <AddOrEditTaskModal
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
          onSubmit={handleAddTask}
        />
      )}

      {/* Modal sửa nhiệm vụ */}
      {showEditTask && taskToEdit && (
        <AddOrEditTaskModal
          isOpen={showEditTask}
          onClose={() => {
            setShowEditTask(false);
            setTaskToEdit(null);
          }}
          onSubmit={(data) => {
            // update task
            setTasks((prev) => prev.map((t) => (t.id === taskToEdit.id ? { ...t, ...data, status: data.status as TaskStatus } : t)));
            setShowEditTask(false);
            setTaskToEdit(null);
          }}
          initialData={{ name: taskToEdit.name, assignee: taskToEdit.assignee, status: taskToEdit.status }}
        />
      )}

      {/* Modal xác nhận xoá nhiệm vụ */}
      {showConfirmDelete && (
        <ConfirmDeleteModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDeleteTask}
        />
      )}

      {/* Modal thêm thành viên */}
      {showAddMember && (
        <AddMemberModal
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
          onSubmit={(m) => console.log("Thêm thành viên:", m)}
        />
      )}

      {/* Modal chi tiết thành viên */}
      {showMemberDetail && (
        <MemberDetailModal
          isOpen={showMemberDetail}
          onClose={() => setShowMemberDetail(false)}
          member={mockMember}
        />
      )}
    </div>
  );
}
