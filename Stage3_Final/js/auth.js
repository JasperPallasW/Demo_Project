// auth.js - register, login, logout, and the navbar user name
// This file is loaded on EVERY page (the navbar needs it).
//
// localStorage is a small storage inside the browser.
// We use it instead of a real database.

const USERS_KEY = "lf_users";               // all registered accounts
const CURRENT_USER_KEY = "lf_current_user"; // the person who is logged in now

// ---------- Users (accounts) ----------

// Get all saved users. If nothing is saved yet, return an empty list.
function getUsers() {
  const saved = localStorage.getItem(USERS_KEY);
  if (saved === null) {
    return [];
  }
  try {
    return JSON.parse(saved); // text -> list
  } catch (error) {
    return [];
  }
}

// Save the list of users (list -> text, then store it)
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Look for a user with the same email. Return the user, or null if not found.
function findUserByEmail(email) {
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      return users[i];
    }
  }
  return null;
}

// Look for a user with the same student ID.
function findUserByStudentId(studentId) {
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].studentId === studentId) {
      return users[i];
    }
  }
  return null;
}

// Try to create a new account.
// Returns an object like { ok: true, message: "..." } or { ok: false, message: "..." }
function createUser(fullName, studentId, email, phone, password, confirmPassword) {
  email = email.trim().toLowerCase();
  studentId = studentId.trim();

  if (password !== confirmPassword) {
    return { ok: false, message: "Password and confirm password are not the same." };
  }
  if (findUserByEmail(email) !== null) {
    return { ok: false, message: "This email is already registered. Please login." };
  }
  if (findUserByStudentId(studentId) !== null) {
    return { ok: false, message: "This student ID is already registered." };
  }

  const users = getUsers();
  users.push({
    id: Date.now(),
    fullName: fullName.trim(),
    studentId: studentId,
    email: email,
    phone: phone.trim(),
    password: password, // demo only: a real website must NEVER save a plain password
    createdAt: new Date().toISOString()
  });
  saveUsers(users);

  return { ok: true, message: "Account created! Redirecting to login..." };
}

// ---------- Login session ----------

// Who is logged in now? Returns the user, or null if nobody.
function getCurrentUser() {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  if (saved === null) {
    return null;
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
}

// Try to login. Returns { ok: true/false, message: "..." }
function loginUser(email, password) {
  email = email.trim().toLowerCase();
  const user = findUserByEmail(email);

  // Same message for "no account" and "wrong password" (safer)
  if (user === null || user.password !== password) {
    return { ok: false, message: "Wrong email or password." };
  }

  // Save only the safe information (NO password)
  const currentUser = {
    id: user.id,
    fullName: user.fullName,
    studentId: user.studentId,
    email: user.email,
    phone: user.phone
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  return { ok: true, message: "Login successful! Redirecting..." };
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ---------- Messages ----------

// Show a colored message above the form. type: "success" or "danger"
function showMessage(text, type) {
  const box = document.getElementById("formMessage");
  box.innerHTML = "";
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert alert-" + type;
  alertDiv.textContent = text;
  box.appendChild(alertDiv);
}

// ---------- Navbar ----------

// If someone is logged in: "Login" becomes "Hi, Name" and "Register" becomes "Logout"
function updateNavbar() {
  const user = getCurrentUser();
  if (user === null) {
    return; // nobody logged in, keep the normal navbar
  }

  const navLogin = document.getElementById("navLogin");
  const navRegister = document.getElementById("navRegister");
  if (navLogin === null || navRegister === null) {
    return;
  }

  const firstName = user.fullName.split(" ")[0];
  navLogin.textContent = "Hi, " + firstName;
  navLogin.href = "#";

  navRegister.textContent = "Logout";
  navRegister.href = "#";
  navRegister.addEventListener("click", function (event) {
    event.preventDefault();
    logoutUser();
    window.location.reload(); // reload the page so the navbar goes back to normal
  });
}

// ---------- Register form ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    const result = createUser(
      document.getElementById("fullName").value,
      document.getElementById("studentId").value,
      document.getElementById("email").value,
      document.getElementById("phone").value,
      document.getElementById("password").value,
      document.getElementById("confirmPassword").value
    );

    if (result.ok) {
      showMessage(result.message, "success");
      registerForm.reset();
      setTimeout(function () {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showMessage(result.message, "danger");
    }
  });
}

// ---------- Login form ----------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const result = loginUser(
      document.getElementById("email").value,
      document.getElementById("password").value
    );

    if (result.ok) {
      showMessage(result.message, "success");
      setTimeout(function () {
        window.location.href = "../index.html";
      }, 1000);
    } else {
      showMessage(result.message, "danger");
    }
  });
}

// Run when the page opens
updateNavbar();
