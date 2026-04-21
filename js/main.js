// =============================================
//  BREW & GRIND — Main JavaScript File
//  Handles: date/time, nav, validation,
//  login, customer ID, FAQ, suggestions
// =============================================

// --- Array of branches (used in forms & loops) ---
var branches = ["Kingston - New Kingston", "Portmore - Portmore Mall", "Spanish Town - White Marl"];

// --- Display current date and time ---
function displayDateTime() {
  var dateEl = document.getElementById("current-date");
  var timeEl = document.getElementById("current-time");
  if (dateEl || timeEl) {
    var now = new Date();
    var dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    var timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    if (dateEl) dateEl.textContent = now.toLocaleDateString("en-JM", dateOptions);
    if (timeEl) timeEl.textContent = now.toLocaleTimeString("en-JM", timeOptions);
  }
}

// Update time every second
setInterval(displayDateTime, 1000);

// --- Highlight active nav link ---
function setActiveNav() {
  var links = document.querySelectorAll(".nav-links a");
  var current = window.location.pathname.split("/").pop();
  links.forEach(function(link) {
    var href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// --- Generate unique Customer ID ---
function generateCustomerID() {
  var timestamp = Date.now().toString().slice(-6);
  var random = Math.floor(Math.random() * 900 + 100);
  return "BG-" + timestamp + "-" + random;
}

// --- Populate branch dropdowns using a loop ---
function populateBranches() {
  var selects = document.querySelectorAll(".branch-select");
  selects.forEach(function(select) {
    for (var i = 0; i < branches.length; i++) {
      var option = document.createElement("option");
      option.value = branches[i];
      option.textContent = branches[i];
      select.appendChild(option);
    }
  });
}

// --- Registration Form Validation ---
function validateRegistrationForm(event) {
  event.preventDefault();
  var msgBox = document.getElementById("reg-message");

  try {
    // Get field values
    var firstName = document.getElementById("firstName").value.trim();
    var lastName  = document.getElementById("lastName").value.trim();
    var email     = document.getElementById("email").value.trim();
    var phone     = document.getElementById("phone").value.trim();
    var dob       = document.getElementById("dob").value;
    var regDate   = document.getElementById("regDate").value;
    var branch1   = document.getElementById("branch1").value;
    var branch2   = document.getElementById("branch2").value;

    // Validation checks
    if (firstName.length < 3) {
      throw new Error("First name must be at least 3 characters.");
    }
    if (lastName.length < 3) {
      throw new Error("Last name must be at least 3 characters.");
    }
    if (email.length === 0 || email.indexOf("@") === -1) {
      throw new Error("Please enter a valid email address.");
    }
    if (isNaN(phone) || phone.length < 7) {
      throw new Error("Phone number must be numeric and at least 7 digits.");
    }
    if (dob === "") {
      throw new Error("Please enter your date of birth.");
    }
    if (regDate === "") {
      throw new Error("Please enter a registration date.");
    }
    if (branch1 === "" || branch2 === "") {
      throw new Error("Please select two nearest branches.");
    }
    if (branch1 === branch2) {
      throw new Error("Please select two different branches.");
    }

    // Generate customer ID
    var customerID = generateCustomerID();

    // Build summary
    var summary = "Customer ID: " + customerID + "\n"
      + "Name: " + firstName + " " + lastName + "\n"
      + "Email: " + email + "\n"
      + "Branches: " + branch1 + ", " + branch2;

    // Show success message
    msgBox.className = "alert alert-success";
    msgBox.innerHTML = "<strong>Registration Successful!</strong><br>"
      + "Your Customer ID is: <strong>" + customerID + "</strong><br>"
      + "A confirmation has been sent to <strong>" + email + "</strong>.";
    msgBox.style.display = "block";

    // Simulate email (mailto link)
    var mailtoLink = "mailto:info@brewandgrind.com"
      + "?subject=New Customer Registration"
      + "&body=" + encodeURIComponent(summary);
    window.location.href = mailtoLink;

  } catch (err) {
    // Catch and display validation errors
    msgBox.className = "alert alert-error";
    msgBox.textContent = err.message;
    msgBox.style.display = "block";
  } finally {
    // Always scroll to message
    if (msgBox) msgBox.scrollIntoView({ behavior: "smooth" });
  }
}

// --- Login for Products Page ---
function handleLogin(event) {
  event.preventDefault();
  var username = document.getElementById("loginUser").value.trim();
  var password = document.getElementById("loginPass").value.trim();
  var msgBox   = document.getElementById("login-message");

  try {
    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters.");
    }
    if (password.length < 4) {
      throw new Error("Password must be at least 4 characters.");
    }

    // Accepted credentials
    var validUser = "guest";
    var validPass = "brew2024";

    if (username === validUser && password === validPass) {
      // Store login in sessionStorage and show menu
      sessionStorage.setItem("bg_logged_in", "true");
      document.getElementById("login-section").style.display = "none";
      document.getElementById("menu-section").style.display  = "block";
    } else {
      throw new Error("Invalid username or password. Try: guest / brew2024");
    }

  } catch (err) {
    msgBox.className = "alert alert-error";
    msgBox.textContent = err.message;
    msgBox.style.display = "block";
  } finally {
    if (msgBox) msgBox.scrollIntoView({ behavior: "smooth" });
  }
}

// --- Check login on products page load ---
function checkLogin() {
  var loginSection = document.getElementById("login-section");
  var menuSection  = document.getElementById("menu-section");
  if (!loginSection || !menuSection) return;

  if (sessionStorage.getItem("bg_logged_in") === "true") {
    loginSection.style.display = "none";
    menuSection.style.display  = "block";
  } else {
    loginSection.style.display = "block";
    menuSection.style.display  = "none";
  }
}

// --- Logout ---
function logout() {
  sessionStorage.removeItem("bg_logged_in");
  checkLogin();
}

// --- Suggestion Form Validation ---
function validateSuggestionForm(event) {
  event.preventDefault();
  var msgBox = document.getElementById("sug-message");
  var name   = document.getElementById("sugName").value.trim();
  var email  = document.getElementById("sugEmail").value.trim();
  var idea   = document.getElementById("sugIdea").value.trim();

  try {
    if (name.length < 3) {
      throw new Error("Name must be at least 3 characters.");
    }
    if (email.indexOf("@") === -1) {
      throw new Error("Please enter a valid email address.");
    }
    if (idea.length < 10) {
      throw new Error("Please describe your idea in at least 10 characters.");
    }

    msgBox.className = "alert alert-success";
    msgBox.textContent = "Thank you, " + name + "! Your suggestion has been received.";
    msgBox.style.display = "block";
    document.getElementById("suggestion-form").reset();

  } catch (err) {
    msgBox.className = "alert alert-error";
    msgBox.textContent = err.message;
    msgBox.style.display = "block";
  } finally {
    if (msgBox) msgBox.scrollIntoView({ behavior: "smooth" });
  }
}

// --- Window onload ---
window.onload = function() {
  displayDateTime();
  setActiveNav();
  populateBranches();
  checkLogin();

  // Attach form events
  var regForm = document.getElementById("registration-form");
  if (regForm) regForm.onsubmit = validateRegistrationForm;

  var loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.onsubmit = handleLogin;

  var sugForm = document.getElementById("suggestion-form");
  if (sugForm) sugForm.onsubmit = validateSuggestionForm;
};
