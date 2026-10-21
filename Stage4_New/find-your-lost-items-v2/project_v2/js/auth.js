// auth.js - register, login, logout, and the user name in the navbar.
// Loaded on EVERY page (the navbar needs it).
// Needs: storage.js and ui.js (load them BEFORE this file).

// Small helper: a failed result
function fail(message) {
  return { ok: false, message: message };
}

// ---------- Register ----------

// Try to create a new account. "data" is an object with the form values.
// Returns { ok: true/false, message: "..." }
function createUser(data) {
  const email = data.email.trim().toLowerCase();
  const studentId = data.studentId.trim();

  if (data.password !== data.confirmPassword) {
    return fail("Password and confirm password are not the same.");
  }

  // Where is the student from? (the lecturer asked for this information)
  let origin = "";
  if (data.originType === "india") {
    if (data.originState === "") {
      return fail("Please choose your state.");
    }
    origin = data.originState + ", India";
  } else if (data.originType === "international") {
    const country = data.originCountry.trim();
    if (country.length < 2) {
      return fail("Please type your country.");
    }
    origin = country;
  } else {
    return fail("Please choose where you are from.");
  }

  if (findUserByEmail(email) !== null) {
    return fail("This email is already registered. Please login.");
  }
  if (findUserByStudentId(studentId) !== null) {
    return fail("This student ID is already registered.");
  }

  const users = getUsers();
  users.push({
    id: Date.now(),
    fullName: data.fullName.trim(),
    studentId: studentId,
    email: email,
    phone: data.phone.trim(),
    originType: data.originType,
    originState: data.originState,
    originCountry: data.originCountry.trim(),
    origin: origin,                // for example "Gujarat, India" or "Nepal"
    password: data.password,       // demo only: a real website must NEVER save a plain password
    createdAt: new Date().toISOString()
  });
  saveUsers(users);

  return { ok: true, message: "Account created! Redirecting to login..." };
}

// ---------- Login / Logout ----------

// Try to login. Returns { ok: true/false, message: "..." }
function loginUser(email, password) {
  email = email.trim().toLowerCase();
  const user = findUserByEmail(email);

  // Same message for "no account" and "wrong password" (safer)
  if (user === null || user.password !== password) {
    return fail("Wrong email or password.");
  }

  // Save only the safe information (NO password)
  setCurrentUser({
    id: user.id,
    fullName: user.fullName,
    studentId: user.studentId,
    email: user.email,
    phone: user.phone,
    origin: user.origin
  });
  return { ok: true, message: "Login successful! Redirecting..." };
}

function logoutUser() {
  clearCurrentUser();
}

// ---------- Navbar ----------

// If someone is logged in: "Login" becomes "Hi, Name" and "Register" becomes "Logout"
function updateNavbar() {
  const user = getCurrentUser();
  if (user === null) {
    return;
  }

  const navLogin = document.getElementById("navLogin");
  const navRegister = document.getElementById("navRegister");
  if (navLogin === null || navRegister === null) {
    return;
  }

  navLogin.textContent = "Hi, " + user.fullName.split(" ")[0];
  navLogin.href = "#";

  navRegister.textContent = "Logout";
  navRegister.href = "#";
  navRegister.addEventListener("click", function (event) {
    event.preventDefault();
    logoutUser();
    window.location.reload();
  });
}

// ---------- Register form ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    const originRadio = document.querySelector('input[name="originType"]:checked');

    const result = createUser({
      fullName: document.getElementById("fullName").value,
      studentId: document.getElementById("studentId").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      originType: originRadio ? originRadio.value : "",
      originState: document.getElementById("originState").value,
      originCountry: document.getElementById("originCountry").value,
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value
    });

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
