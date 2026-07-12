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
    title: "Nature of Inquiry and Research",
    description: "PR2 Nature of Inquiry and Research.",
    icon: "🌱",
    fileUrl: "modules/Nature-of-Inquiry-and-Research.pdf",
    content: "This module introduces the basics of quantitative research, helping students understand the importance of inquiry, identify research problems, and develop evidence-based solutions through systematic investigation."
  },
  {
    id: "mod-2",
    title: "Identifying the Inquiry and Stating the Problem",
    description: "PR2 Identifying the Inquiry and Stating the Problem",
    icon: "🔌",
    fileUrl: "modules/Identifying-the-Inquiry-and-Stating-the-Problem.pdf",
    content: "This module guides students in identifying a research problem, formulating clear research questions, and developing a focused and relevant statement of the problem for a quantitative study.."
  },
  {
    id: "mod-3",
    title: "Conceptual Framework and Review of Related Literature",
    description: "Collect, analyze, and organize related literature and studies to support and strengthen their research..",
    icon: "💻",
    fileUrl: "modules/Conceptual-Framework-and-Review-of-Related-Literature.pdf",
    content: "This module teaches students how to gather, evaluate, and synthesize related literature and studies to support their research, identify knowledge gaps, and strengthen the foundation of their study.."
  }
  {
  id: "mod-4",
  title: "Understanding Data and Ways to Collect Them",
  description: "This module introduces the methods and tools used to collect accurate and reliable research data.",
  icon: "📘",
  fileUrl: "modules/Understanding-Data-and-Ways-to-Collect-Them.pdf",
  content: "This module focuses on the systematic collection of research data using appropriate methods, instruments and etyhical practices."
},
{
  id: "mod-5",
  title: "Data Collection Presentation and Analysis",
  description: "This module teaches students how to collect, organize, present, and analyze quantitative research data to draw meaningful conclusions.",
  icon: "📘",
  fileUrl: "modules/Data-Collection-Presentation-and-Analysis.pdf",
  content: "This module guides students through the process of collecting research data, presenting it using tables and graphs, and analyzing the results with appropriate statistical tools. It emphasizes accurate interpretation of findings to support valid conclusions and research recommendations."
},
{
  id: "mod-6",
  title: "Research Conclusions and Recommendations",
  description: "This module teaches students how to draw evidence-based conclusions and formulate practical recommendations from their research findings.",
  icon: "📘",
  fileUrl: "modules/Research-Conclusions-and-Recommendations.pdf",
  content: "This module helps students interpret their research results to develop logical conclusions that answer the research questions."
},
];

// ---------- Sample quiz data (stand-in for AI-generated quiz later) ----------
// TODO: Replace this with a real call to your Firebase Cloud Function, which
// asks the Claude API to generate questions from currentModule.content and
// return them in this exact shape: { question, options: [...], correctIndex }
const SAMPLE_QUIZZES = {
  "mod-1": [
    {
      question: "Which part of a robot is responsible for detecting its environment?",
      options: ["Actuator", "Sensor", "Controller", "Battery"],
      correctIndex: 1
    },
    {
      question: "What role does the controller play in a robot?",
      options: ["Provides power", "Moves the robot", "Processes information", "Detects light"],
      correctIndex: 2
    },
    {
      question: "Which of these is an example of an actuator?",
      options: ["Motor", "Camera", "Microphone", "Thermometer"],
      correctIndex: 0
    }
  ],
  "mod-2": [
    {
      question: "What does Ohm's Law state?",
      options: ["V = I + R", "V = I / R", "V = IR", "V = R / I"],
      correctIndex: 2
    },
    {
      question: "In a simple series circuit, what powers the LED?",
      options: ["The resistor", "The battery", "The wire", "The switch"],
      correctIndex: 1
    },
    {
      question: "What is the purpose of a resistor in a basic circuit?",
      options: ["Store energy", "Limit current flow", "Generate light", "Increase voltage"],
      correctIndex: 1
    }
  ],
  "mod-3": [
    {
      question: "What is used to store data in a program?",
      options: ["A loop", "A conditional", "A variable", "A function"],
      correctIndex: 2
    },
    {
      question: "Which structure is used to repeat an action multiple times?",
      options: ["Conditional", "Loop", "Variable", "Comment"],
      correctIndex: 1
    },
    {
      question: "An if/else statement is an example of what kind of logic?",
      options: ["Looping", "Conditional", "Variable assignment", "Data storage"],
      correctIndex: 1
    }
  ]
};

