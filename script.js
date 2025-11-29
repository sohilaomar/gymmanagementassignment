// -------------------- STORAGE --------------------
const STORAGE_KEY = "clients";
let clients = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Seed pseudo-data with random training history if empty
if (clients.length === 0) {
  const trainingHistoryOptions = [
    "Cardio 20 min", "Squats", "Push-ups", "Plank 2 min", 
    "Lunges", "Deadlifts", "Bench Press", "Cycling", "Rowing"
  ];

  clients = [
    { name: "Sohila Omar", age: 23, gender: "Female", email: "sohila23@gmail.com", phone: "0102245670", goal: "Weight Loss", start: "2025-01-06" },
    { name: "Shahd Omar", age: 24, gender: "Female", email: "shahd@yahoo.com", phone: "0102345698", goal: "Muscle Gain", start: "2025-01-06" },
    { name: "Maya Elmalah", age: 20, gender: "Female", email: "mayaaa@gmail.com", phone: "0126729165", goal: "Personal", start: "2025-01-06" },
    { name: "Jana Refai", age: 26, gender: "Female", email: "janaa123@yahoo.com", phone: "0111267920", goal: "Muscle Gain", start: "2025-02-01" },
    { name: "Mayar Motreb", age: 29, gender: "Female", email: "mayar@yahoo.com", phone: "0108956213", goal: "Personal", start: "2025-02-02" }
  ];

  clients.forEach(c => {
    c.trainingHistory = Array.from({length:3}, () => trainingHistoryOptions[Math.floor(Math.random() * trainingHistoryOptions.length)]);
  });

  saveClients();
}

// Persist to localStorage
function saveClients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// -------------------- TOAST --------------------
function showToast(message = "Done") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2600);
}

// -------------------- DOCUMENT READY --------------------
document.addEventListener("DOMContentLoaded", () => {

  // --- ADD CLIENT ---
  const addForm = document.getElementById("addClientForm");
  if (addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (document.getElementById("name") || {}).value || "";
      const ageRaw = (document.getElementById("age") || {}).value;
      const age = ageRaw ? Number(ageRaw) : null;
      const gender = (document.getElementById("gender") || {}).value || "";
      const email = (document.getElementById("email") || {}).value || "";
      const phone = (document.getElementById("phone") || {}).value || "";
      const goal = (document.getElementById("goal") || {}).value || "";
      const start = (document.getElementById("start") || {}).value || "";

      if (!name || !age || !gender || !email || !phone || !goal || !start) {
        showToast("Please fill all fields correctly");
        return;
      }
      if (age < 16) {
        showToast("Client must be at least 16 years old");
        return;
      }

      const trainingHistoryOptions = [
        "Cardio 20 min", "Squats", "Push-ups", "Plank 2 min", 
        "Lunges", "Deadlifts", "Bench Press", "Cycling", "Rowing"
      ];

      const newClient = { 
        name, age, gender, email, phone, goal, start,
        trainingHistory: Array.from({length:3}, () => trainingHistoryOptions[Math.floor(Math.random()*trainingHistoryOptions.length)])
      };

      clients.push(newClient);
      saveClients();
      addForm.reset();
      showToast("Client added successfully");

      if (document.getElementById("memberList")) renderMemberList(clients);
      if (document.getElementById("statTotal")) renderStats();
    });
  }

  // --- VIEW PAGE: search, sort, initial render ---
  const memberListEl = document.getElementById("memberList");
  if (memberListEl) {
    const searchInput = document.getElementById("searchMember");
    const searchBtn = document.getElementById("searchBtn");
    const sortSelect = document.getElementById("sortMembers");

    function applySearchAndRender() {
      const q = (searchInput && searchInput.value || "").trim().toLowerCase();
      let filtered = clients.slice();
      if (q) {
        filtered = filtered.filter(c =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.phone || "").toLowerCase().includes(q)
        );
      }

      const s = (sortSelect && sortSelect.value) || "";
      if (s === "name") filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      else if (s === "age") filtered.sort((a, b) => (Number(a.age) || 0) - (Number(b.age) || 0));
      else if (s === "start") filtered.sort((a, b) => new Date(a.start) - new Date(b.start));

      renderMemberList(filtered);
    }

    if (searchBtn) searchBtn.addEventListener("click", applySearchAndRender);
    if (searchInput) searchInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") applySearchAndRender(); });
    if (sortSelect) sortSelect.addEventListener("change", applySearchAndRender);

    renderMemberList(clients);
  }

  // --- STATS ---
  if (document.getElementById("statTotal")) renderStats();
});

