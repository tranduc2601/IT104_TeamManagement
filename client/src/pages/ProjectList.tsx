import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import styles from "../styles/Table.module.css";
import layoutStyles from "../styles/ProjectList.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { mockProjects } from "../mock/projects";
import { getProjects, addProject, updateProject, deleteProject, addFullProject, updateFullProject, deleteFullProject } from "../utils/storage";
import { members } from "../mock/projectData";
import type { ProjectBasic } from "../interfaces/project";
import Pagination from "../components/Pagination";
import ProjectModal from "../components/ProjectModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

const ProjectList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectBasic | null>(null);
  // initialize from localStorage (getProjects) and fallback to mockProjects if empty
  const [projects, setProjects] = useState<ProjectBasic[]>(() => {
    const stored = getProjects();
    return stored && stored.length ? stored : mockProjects;
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const itemsPerPage = 5;
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSave = (name: string) => {
    if (editingProject) {
      const updated = updateProject(editingProject.id, name);
      if (updated) {
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  // also update the full-project entry if exists (keep other fields)
  updateFullProject({ id: updated.id, name: updated.name, description: "", thumbnail: "", startDate: "", endDate: "", status: "Active", members: members, tasks: [] });
      }
    } else {
      const newProject = addProject(name);
      setProjects((prev) => [...prev, newProject]);
      // create a minimal full-project entry so ProjectDetail can load it
      const full = {
        id: newProject.id,
        name: newProject.name,
        description: "",
        thumbnail: "",
        startDate: "",
        endDate: "",
        status: "Active" as const,
        members: members,
        tasks: [],
      };
  addFullProject(full);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      deleteProject(selectedId);
      // also remove full project storage
      // also remove full project storage
      deleteFullProject(selectedId);
      setProjects((prev) => prev.filter((p) => p.id !== selectedId));
      setDeleteOpen(false);
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
                {paginated.map((p) => (
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
                            setSelectedId(p.id);
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
                ))}
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
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        defaultValue={editingProject?.name}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProjectList;
