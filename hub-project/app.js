// =====================================================================
// HUB — app.js
// This is a working front-end skeleton. Wherever you see a "TODO" block,
// that's where Firebase (login, storage) or the Claude API (AI features)
// will get connected in later phases. For now, everything runs on
// sample data so you can see and test the full app flow immediately.
// =====================================================================

// ---------- Sample data (stand-in for Firestore later) ----------
const SAMPLE_MODULES = [
  {
    id: "mod-1",
    title: "Introduction to Robotics",
    description: "Basic components of a robot: sensors, actuators, and controllers.",
    icon: "🤖",
    fileUrl: "#", // TODO: replace with real Firebase Storage download URL
    content: "A robot senses its environment, processes information, and acts on it using motors and actuators. This module covers the three core building blocks: sensors (input), controllers (processing), and actuators (output)."
  },
  {
    id: "mod-2",
    title: "Basic Circuits",
    description: "Understanding voltage, current, resistance, and simple circuits.",
    icon: "🔌",
    fileUrl: "#",
    content: "Ohm's Law relates voltage, current, and resistance: V = IR. This module walks through building a simple series circuit using a battery, resistor, and LED."
  },
  {
    id: "mod-3",
    title: "Intro to Programming Logic",
    description: "Variables, loops, and conditionals used in basic robot programming.",
    icon: "💻",
    fileUrl: "#",
    content: "Programming logic uses variables to store data, conditionals (if/else) to make decisions, and loops to repeat actions — the same building blocks used to program a robot's behavior."
  }
];

let currentModule = null;

// ---------- View switching ----------
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("view--active"));
  document.getElementById(id).classList.add("view--active");
}

// ---------- Login ----------
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");

  // TODO: Replace this block with real Firebase Authentication:
  //   firebase.auth().signInWithEmailAndPassword(email, password)
  //     .then(() => showView("view-dashboard"))
  //     .catch(err => { errorEl.textContent = err.message; errorEl.hidden = false; });
  if (email && password) {
    errorEl.hidden = true;
    renderModuleGrid();
    showView("view-dashboard");
  } else {
    errorEl.textContent = "Please enter both email and password.";
    errorEl.hidden = false;
  }
});

document.getElementById("btn-logout").addEventListener("click", () => {
  // TODO: Replace with firebase.auth().signOut()
  showView("view-login");
});

// ---------- Dashboard: render module cards ----------
function renderModuleGrid() {
  const grid = document.getElementById("module-grid");
  grid.innerHTML = "";
  SAMPLE_MODULES.forEach(mod => {
    const card = document.createElement("button");
    card.className = "module-card";
    card.innerHTML = `
      <span class="module-card-icon">${mod.icon}</span>
      <h3>${mod.title}</h3>
      <p>${mod.description}</p>
    `;
    card.addEventListener("click", () => openModule(mod.id));
    grid.appendChild(card);
  });
}

// ---------- Module detail ----------
function openModule(id) {
  currentModule = SAMPLE_MODULES.find(m => m.id === id);
  document.getElementById("module-title").textContent = currentModule.title;
  document.getElementById("module-title-top").textContent = currentModule.title;
  document.getElementById("module-description").textContent = currentModule.content;
  document.getElementById("ai-output").hidden = true;
  document.getElementById("ai-output").textContent = "";
  showView("view-module");
}

document.getElementById("btn-back").addEventListener("click", () => {
  showView("view-dashboard");
});

document.getElementById("btn-download").addEventListener("click", () => {
  // TODO: Replace with real Firebase Storage file download:
  //   window.location.href = currentModule.fileUrl;
  alert(`(Demo) This would download: ${currentModule.title}.pdf`);
});

// ---------- AI-assisted review notes ----------
document.getElementById("btn-generate-notes").addEventListener("click", async () => {
  const output = document.getElementById("ai-output");
  output.hidden = false;
  output.textContent = "Generating review notes...";

  // TODO: Replace this mock with a real call to your Firebase Cloud Function,
  // which securely calls the Claude API with currentModule.content and
  // a prompt like: "Summarize this into concise student review notes."
  await fakeDelay(900);
  output.textContent =
    `REVIEW NOTES — ${currentModule.title}\n\n` +
    `• ${currentModule.content}\n\n` +
    `(This is placeholder text. Once connected to the Claude API, real ` +
    `AI-generated review notes will appear here.)`;
});

// ---------- AI-assisted quiz generator ----------
document.getElementById("btn-generate-quiz").addEventListener("click", async () => {
  const output = document.getElementById("ai-output");
  output.hidden = false;
  output.textContent = "Generating quiz...";

  // TODO: Replace this mock with a real call to your Firebase Cloud Function,
  // which calls the Claude API asking for 5 multiple-choice questions
  // based on currentModule.content, returned as structured JSON.
  await fakeDelay(900);
  output.textContent =
    `QUIZ — ${currentModule.title}\n\n` +
    `1. (Sample question generated from this module's content)\n` +
    `   A. Option A   B. Option B   C. Option C   D. Option D\n\n` +
    `(This is placeholder text. Once connected to the Claude API, a real ` +
    `AI-generated quiz will appear here.)`;
});

function fakeDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------- Register service worker (enables PWA install + offline) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(console.error);
  });
}

// ---------- Start on login screen ----------
showView("view-login");
