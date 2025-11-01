import { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/storage";
import { getFullProjects } from "../utils/storage";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import type { Task } from "../interfaces/project";
import styles from "../styles/Table.module.css";
import layoutStyles from "../styles/ProjectList.module.css";
import { Link } from "react-router-dom";

const MyTasks = () => {
  const [currentUser] = useState(() => getCurrentUser());
  const [myTasks, setMyTasks] = useState<Array<Task & { projectName: string; projectId: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Load all projects
    const allProjects = getFullProjects();
    
    // Filter projects where user is a member or owner
    const userProjects = allProjects.filter(project => 
      project.ownerId === currentUser.id ||
      project.members?.some(m => m.email === currentUser.email)
    );

    // Get all tasks assigned to current user
    const tasks: Array<Task & { projectName: string; projectId: number }> = [];
    
    userProjects.forEach(project => {
      if (project.tasks && Array.isArray(project.tasks)) {
        project.tasks.forEach(task => {
          // Check if task is assigned to current user (by name or email)
          if (
            task.assignee === currentUser.fullName ||
            task.assignee === currentUser.email ||
            task.assignee?.toLowerCase().includes(currentUser.fullName.toLowerCase())
          ) {
            tasks.push({
              ...task,
              projectName: project.name,
              projectId: project.id
            });
          }
        });
      }
    });

    setMyTasks(tasks);
    setLoading(false);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className={layoutStyles.pageWrapper}>
        <Header />
        <main className={layoutStyles.mainSection}>
          <div className={layoutStyles.card}>
            <h2 className={layoutStyles.title}>Nhiệm Vụ Cá Nhân</h2>
            <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
              <p>⚠️ Vui lòng đăng nhập để xem nhiệm vụ</p>
              <Link to="/login" style={{ color: "#0d6efd", textDecoration: "underline" }}>
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={layoutStyles.pageWrapper}>
        <Header />
        <main className={layoutStyles.mainSection}>
          <div className={layoutStyles.card}>
            <h2 className={layoutStyles.title}>Nhiệm Vụ Cá Nhân</h2>
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p>Đang tải...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Group tasks by status
  const tasksByStatus = {
    "To do": myTasks.filter(t => t.status === "To do"),
    "In Progress": myTasks.filter(t => t.status === "In Progress"),
    "Pending": myTasks.filter(t => t.status === "Pending"),
    "Done": myTasks.filter(t => t.status === "Done"),
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "Cao": return "badge-high";
      case "Trung Bình": return "badge-medium";
      case "Thấp": return "badge-low";
      default: return "";
    }
  };

  const getProgressClass = (progress: string) => {
    switch (progress) {
      case "Đúng tiến độ": return "badge-success";
      case "Trễ hạn": return "badge-danger";
      case "Có rủi ro": return "badge-warning";
      default: return "";
    }
  };

  return (
    <div className={layoutStyles.pageWrapper}>
      <Header />
      
      <main className={layoutStyles.mainSection}>
        <div className={layoutStyles.card}>
          <div className={layoutStyles.headerRow}>
            <h2 className={layoutStyles.title}>Nhiệm Vụ Cá Nhân</h2>
            <div style={{ color: "#666", fontSize: "0.875rem" }}>
              Tổng: {myTasks.length} nhiệm vụ
            </div>
          </div>

          {myTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
              <p>📋 Hiện tại chưa có nhiệm vụ nào được giao</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Nhiệm vụ sẽ xuất hiện khi bạn được giao việc trong các dự án
              </p>
            </div>
          ) : (
            <div style={{ marginTop: "1.5rem" }}>
              {/* Task Statistics */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "1rem", 
                marginBottom: "2rem" 
              }}>
                <div style={{ 
                  padding: "1rem", 
                  background: "#f8f9fa", 
                  borderRadius: "8px",
                  borderLeft: "4px solid #6c757d"
                }}>
                  <div style={{ fontSize: "0.875rem", color: "#666" }}>To do</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                    {tasksByStatus["To do"].length}
                  </div>
                </div>
                
                <div style={{ 
                  padding: "1rem", 
                  background: "#e7f3ff", 
                  borderRadius: "8px",
                  borderLeft: "4px solid #0d6efd"
                }}>
                  <div style={{ fontSize: "0.875rem", color: "#666" }}>In Progress</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#0d6efd" }}>
                    {tasksByStatus["In Progress"].length}
                  </div>
                </div>
                
                <div style={{ 
                  padding: "1rem", 
                  background: "#fff4e6", 
                  borderRadius: "8px",
                  borderLeft: "4px solid #ffc107"
                }}>
                  <div style={{ fontSize: "0.875rem", color: "#666" }}>Pending</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#ffc107" }}>
                    {tasksByStatus["Pending"].length}
                  </div>
                </div>
                
                <div style={{ 
                  padding: "1rem", 
                  background: "#e8f5e9", 
                  borderRadius: "8px",
                  borderLeft: "4px solid #28a745"
                }}>
                  <div style={{ fontSize: "0.875rem", color: "#666" }}>Done</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#28a745" }}>
                    {tasksByStatus["Done"].length}
                  </div>
                </div>
              </div>

              {/* Tasks Table */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nhiệm vụ</th>
                      <th>Dự án</th>
                      <th>Ưu tiên</th>
                      <th>Tiến độ</th>
                      <th>Trạng thái</th>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTasks.map((task) => (
                      <tr key={`${task.projectId}-${task.id}`}>
                        <td>
                          <div style={{ fontWeight: "500" }}>{task.name}</div>
                        </td>
                        <td>
                          <Link 
                            to={`/projects/${task.projectId}`}
                            style={{ color: "#0d6efd", textDecoration: "none" }}
                          >
                            {task.projectName}
                          </Link>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getProgressClass(task.progress)}`}>
                            {task.progress}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            task.status === "Done" ? "badge-success" :
                            task.status === "In Progress" ? "badge-primary" :
                            task.status === "Pending" ? "badge-warning" :
                            "badge-secondary"
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.875rem", color: "#666" }}>
                          {task.startDate} - {task.endDate}
                        </td>
                        <td>
                          <Link
                            to={`/projects/${task.projectId}`}
                            className={`${styles.btn} ${styles.detail}`}
                            style={{ fontSize: "0.875rem" }}
                          >
                            Xem dự án
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyTasks;
