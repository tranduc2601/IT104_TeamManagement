import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import styles from "../components/Table.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";

type Project = {
  id: number;
  name: string;
};

const mockProjects: Project[] = [
  { id: 1, name: "Xây dựng website thương mại điện tử" },
  { id: 2, name: "Phát triển ứng dụng di động" },
  { id: 3, name: "Quản lý dữ liệu khách hàng" },
  { id: 4, name: "Nâng cấp hệ thống bán hàng" },
  { id: 5, name: "Xây dựng ứng dụng học trực tuyến" },
];

const ProjectList = () => {
  const [search, setSearch] = useState("");
  const filtered = mockProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        fontFamily: "Poppins",
      }}
    >
      <Header />

      <main style={{ padding: "40px 80px" }}>
        <div
          style={{
            background: "white",
            borderRadius: 12,
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>
              Quản Lý Dự Án Nhóm
            </h2>
            <button
              style={{
                background: "#0D6EFD",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              + Thêm Dự Án
            </button>
          </div>

          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Tìm kiếm dự án"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "8px 12px",
                outline: "none",
              }}
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
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={`${styles.btn} ${styles.edit}`}>
                          Sửa
                        </button>
                        <button className={`${styles.btn} ${styles.delete}`}>
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

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button
              style={{
                background: "#0D6EFD",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                marginRight: 4,
                cursor: "pointer",
              }}
            >
              1
            </button>
            <button
              style={{
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: "6px 12px",
                background: "white",
                cursor: "pointer",
              }}
            >
              2
            </button>
            <button
              style={{
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: "6px 12px",
                background: "white",
                cursor: "pointer",
              }}
            >
              3
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectList;
