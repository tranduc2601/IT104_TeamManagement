// Test users for development
// Run this in browser console to create test users

const testUsers = [
  {
    id: 1,
    fullName: "An Nguyễn",
    email: "an@test.com",
    password: "12345678"
  },
  {
    id: 2,
    fullName: "Bách Nguyễn", 
    email: "bach@test.com",
    password: "12345678"
  },
  {
    id: 3,
    fullName: "Cường Trần",
    email: "cuong@test.com",
    password: "12345678"
  }
];

// Save to localStorage
localStorage.setItem('users', JSON.stringify(testUsers));

console.log("✅ Test users created:");
console.log("- an@test.com / 12345678 (has 3 projects)");
console.log("- bach@test.com / 12345678 (has 2 projects)");
console.log("- cuong@test.com / 12345678 (has 1 project)");