// -------------------- SAFE TEXT --------------------
function safeText(v) { return (v === undefined || v === null) ? "-" : String(v); }

// -------------------- RENDER MEMBER LIST --------------------
function renderMemberList(list) {
  const container = document.getElementById("memberList");
  if (!container) return;
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = `<div class="member-item">No members found.</div>`;
    return;
  }

  const exerciseOptions = [
    "Squats", "Push-ups", "Plank 2 min", "Lunges", 
    "Deadlifts", "Bench Press", "Cycling", "Rowing", "Burpees", "Mountain Climbers"
  ];

  list.forEach((c, idx) => {
    if (!c.trainingHistory) c.trainingHistory = ["Cardio 20 min", "Squats", "Push-ups"];

    const item = document.createElement("div");
    item.className = "member-item";

    // Details initially hidden
    item.innerHTML = `
      <div class="member-header" style="cursor:pointer;">
        <div>
          <div class="member-name">${safeText(c.name)}</div>
          <div style="font-size:13px;color:#555">${safeText(c.goal)} • ${safeText(c.email)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${safeText(c.age)}</div>
          <div style="font-size:13px;color:#666">${safeText(c.start)}</div>
        </div>
      </div>

      <div class="member-details" style="display:none;">
        <p><strong>Gender:</strong> ${safeText(c.gender)}</p>
        <p><strong>Phone:</strong> ${safeText(c.phone)}</p>
        <p><strong>Goal:</strong> ${safeText(c.goal)}</p>
        <p><strong>Membership Start:</strong> ${safeText(c.start)}</p>
        <p><strong>Training History:</strong> ${safeText(c.trainingHistory.join(", "))}</p>
        <p><strong>Next Session Exercises:</strong> <span class="next-exercises">Loading...</span></p>
        <div style="margin-top:10px;display:flex;gap:8px;">
          <button class="btn" onclick="editClient(${idx})">Edit</button>
          <button class="btn outline" onclick="deleteClient(${idx})">Delete</button>
        </div>
      </div>
    `;

    // Show/hide details on header click
    const header = item.querySelector(".member-header");
    const details = item.querySelector(".member-details");

    header.addEventListener("click", () => {
      const isVisible = details.style.display === "block";
      details.style.display = isVisible ? "none" : "block";

      if (!isVisible) {
        const span = details.querySelector(".next-exercises");
        const nextExercises = Array.from({ length: 5 }, () => exerciseOptions[Math.floor(Math.random() * exerciseOptions.length)]);
        span.textContent = nextExercises.join(", ");
      }
    });

    container.appendChild(item);
  });
}

// -------------------- EDIT / DELETE --------------------
function editClient(index) {
  const c = clients[index];
  if (!c) return showToast("Client not found");

  const newName = prompt("Edit full name:", c.name);
  if (newName === null) return;
  const newAgeRaw = prompt("Edit age (min 16):", c.age);
  if (newAgeRaw === null) return;
  const newAge = Number(newAgeRaw);
  if (isNaN(newAge) || newAge < 16) return showToast("Invalid age");

  const newEmail = prompt("Edit email:", c.email);
  if (newEmail === null) return;
  const newPhone = prompt("Edit phone:", c.phone);
  if (newPhone === null) return;
  const newGoal = prompt("Edit goal:", c.goal);
  if (newGoal === null) return;
  const newStart = prompt("Edit start date (YYYY-MM-DD):", c.start);
  if (newStart === null) return;

  clients[index] = {
    name: newName,
    age: newAge,
    gender: c.gender || "",
    email: newEmail,
    phone: newPhone,
    goal: newGoal,
    start: newStart,
    trainingHistory: c.trainingHistory || []
  };
  saveClients();
  renderMemberList(clients);
  renderStats();
  showToast("Client updated");
}

