

const BASE_URL = "https://phi-lab-server.vercel.app/api/v1/lab";
const VALID_USER  = { username: "admin", password: "admin123" };
const signInPage = document.getElementById("signInPage");
const mainPage  = document.getElementById("mainPage");
const usernameInput = document.getElementById("usernameInput");
const passwordInput  = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");






document.getElementById("signInBtn").addEventListener("click", () => {
const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();
  if (u === VALID_USER.username && p === VALID_USER.password) {
  loginError.classList.add("hidden");
    signInPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
     loadAllIssues();
  } else {
    loginError.classList.remove("hidden");
  }
});
[usernameInput, passwordInput].forEach(el => {
  el.addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById("signInBtn").click();
  });
});



document.getElementById("signOutBtn").addEventListener("click", () => {
  mainPage.classList.add("hidden");
    signInPage.classList.remove("hidden");
  usernameInput.value = "";
    passwordInput.value = "";
  allIssues = [];
  currentTab = "all";
  searchQuery = "";
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.remove("active-tab");
    b.classList.add("inactive-tab");
  });
    document.querySelector('[data-tab="all"]').classList.add("active-tab");
  document.querySelector('[data-tab="all"]').classList.remove("inactive-tab");
    document.getElementById("searchInput").value = "";
});
      let allIssues = [];
       let currentTab = "all";
      let searchQuery = "";
      let searchTimer = null;







  const issuesGrid  = document.getElementById("issuesGrid");
  const issueCount = document.getElementById("issueCount");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");



                async function loadAllIssues() {
                  showLoading();
                    try {
                    const res = await fetch(`${BASE_URL}/issues`);
                    const data = await res.json();
                    allIssues = data.issues || data.data || data || [];
                  } catch (err) {
                    console.error("Failed to fetch issues:", err);
                    allIssues = [];
                  }
                      hideLoading();
                      renderIssues();
                }
  async function fetchSingleIssue(id) {
      try {
      const res = await fetch(`${BASE_URL}/issue/${id}`);
      const data = await res.json();
      return data.issue || data.data || data;
    } catch (err) {
      console.error("Failed to fetch issue:", err);
      return null;
    }
  }
      async function searchIssues(query) {
        showLoading();
          try {
          const res = await fetch(`${BASE_URL}/issues/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          allIssues = data.issues || data.data || data || [];
        } catch (err) {
          console.error("Search failed:", err);
          allIssues = [];
        }
          hideLoading();
          renderIssues();
      }







function getFilteredIssues() {
  if (currentTab  === "all") return allIssues;
  return allIssues.filter(issue => {
  const status  = (issue.status || issue.state || "").toLowerCase();
    return status ===  currentTab;
  });
}





function renderIssues() {
  const filtered = getFilteredIssues();
  issueCount.textContent = `${filtered.length} Issue${filtered.length !== 1 ? "s" : ""}`;
  issuesGrid.innerHTML = "";
  if (filtered.length ===  0) {
    emptyState.classList.remove("hidden");
    return;
  }
      emptyState.classList.add("hidden");
      filtered.forEach((issue, idx) => {
        const card   = document.createElement("div");
        const status = (issue.status || issue.state || "open").toLowerCase();
        card.className = `issue-card ${status}`;
        card.style.animationDelay = `${idx * 30}ms`;
        card.onclick = () => openDetailModal(issue);
        const priority  = (issue.priority || "LOW").toUpperCase();
        const priorityClass =
          priority === "HIGH" ? "priority-high" :
          priority === "MEDIUM" ? "priority-medium"   : "priority-low";




    const statusIcon = status === "open"
      ? `<svg class="icon-open" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
           <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
         </svg>`
      : `<svg class="icon-closed" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
         </svg>`;
    const labels   = issue.labels || issue.tags || [];
    const labelsHTML = labels.map(l => {
      const labelText = typeof l === "string" ? l : (l.name || "");
      const lower   = labelText.toLowerCase();
      const cls   = lower.includes("bug")  ? "label-bug"
                     : lower.includes("help")  ? "label-help"
                      : lower.includes("enhanc") ? "label-enhancement"
                   : "label-default";
      return `<span class="${cls}">${labelText.toUpperCase()}</span>`;
    }).join("");
    const dateStr     = issue.created_at || issue.createdAt || issue.date || "";
    const formattedDate = formatDate(dateStr);
   const author   = issue.author || issue.user?.login || issue.created_by || "unknown";
    const num       = issue.number || issue.id || idx + 1;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        ${statusIcon}
        <span class="${priorityClass}">${priority}</span>
      </div>
      <h3 class="font-bold text-gray-900 text-sm mb-2 leading-snug line-clamp-2">${issue.title || "Untitled"}</h3>
      <p class="text-gray-500 text-xs mb-3 line-clamp-2">${issue.description || issue.body || ""}</p>
      <div class="flex flex-wrap gap-1 mb-4">${labelsHTML}</div>
      <div class="border-t border-gray-100 pt-3 text-xs text-gray-500 space-y-0.5">
        <p>#${num} by <span class="font-medium text-gray-700">${author}</span></p>
        <p>${formattedDate}</p>
      </div>`;
    issuesGrid.appendChild(card);
  });
}




