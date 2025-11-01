// Khởi tạo Test Users và Projects
// Script này để test trong môi trường development

import { addUser, getUsers } from './utils/storage';
import { initialFullProjects } from './mock/initialProjects';
import { addFullProject, addProject } from './utils/storage';

export const initTestData = () => {
  // Check if users already exist
  const existingUsers = getUsers();
  
  if (existingUsers.length === 0) {
    console.log("🔧 Initializing test users...");
    
    // Create test users
    const testUsers = [
      {
        fullName: "An Nguyễn",
        email: "an@test.com",
        password: "12345678"
      },
      {
        fullName: "Bách Nguyễn", 
        email: "bach@test.com",
        password: "12345678"
      },
      {
        fullName: "Cường Trần",
        email: "cuong@test.com",
        password: "12345678"
      }
    ];

    testUsers.forEach(user => {
      addUser(user);
      console.log(`✅ Created user: ${user.email}`);
    });
  }

  // Initialize projects if not exists
  const storedProjects = localStorage.getItem('projects');
  if (!storedProjects || JSON.parse(storedProjects).length === 0) {
    console.log("🔧 Initializing test projects...");
    
    initialFullProjects.forEach(proj => {
      addFullProject(proj);
      addProject(proj.name, proj.ownerId);
      console.log(`✅ Created project: ${proj.name} (owner: ${proj.ownerId})`);
    });
  }

  console.log("✨ Test data initialized!");
  console.log("\n📝 Test Accounts:");
  console.log("- an@test.com / 12345678 (3 projects)");
  console.log("- bach@test.com / 12345678 (2 projects)");  
  console.log("- cuong@test.com / 12345678 (1 project)");
};

// Auto-init on import in development
if (import.meta.env.DEV) {
  initTestData();
}
