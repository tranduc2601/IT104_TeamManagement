import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import styles from "../components/Table.module.css";
import layoutStyles from "../styles/ProjectList.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { mockProjects } from "../mock/projects";
import type { Project } from "../interfaces/Project.interface";
import Pagination from "../components/Pagination";
import ProjectModal from "../components/ProjectModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const ProjectList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState(mockProjects);
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
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, name } : p))
      );
    } else {
      const newId = Math.max(...projects.map((p) => p.id)) + 1;
      setProjects([...projects, { id: newId, name }]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
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