function formatDate(dateStr) {
      if (!dateStr) return "";
      try {
    const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}
async function openDetailModal(issue) {
 const modal = document.getElementById("issueDetailModal");
  populateModal(issue);
 modal.showModal();
  const id = issue.id || issue.number;
 if (id) {
  const full = await fetchSingleIssue(id);
    if (full) populateModal(full);
  }
}







function populateModal(issue) {
  const status  = (issue.status || issue.state || "open").toLowerCase();
   const priority = (issue.priority || "LOW").toUpperCase();
  const author = issue.author || issue.user?.login || issue.created_by || "unknown";
   const dateStr = issue.created_at || issue.createdAt || issue.date || "";
    const labels = issue.labels || issue.tags || [];


 document.getElementById("detailTitle").textContent    = issue.title || "Untitled";
   document.getElementById("detailAuthor").textContent     = author;
   document.getElementById("detailDate").textContent    = formatDate(dateStr);
     document.getElementById("detailDescription").textContent = issue.description || issue.body || "";
  document.getElementById("detailAssignee").textContent  = issue.assignee || issue.assigned_to || "Unassigned";




  const statusBadge     = document.getElementById("detailStatusBadge");
  statusBadge.textContent = status === "open" ? "Opened" : "Closed";
  statusBadge.className  = `status-badge px-3 py-1 rounded-full text-xs font-semibold ${status === "open" ? "badge-open" : "badge-closed"}`;


  const priorityBadge     = document.getElementById("detailPriority");
  priorityBadge.textContent = priority;
  priorityBadge.className  = `priority-badge px-3 py-1 rounded-full text-xs font-bold ${
    priority === "HIGH"  ? "priority-high"   :
    priority === "MEDIUM" ? "priority-medium"  : "priority-low"
  }`;
  document.getElementById("detailLabels").innerHTML = labels.map(l => {
    const labelText = typeof l === "string" ? l : (l.name || "");
     const lower  = labelText.toLowerCase();
    const cls      = lower.includes("bug")    ? "label-bug"
                  : lower.includes("help")   ? "label-help"
                    : lower.includes("enhanc") ? "label-enhancement"
                     : "label-default";
     return `<span class="${cls}">${labelText.toUpperCase()}</span>`;
  }).join("");
}





document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.classList.remove("active-tab");
      b.classList.add("inactive-tab");
    });
    btn.classList.add("active-tab");
    btn.classList.remove("inactive-tab");
    renderIssues();
  });
});


searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  clearTimeout(searchTimer);
  if (searchQuery.length === 0) {
    loadAllIssues();
    return;
  }
    searchTimer = setTimeout(() => {
    searchIssues(searchQuery);
  }, 400);
});




document.getElementById("newIssueBtn").addEventListener("click", () => {
  document.getElementById("newIssueModal").showModal();
});
document.getElementById("createIssueBtn").addEventListener("click", () => {
   const title     = document.getElementById("newTitle").value.trim();
    const description = document.getElementById("newDescription").value.trim();
   const priority   = document.getElementById("newPriority").value;
  const status   = document.getElementById("newStatus").value;
    const labelsRaw  = document.getElementById("newLabels").value;
  const assignee  = document.getElementById("newAssignee").value.trim();
  if (!title) { document.getElementById("newTitle").focus(); return; }
  const labels   = labelsRaw.split(",").map(l => l.trim()).filter(Boolean);
  const newIssue = {
    id: Date.now(),
    number: allIssues.length + 1,
    title, description, priority, status, labels,
    assignee: assignee || "Unassigned",
    author: VALID_USER.username,
    created_at: new Date().toISOString(),
  };



  
  allIssues.unshift(newIssue);
  renderIssues();

  ["newTitle", "newDescription", "newLabels", "newAssignee"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("newIssueModal").close();
});
 function showLoading() {
  loadingSpinner.classList.remove("hidden");
  issuesGrid.innerHTML = "";
  emptyState.classList.add("hidden");
}
function hideLoading() {
  loadingSpinner.classList.add("hidden");
}