function deleteClient(index) {
  if (!confirm("Remove this client permanently?")) return;
  clients.splice(index, 1);
  saveClients();
  renderMemberList(clients);
  renderStats();
  showToast("Client removed");
}

// -------------------- STATS --------------------
function renderStats() {
  const totalEl = document.getElementById("statTotal");
  const avgEl = document.getElementById("statAvgAge");
  const newMonthEl = document.getElementById("statNewMonth");
  const goalsList = document.getElementById("goalsList");
  const contactsList = document.getElementById("contactsList");
  if (!totalEl) return;

  totalEl.textContent = clients.length;

  const ages = clients.map(c => Number(c.age) || 0).filter(a => a > 0);
  avgEl.textContent = ages.length ? (ages.reduce((s,v)=>s+v,0)/ages.length).toFixed(1) : "N/A";

  const now = new Date();
  const month = now.getMonth() + 1;
  const newThisMonth = clients.filter(c => {
    if (!c.start) return false;
    const parts = c.start.split("-");
    if (parts.length < 2) return false;
    return Number(parts[1]) === month;
  }).length;
  newMonthEl.textContent = newThisMonth;

  if (goalsList) {
    goalsList.innerHTML = "";
    const goalCounts = {};
    clients.forEach(c => { const g = c.goal || "Unknown"; goalCounts[g] = (goalCounts[g] || 0) + 1; });
    Object.entries(goalCounts).forEach(([g, count]) => {
      const li = document.createElement("li");
      li.style.listStyle = "none"; // remove bullet points
      li.textContent = `${g}: ${count}`;
      goalsList.appendChild(li);
    });
  }

  if (contactsList) {
    contactsList.innerHTML = "";
    clients.forEach(c => {
      const li = document.createElement("li");
      li.style.listStyle = "none"; // remove bullet points
      li.textContent = `${c.name} — ${c.phone || "-"}`;
      contactsList.appendChild(li);
    });
  }
}

// -------------------- DYNAMIC PERSONAL CLIENT VIEW --------------------
function showClientModal(index) {
  const c = clients[index];
  if (!c) return;

  const exerciseOptions = [
    "Squats", "Push-ups", "Plank 2 min", "Lunges", 
    "Deadlifts", "Bench Press", "Cycling", "Rowing", "Burpees", "Mountain Climbers"
  ];

  document.getElementById("modalName").textContent = c.name;
  document.getElementById("modalAge").textContent = c.age;
  document.getElementById("modalGender").textContent = c.gender;
  document.getElementById("modalEmail").textContent = c.email;
  document.getElementById("modalPhone").textContent = c.phone;
  document.getElementById("modalGoal").textContent = c.goal;
  document.getElementById("modalStart").textContent = c.start;
  document.getElementById("modalHistory").textContent = c.trainingHistory.join(", ");
  
  // Generate next exercises dynamically
  const nextExercises = Array.from({ length: 5 }, () => exerciseOptions[Math.floor(Math.random() * exerciseOptions.length)]);
  document.getElementById("modalNextExercises").textContent = nextExercises.join(", ");

  document.getElementById("clientModal").style.display = "flex";
}

// Close modal
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("clientModal").style.display = "none";
});

// Optional: close when clicking outside modal
window.addEventListener("click", (e) => {
  const modal = document.getElementById("clientModal");
  if (e.target === modal) modal.style.display = "none";
});

