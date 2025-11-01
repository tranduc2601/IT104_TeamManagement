import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import styles from "../styles/Table.module.css";
import layoutStyles from "../styles/ProjectList.module.css";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  addFullProject, 
  updateFullProject, 
  deleteFullProject,
  getCurrentUser,
  getFullProjectById
} from "../utils/storage";
import { initialFullProjects } from "../mock/initialProjects";
import type { ProjectBasic, Project } from "../interfaces/project";
import Pagination from "../components/Pagination";
import ProjectModal from "../components/ProjectModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

const ProjectList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectBasic | null>(null);
  const [projects, setProjects] = useState<ProjectBasic[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectBasic | null>(null);
  
  // Get current user ONCE - không gọi lại mỗi render
  const [currentUser] = useState(() => {
    const user = getCurrentUser();
    console.log("👤 Current User:", user);
    return user;
  });

  // Load projects ONCE khi component mount
  useEffect(() => {
    console.log("� Loading projects...");
    
    // Load stored projects
    let stored = getProjects();
    
    // Khởi tạo dữ liệu mẫu nếu chưa có
    if (!stored || stored.length === 0) {
      initialFullProjects.forEach(proj => {
        addFullProject(proj);
        addProject(proj.name, proj.ownerId);
      });
      
      stored = getProjects();
    }
    
    // Filter by current user
    if (currentUser) {
      const userProjects = stored.filter(p => p.ownerId === currentUser.id);
      console.log(`✅ Loaded ${userProjects.length} projects for user ${currentUser.id}`);
      setProjects(userProjects);
    } else {
      console.warn("⚠️ No user logged in");
      setProjects([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount - currentUser được capture trong closure

  const itemsPerPage = 5;
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Memoize defaultValue để tránh tạo object mới mỗi render
  const modalDefaultValue = useMemo(() => {
    if (!editingProject) return { name: "", description: "" };
    
    const fullProject = getFullProjectById(editingProject.id);
    return {
      name: editingProject.name,
      description: fullProject?.description || ""
    };
  }, [editingProject]);

  // Memoize existingNames
  const existingNames = useMemo(() => {
    return projects
      .filter(p => p.id !== editingProject?.id)
      .map(p => p.name);
  }, [projects, editingProject]);

  const handleSave = (name: string, description: string) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thực hiện thao tác này");
      return;
    }

    if (editingProject) {
      // Update existing project
      const updated = updateProject(editingProject.id, name);
      if (updated) {
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        
        // Update full project
        const existingFull = getFullProjectById(editingProject.id);
        if (existingFull) {
          updateFullProject({ 
            ...existingFull, 
            name: updated.name,
            description: description || existingFull.description
          });
        }
      }
    } else {
      // Create new project
      const newProject = addProject(name, currentUser.id);
      setProjects((prev) => [...prev, newProject]);
      
      // Create full project entry
      const full: Project = {
        id: newProject.id,
        name: newProject.name,
        description: description,
        thumbnail: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        status: "Active" as const,
        members: [
          {
            id: currentUser.id,
            name: currentUser.fullName,
            role: "Project owner",
            initials: currentUser.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
            color: "#007bff",
            email: currentUser.email,
          }
        ],
        tasks: [],
        ownerId: currentUser.id,
      };
      addFullProject(full);
    }
    
    setModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id);
      deleteFullProject(selectedProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setDeleteOpen(false);
      setSelectedProject(null);
    }
  };

  return (
    <div className={layoutStyles.pageWrapper}>
      <Header />

      <main className={layoutStyles.mainSection}>
        <div className={layoutStyles.card}>
          <div className={layoutStyles.headerRow}>
            <h2 className={layoutStyles.title}>Quản Lý Dự Án Nhóm</h2>
            <button
              className={layoutStyles.addButton}
              onClick={() => {
                setEditingProject(null);
                setModalOpen(true);
              }}
            >
              + Thêm Dự Án
            </button>
          </div>

          <div className={layoutStyles.searchBox}>
            <input
              type="text"
              placeholder="Tìm kiếm dự án"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={layoutStyles.searchInput}
            />
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Dự Án</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                      {!currentUser ? (
                        <>
                          <p>⚠️ Vui lòng đăng nhập để xem dự án</p>
                          <Link to="/login" style={{ color: "#0d6efd", textDecoration: "underline" }}>
                            Đăng nhập ngay
                          </Link>
                        </>
                      ) : (
                        <>
                          <p>📋 Chưa có dự án nào</p>
                          <p style={{ fontSize: "0.875rem" }}>
                            Click "Thêm Dự Án" để tạo dự án mới
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.btn} ${styles.edit}`}
                            onClick={() => {
                              setEditingProject(p);
                            setModalOpen(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className={`${styles.btn} ${styles.delete}`}
                          onClick={() => {
                            setSelectedProject(p);
                            setDeleteOpen(true);
                          }}
                        >
                          Xóa
                        </button>
                        <Link
                          to={`/projects/${p.id}`}
                          className={`${styles.btn} ${styles.detail}`}
                        >
                          Chi tiết
                        </Link>
                      </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <Footer />

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
        defaultValue={modalDefaultValue}
        existingNames={existingNames}
        editingId={editingProject?.id}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa dự án"
        message="Bạn có chắc muốn xóa dự án này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        itemName={selectedProject?.name}
      />
    </div>
  );
};

export default ProjectList;
