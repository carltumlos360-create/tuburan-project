// =====================================================================
// HUB — app.js
// Wherever you see a "TODO" block, that's where Firebase Storage or the
// Claude API (AI features) will get connected in later phases. Login is
// connected to real Firebase Authentication.
// =====================================================================

// ---------- Firebase setup ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwKcspSjQTPrBRSjb95v_6GJKxtjXGqJM",
  authDomain: "tuburan-app.firebaseapp.com",
  projectId: "tuburan-app",
  storageBucket: "tuburan-app.firebasestorage.app",
  messagingSenderId: "394353924137",
  appId: "1:394353924137:web:d67c7d0b9d3dffa0ac6438"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const AI_WORKER_URL = "https://tuburan-ai.carltumlos360.workers.dev/";

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
    content: "This module guides students in identifying a research problem, formulating clear research questions, and developing a focused and relevant statement of the problem for a quantitative study."
  },
  {
    id: "mod-3",
    title: "Conceptual Framework and Review of Related Literature",
    description: "Collect, analyze, and organize related literature and studies to support and strengthen their research.",
    icon: "💻",
    fileUrl: "modules/Conceptual-Framework-and-Review-of-Related-Literature.pdf",
    content: "This module teaches students how to gather, evaluate, and synthesize related literature and studies to support their research, identify knowledge gaps, and strengthen the foundation of their study."
  },
  {
    id: "mod-4",
    title: "Understanding Data and Ways to Collect Them",
    description: "This module introduces the methods and tools used to collect accurate and reliable research data.",
    icon: "📘",
    fileUrl: "modules/Understanding-Data-and-Ways-to-Collect-Them.pdf",
    content: "This module focuses on the systematic collection of research data using appropriate methods, instruments and ethical practices."
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
  }
];

// ---------- Sample quiz data (stand-in for AI-generated quiz later) ----------
// TODO: Replace this with a real call to your Firebase Cloud Function, which
// asks the Claude API to generate questions from currentModule.content and
// return them in this exact shape: { question, options: [...], correctIndex }
const SAMPLE_QUIZZES = {
  "mod-1": [
    {
      question: "What is the main purpose of conducting research?",
      options: ["To copy other studies", "To solve a problem through systematic inquiry", "To avoid asking questions", "To skip data collection"],
      correctIndex: 1
    },
    {
      question: "Quantitative research primarily deals with what kind of data?",
      options: ["Numerical data", "Personal opinions only", "Stories and narratives", "Drawings"],
      correctIndex: 0
    },
    {
      question: "Why is identifying a research problem an important first step?",
      options: ["It is optional", "It gives the study focus and direction", "It replaces the need for data", "It is done after writing conclusions"],
      correctIndex: 1
    }
  ],
  "mod-2": [
    {
      question: "What is a research question?",
      options: ["A guess with no basis", "A clear question the study aims to answer", "The title of the study", "The conclusion of the study"],
      correctIndex: 1
    },
    {
      question: "A good statement of the problem should be:",
      options: ["Vague and broad", "Focused and clearly defined", "Unrelated to the topic", "Written last"],
      correctIndex: 1
    },
    {
      question: "What usually comes first in the research process?",
      options: ["Writing the conclusion", "Identifying the inquiry/problem", "Collecting data", "Presenting results"],
      correctIndex: 1
    }
  ],
  "mod-3": [
    {
      question: "What is the purpose of a Review of Related Literature (RRL)?",
      options: ["To copy previous studies word-for-word", "To support and strengthen the study with existing research", "To replace the researcher's own data", "To avoid citing sources"],
      correctIndex: 1
    },
    {
      question: "A conceptual framework helps a researcher to:",
      options: ["Ignore existing theories", "Visually organize the relationship between study variables", "Skip the literature review", "Avoid forming a hypothesis"],
      correctIndex: 1
    },
    {
      question: "Reviewing related literature can help identify:",
      options: ["Grammar mistakes only", "Gaps in existing knowledge", "The researcher's grade", "Nothing useful"],
      correctIndex: 1
    }
  ],
  "mod-4": [
    {
      question: "Which of these is an example of a data collection method?",
      options: ["Guessing", "Survey questionnaire", "Ignoring participants", "Skipping the study"],
      correctIndex: 1
    },
    {
      question: "Why is it important to follow ethical practices when collecting data?",
      options: ["It is not important", "To protect participants and ensure honest results", "To make the study longer", "To avoid using instruments"],
      correctIndex: 1
    },
    {
      question: "A data collection instrument should be:",
      options: ["Random and untested", "Appropriate and reliable for the study", "Copied without permission", "Unrelated to the research questions"],
      correctIndex: 1
    }
  ],
  "mod-5": [
    {
      question: "What is commonly used to visually present quantitative data?",
      options: ["Tables and graphs", "Random guesses", "Personal opinions", "Unrelated images"],
      correctIndex: 0
    },
    {
      question: "Why do researchers analyze collected data?",
      options: ["To make the paper longer", "To draw meaningful and accurate conclusions", "To avoid using statistics", "To skip the discussion section"],
      correctIndex: 1
    },
    {
      question: "Accurate interpretation of results supports:",
      options: ["Random conclusions", "Valid conclusions and recommendations", "Ignoring the data", "Repeating the introduction"],
      correctIndex: 1
    }
  ],
  "mod-6": [
    {
      question: "A research conclusion should be based on:",
      options: ["Personal assumptions only", "The actual findings/results of the study", "Unrelated topics", "Guesses made before the study"],
      correctIndex: 1
    },
    {
      question: "What is the purpose of research recommendations?",
      options: ["To criticize the researcher", "To suggest practical actions based on the findings", "To repeat the problem statement", "To replace the conclusion"],
      correctIndex: 1
    },
    {
      question: "Conclusions in a research paper should directly answer:",
      options: ["Unrelated questions", "The research questions stated earlier in the study", "Only the title", "Nothing in particular"],
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
  const submitBtn = e.target.querySelector("button[type='submit']");

  errorEl.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      renderModuleGrid();
      showView("view-dashboard");
    })
    .catch((err) => {
      errorEl.textContent = friendlyAuthError(err.code);
      errorEl.hidden = false;
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Log in";
    });
});