let currentModule = null;
let currentQuiz = null;      // holds the active quiz question array
let studentAnswers = {};     // { questionIndex: selectedOptionIndex }

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
  document.getElementById("ai-output").innerHTML = "";
  currentQuiz = null;
  studentAnswers = {};
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
  const notesText =
    `REVIEW NOTES — ${currentModule.title}\n\n` +
    `• ${currentModule.content}\n\n` +
    `(This is placeholder text. Once connected to the Claude API, real ` +
    `AI-generated review notes will appear here.)`;
  output.innerHTML = "";
  const p = document.createElement("p");
  p.className = "ai-output-text";
  p.textContent = notesText;
  output.appendChild(p);
});

// ---------- AI-assisted quiz generator ----------
document.getElementById("btn-generate-quiz").addEventListener("click", async () => {
  const output = document.getElementById("ai-output");
  output.hidden = false;
  output.innerHTML = "Generating quiz...";

  // TODO: Replace this mock with a real call to your Firebase Cloud Function,
  // which calls the Claude API asking for multiple-choice questions based on
  // currentModule.content, returned as structured JSON in this shape:
  // [{ question, options: [...], correctIndex }, ...]
  await fakeDelay(700);

  currentQuiz = SAMPLE_QUIZZES[currentModule.id] || [];
  studentAnswers = {};
  renderQuiz();
});

// ---------- Render the interactive quiz ----------
function renderQuiz() {
  const output = document.getElementById("ai-output");

  const questionsHtml = currentQuiz.map((q, qIndex) => `
    <div class="quiz-question" data-qindex="${qIndex}">
      <p class="quiz-question-text">${qIndex + 1}. ${q.question}</p>
      <div class="quiz-options">
        ${q.options.map((opt, oIndex) => `
          <button type="button" class="quiz-option" data-qindex="${qIndex}" data-oindex="${oIndex}">
            ${opt}
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");

  output.innerHTML = `
    <div class="quiz-wrap">
      <p class="quiz-heading">QUIZ — ${currentModule.title}</p>
      ${questionsHtml}
      <button id="btn-submit-quiz" class="btn btn--primary" disabled>Submit quiz</button>
      <div id="quiz-score" class="quiz-score" hidden></div>
    </div>
  `;

  // Wire up option selection
  output.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const qIndex = Number(btn.dataset.qindex);
      const oIndex = Number(btn.dataset.oindex);
      studentAnswers[qIndex] = oIndex;

      // Update visual selection within this question only
      output.querySelectorAll(`.quiz-option[data-qindex="${qIndex}"]`)
        .forEach(b => b.classList.remove("quiz-option--selected"));
      btn.classList.add("quiz-option--selected");

      // Enable submit once every question has an answer
      const submitBtn = document.getElementById("btn-submit-quiz");
      submitBtn.disabled = Object.keys(studentAnswers).length < currentQuiz.length;
    });
  });

  document.getElementById("btn-submit-quiz").addEventListener("click", gradeQuiz);
}

// ---------- Grade the quiz and show the score ----------
function gradeQuiz() {
  const output = document.getElementById("ai-output");
  let correctCount = 0;

  currentQuiz.forEach((q, qIndex) => {
    const selected = studentAnswers[qIndex];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount++;

    output.querySelectorAll(`.quiz-option[data-qindex="${qIndex}"]`).forEach(btn => {
      const oIndex = Number(btn.dataset.oindex);
      btn.disabled = true;
      if (oIndex === q.correctIndex) {
        btn.classList.add("quiz-option--correct");
      } else if (oIndex === selected && !isCorrect) {
        btn.classList.add("quiz-option--incorrect");
      }
    });
  });

  const submitBtn = document.getElementById("btn-submit-quiz");
  submitBtn.disabled = true;
  submitBtn.hidden = true;

  const scoreEl = document.getElementById("quiz-score");
  scoreEl.hidden = false;
  const percent = Math.round((correctCount / currentQuiz.length) * 100);
  scoreEl.innerHTML = `
    <p class="quiz-score-line">Your score: <strong>${correctCount}/${currentQuiz.length}</strong> (${percent}%)</p>
    <p class="quiz-score-note">${scoreMessage(percent)}</p>
  `;

  // TODO: Once Firebase is connected, save this result to Firestore, e.g.:
  //   db.collection("quizResults").add({
  //     studentId, moduleId: currentModule.id, score: correctCount,
  //     total: currentQuiz.length, timestamp: new Date()
  //   });
  // This gives you real pre/post performance data for your action research.
}

function scoreMessage(percent) {
  if (percent === 100) return "Perfect score! Great grasp of this module.";
  if (percent >= 70) return "Good job — review the items you missed before moving on.";
  return "Consider going back to the module notes before retaking this quiz.";
}

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
