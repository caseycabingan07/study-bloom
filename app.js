// quote collection
const quotes = [
  { text: "Every journey has its final day. Don't rush.", author: "Zhongli — Genshin Impact" },
  { text: "Rules are made to be broken!", author: "Trailblazer — Honkai: Star Rail" },
  { text: "A successful day starts from the morning. Let's give it our all today.", author: "Jean — Genshin Impact" },
  { text: "We've still got work to do. Let's keep going.", author: "Jean — Genshin Impact" },
  { text: "Training is finished for today. Great work, you've earned a good rest.", author: "Jean — Genshin Impact" },
  { text: "Only by blazing a trail forward can we set time in motion and give it meaning.", author: "Dan Heng — Honkai: Star Rail" },
  { text: "May this journey lead us starward!", author: "Trailblazer — Honkai: Star Rail" },
  { text: "Something on your mind again? Let's work through it together.", author: "Nahida — Genshin Impact" }
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const tabs = document.querySelector("#day-tabs");
const selectedDayTitle = document.querySelector("#selected-day-title");
const daySummary = document.querySelector("#day-summary");
const taskForm = document.querySelector("#task-form");
const taskName = document.querySelector("#task-name");
const taskDescription = document.querySelector("#task-description");
const taskDeadline = document.querySelector("#task-deadline");
const taskList = document.querySelector("#task-list");
const pendingCount = document.querySelector("#pending-count");
const completedCount = document.querySelector("#completed-count");
const emptyMessage = document.querySelector("#empty-message");

// saved tasks
let tasks = JSON.parse(localStorage.getItem("studyBloomTasks") || "[]");
let selectedDay = "Monday";

function saveTasks() {
  localStorage.setItem("studyBloomTasks", JSON.stringify(tasks));
}

function createDayTabs() {
  tabs.innerHTML = "";

  days.forEach(day => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-tab";
    button.textContent = day.slice(0, 3);
    button.setAttribute("role", "tab");
    button.setAttribute("aria-label", day);
    button.setAttribute("aria-selected", day === selectedDay);

    button.addEventListener("click", () => {
      selectedDay = day;
      renderTasks();
      updateTabs();
    });

    tabs.appendChild(button);
  });
}

function updateTabs() {
  const buttons = tabs.querySelectorAll(".day-tab");

  buttons.forEach(button => {
    const isSelected = button.getAttribute("aria-label") === selectedDay;
    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-selected", isSelected);
  });

  selectedDayTitle.textContent = selectedDay;
  daySummary.textContent = `Your tasks for ${selectedDay}`;
}

function renderTasks() {
  taskList.innerHTML = "";

  const dayTasks = tasks.filter(task => task.day === selectedDay);

  dayTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.name} as completed`);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    content.appendChild(name);

    if (task.description) {
      const description = document.createElement("span");
      description.className = "task-description";
      description.textContent = task.description;
      content.appendChild(description);
    }

    if (task.deadline) {
      const deadline = document.createElement("span");
      deadline.className = "task-deadline";
      deadline.textContent = `Deadline: ${new Date(task.deadline).toLocaleString()}`;
      content.appendChild(deadline);
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete ${task.name}`);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(currentTask => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, content, deleteButton);
    taskList.appendChild(item);
  });

  const pending = dayTasks.filter(task => !task.completed).length;
  const completed = dayTasks.filter(task => task.completed).length;

  pendingCount.textContent = `${pending} pending`;
  completedCount.textContent = `${completed} completed`;
  emptyMessage.hidden = dayTasks.length > 0;
  updateTabs();
}

// task counter
taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = taskName.value.trim();
  if (!name) return;

  tasks.push({
    id: Date.now(),
    day: selectedDay,
    name: name,
    description: taskDescription.value.trim(),
    deadline: taskDeadline.value,
    completed: false
  });

  taskForm.reset();
  saveTasks();
  renderTasks();
  taskName.focus();
});

// random quote button
const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteButton = document.querySelector("#quote-button");
let lastQuoteIndex = -1;

function showRandomQuote() {
  let quoteIndex = Math.floor(Math.random() * quotes.length);

  while (quotes.length > 1 && quoteIndex === lastQuoteIndex) {
    quoteIndex = Math.floor(Math.random() * quotes.length);
  }

  lastQuoteIndex = quoteIndex;
  quoteText.textContent = quotes[quoteIndex].text;
  quoteAuthor.textContent = `— ${quotes[quoteIndex].author}`;
}

quoteButton.addEventListener("click", showRandomQuote);

// page setup
createDayTabs();
renderTasks();
showRandomQuote();