function friendlyAuthError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "No account found with that email and password.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Login failed. Please check your details and try again.";
  }
}

document.getElementById("btn-logout").addEventListener("click", () => {
  signOut(auth).then(() => showView("view-login"));
});

// ---------- Keep user logged in across page refreshes ----------
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderModuleGrid();
    showView("view-dashboard");
  } else {
    showView("view-login");
  }
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
  const link = document.createElement("a");
  link.href = currentModule.fileUrl;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// ---------- AI-assisted review notes ----------
document.getElementById("btn-generate-notes").addEventListener("click", async () => {
  const output = document.getElementById("ai-output");
  output.hidden = false;
  output.innerHTML = "";
  const loadingP = document.createElement("p");
  loadingP.className = "ai-output-text";
  loadingP.textContent = "Generating review notes...";
  output.appendChild(loadingP);

  try {
    const response = await fetch(AI_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "notes",
        moduleTitle: currentModule.title,
        moduleContent: currentModule.content
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error ? JSON.stringify(data.error) : "Unknown error from AI service");
    }

    output.innerHTML = "";
    const p = document.createElement("p");
    p.className = "ai-output-text";
    p.textContent = data.result || "No notes were returned. Please try again.";
    output.appendChild(p);
  } catch (err) {
    output.innerHTML = "";
    const p = document.createElement("p");
    p.className = "ai-output-text";
    p.textContent =
      `Couldn't generate AI review notes right now.\n\n` +
      `Error details: ${err.message}\n\n` +
      `Showing the module summary instead:\n\n${currentModule.content}`;
    output.appendChild(p);
  }
});

// ---------- AI-assisted quiz generator ----------
document.getElementById("btn-generate-quiz").addEventListener("click", async () => {
  const output = document.getElementById("ai-output");
  output.hidden = false;
  output.innerHTML = "Generating quiz...";

  try {
    const response = await fetch(AI_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "quiz",
        moduleTitle: currentModule.title,
        moduleContent: currentModule.content
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error ? JSON.stringify(data.error) : "Unknown error from AI service");
    }

    const cleanText = (data.result || "").replace(/```json|```/g, "").trim();
    const parsedQuiz = JSON.parse(cleanText);

    if (!Array.isArray(parsedQuiz) || parsedQuiz.length === 0) {
      throw new Error("AI returned an unexpected format");
    }

    currentQuiz = parsedQuiz;
    studentAnswers = {};
    renderQuiz();
  } catch (err) {
    currentQuiz = pickRandomQuestions(SAMPLE_QUIZZES[currentModule.id] || [], 15);
    studentAnswers = {};
    renderQuiz();

    const notice = document.createElement("p");
    notice.className = "ai-output-text";
    notice.style.marginTop = "12px";
    notice.style.fontSize = "12.5px";
    notice.style.color = "#57545F";
    notice.textContent = `(AI quiz generation failed — showing practice questions instead. Details: ${err.message})`;
    output.appendChild(notice);
  }
});

// ---------- Pick a random subset of questions (fresh set each time) ----------
function pickRandomQuestions(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

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

  output.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const qIndex = Number(btn.dataset.qindex);
      const oIndex = Number(btn.dataset.oindex);
      studentAnswers[qIndex] = oIndex;

      output.querySelectorAll(`.quiz-option[data-qindex="${qIndex}"]`)
        .forEach(b => b.classList.remove("quiz-option--selected"));
      btn.classList.add("quiz-option--selected");

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
}

function scoreMessage(percent) {
  if (percent === 100) return "Perfect score! Great grasp of this module.";
  if (percent >= 70) return "Good job — review the items you missed before moving on.";
  return "Consider going back to the module notes before retaking this quiz.";
}

// ---------- Register service worker (enables PWA install + offline) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(console.error);
  });
}