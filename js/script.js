// =========================================
// SIDEBAR TOGGLE & MOBILE BACKDROP
// =========================================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

// Ensure sidebar overlay backdrop exists dynamically
let sidebarOverlay = document.getElementById("sidebarOverlay");
if (!sidebarOverlay && sidebar) {
    sidebarOverlay = document.createElement("div");
    sidebarOverlay.id = "sidebarOverlay";
    sidebarOverlay.className = "sidebar-overlay";
    document.body.appendChild(sidebarOverlay);
}

function isMobileView() {
    return window.matchMedia("(max-width: 786px)").matches;
}

function closeMobileSidebar() {
    if (sidebar) {
        sidebar.classList.remove("active");
    }
    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
    }
}

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = sidebar.classList.toggle("active");
        if (sidebarOverlay && isMobileView()) {
            sidebarOverlay.classList.toggle("active", isOpen);
        }
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
        closeMobileSidebar();
    });
}

const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (isMobileView()) {
            closeMobileSidebar();
        }
    });
});

// Close sidebar on click outside on mobile screens
document.addEventListener("click", (e) => {
    if (isMobileView() && sidebar && sidebar.classList.contains("active")) {
        if (!sidebar.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
            closeMobileSidebar();
        }
    }
});

// Hide overlay if window is resized above 786px
window.addEventListener("resize", () => {
    if (!isMobileView()) {
        if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    }
});


// =========================================
// TOAST NOTIFICATION UTILITY
// =========================================

function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icon = type === "success" ? "fa-circle-check" : type === "info" ? "fa-circle-info" : "fa-circle-exclamation";
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


// =========================================
// TOPBAR INTERACTIVE DROPDOWNS & SEARCH
// =========================================

const searchToggleBtn = document.getElementById("searchToggleBtn");
const searchModalOverlay = document.getElementById("searchModalOverlay");
const closeSearchModalBtn = document.getElementById("closeSearchModalBtn");
const globalSearchInput = document.getElementById("globalSearchInput");
const searchResultsArea = document.getElementById("searchResultsArea");

const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationDot = document.getElementById("notificationDot");
const markReadBtn = document.getElementById("markReadBtn");

const profileDropdownBtn = document.getElementById("profileDropdownBtn");
const profileDropdownMenu = document.getElementById("profileDropdownMenu");
const openProfileModalBtn = document.getElementById("openProfileModalBtn");
const profileSettingsModal = document.getElementById("profileSettingsModal");
const closeProfileModalBtn = document.getElementById("closeProfileModalBtn");
const cancelProfileModalBtn = document.getElementById("cancelProfileModalBtn");
const profileSettingsForm = document.getElementById("profileSettingsForm");
const logoutBtn = document.getElementById("logoutBtn");

// Notification Detail Modal Elements
const notificationDetailModal = document.getElementById("notificationDetailModal");
const closeNotifDetailModalBtn = document.getElementById("closeNotifDetailModalBtn");
const notifModalIcon = document.getElementById("notifModalIcon");
const notifModalTitle = document.getElementById("notifModalTitle");
const notifModalTime = document.getElementById("notifModalTime");
const notifModalMsg = document.getElementById("notifModalMsg");
const notifModalLinkBtn = document.getElementById("notifModalLinkBtn");

// Quick Search database entries
const searchableData = [
    { title: "Dashboard", category: "Navigation", link: "../index.html", icon: "fa-house" },
    { title: "General Ledger", category: "Navigation", link: "ledger.html", icon: "fa-book" },
    { title: "Accounts Receivable", category: "Navigation", link: "receivable.html", icon: "fa-arrow-down" },
    { title: "Accounts Payable", category: "Navigation", link: "payable.html", icon: "fa-arrow-up" },
    { title: "Cash Book", category: "Navigation", link: "cashbook.html", icon: "fa-cash-register" },
    { title: "Invoices", category: "Navigation", link: "invoices.html", icon: "fa-file-invoice" },
    { title: "Customers", category: "Navigation", link: "customers.html", icon: "fa-users" },
    { title: "Suppliers", category: "Navigation", link: "suppliers.html", icon: "fa-truck" },
    { title: "Income & Expense", category: "Navigation", link: "income-expense.html", icon: "fa-chart-line" },
    { title: "Reports", category: "Navigation", link: "reports.html", icon: "fa-chart-column" },
    { title: "Ahmed Traders (Client)", category: "Customer", link: "customers.html", icon: "fa-user" },
    { title: "Al-Noor Suppliers (Vendor)", category: "Supplier", link: "suppliers.html", icon: "fa-building" },
    { title: "Invoice #INV-1025", category: "Invoice", link: "invoices.html", icon: "fa-file-invoice-dollar" }
];

// Toggle Notifications Dropdown
if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (profileDropdownMenu) profileDropdownMenu.classList.remove("active");
        notificationDropdown.classList.toggle("active");
    });
}

// Mark all notifications read
if (markReadBtn) {
    markReadBtn.addEventListener("click", () => {
        if (notificationDot) notificationDot.style.display = "none";
        document.querySelectorAll(".notification-item").forEach(item => item.classList.add("read"));
        showToast("All notifications marked as read.", "info");
    });
}

// Click individual Notification Item -> Open Detail Modal
const notificationItems = document.querySelectorAll(".notification-item");

notificationItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.stopPropagation();

        item.classList.add("read");
        if (notificationDropdown) notificationDropdown.classList.remove("active");

        const title = item.dataset.title || item.querySelector("strong")?.textContent || "Notification Alert";
        const msg = item.dataset.msg || item.querySelector("p")?.textContent || "";
        const time = item.dataset.time || item.querySelector("span")?.textContent || "";
        const type = item.dataset.type || "info";
        const rawLink = item.dataset.link || "invoices.html";

        const isSubpage = window.location.pathname.includes("/pages/");
        let finalLink = rawLink;
        if (isSubpage) {
            finalLink = rawLink.startsWith("pages/") ? rawLink.replace("pages/", "") : rawLink;
        } else {
            finalLink = rawLink.startsWith("pages/") ? rawLink : "pages/" + rawLink;
        }

        if (notifModalTitle) notifModalTitle.textContent = title;
        if (notifModalTime) notifModalTime.textContent = time;
        if (notifModalMsg) notifModalMsg.textContent = msg;

        if (notifModalIcon) {
            const iconEl = item.querySelector(".notification-icon i")?.cloneNode(true) || document.createElement("i");
            notifModalIcon.className = `notification-icon ${type}`;
            notifModalIcon.innerHTML = "";
            notifModalIcon.appendChild(iconEl);
        }

        if (notifModalLinkBtn) {
            notifModalLinkBtn.href = finalLink;
        }

        if (notificationDetailModal) {
            notificationDetailModal.classList.add("active");
        }

        const unreadItems = document.querySelectorAll(".notification-item:not(.read)");
        if (unreadItems.length === 0 && notificationDot) {
            notificationDot.style.display = "none";
        }
    });
});

function closeNotifDetailModal() {
    if (notificationDetailModal) {
        notificationDetailModal.classList.remove("active");
    }
}

if (closeNotifDetailModalBtn) closeNotifDetailModalBtn.addEventListener("click", closeNotifDetailModal);

if (notificationDetailModal) {
    notificationDetailModal.addEventListener("click", (e) => {
        if (e.target === notificationDetailModal) closeNotifDetailModal();
    });
}

// Toggle Profile Menu Dropdown
if (profileDropdownBtn && profileDropdownMenu) {
    profileDropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (notificationDropdown) notificationDropdown.classList.remove("active");
        profileDropdownMenu.classList.toggle("active");
    });
}

// Open Search Modal
function openSearchModal() {
    if (searchModalOverlay) {
        if (notificationDropdown) notificationDropdown.classList.remove("active");
        if (profileDropdownMenu) profileDropdownMenu.classList.remove("active");
        searchModalOverlay.classList.add("active");
        setTimeout(() => globalSearchInput && globalSearchInput.focus(), 100);
        renderSearchResults("");
    }
}

function closeSearchModal() {
    if (searchModalOverlay) {
        searchModalOverlay.classList.remove("active");
    }
}

if (searchToggleBtn) searchToggleBtn.addEventListener("click", openSearchModal);
if (closeSearchModalBtn) closeSearchModalBtn.addEventListener("click", closeSearchModal);

if (searchModalOverlay) {
    searchModalOverlay.addEventListener("click", (e) => {
        if (e.target === searchModalOverlay) closeSearchModal();
    });
}

// Global Keyboard Shortcut (Ctrl+K or Cmd+K)
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearchModal();
    } else if (e.key === "Escape") {
        closeSearchModal();
        closeProfileModal();
        closeNotifDetailModal();
    }
});

// Live Search Input Filtering
if (globalSearchInput && searchResultsArea) {
    globalSearchInput.addEventListener("input", (e) => {
        renderSearchResults(e.target.value.trim().toLowerCase());
    });
}

function renderSearchResults(query) {
    if (!searchResultsArea) return;

    const filtered = query === "" 
        ? searchableData.slice(0, 6)
        : searchableData.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));

    if (filtered.length === 0) {
        searchResultsArea.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-medium); font-size: 13px;">No results found for "${query}"</div>`;
        return;
    }

    const isSubpage = window.location.pathname.includes("/pages/");

    let html = `<div class="search-group-title">${query === "" ? "Quick Access Links" : "Matching Results"}</div>`;
    filtered.forEach(item => {
        let finalLink = item.link;
        if (isSubpage) {
            finalLink = item.link.startsWith("pages/") ? item.link.replace("pages/", "") : item.link;
        } else {
            finalLink = item.link.startsWith("pages/") || item.link === "index.html" ? item.link : "pages/" + item.link;
        }

        html += `
            <a href="${finalLink}" class="search-result-item">
                <div>
                    <i class="fas ${item.icon}" style="margin-right: 8px; color: var(--primary);"></i>
                    <strong>${item.title}</strong>
                </div>
                <span>${item.category}</span>
            </a>
        `;
    });

    searchResultsArea.innerHTML = html;
}

// Close Dropdowns on Click Outside
document.addEventListener("click", () => {
    if (notificationDropdown) notificationDropdown.classList.remove("active");
    if (profileDropdownMenu) profileDropdownMenu.classList.remove("active");
});


// =========================================
// ADMIN PROFILE PERSISTENCE (LOCALSTORAGE)
// =========================================

function loadSavedProfile() {
    let saved = localStorage.getItem("accountexProfile");
    if (!saved) {
        const defaultProfile = { name: "Muhammad Rehan", email: "rehan@accountex.com", phone: "+92 300 9876543" };
        localStorage.setItem("accountexProfile", JSON.stringify(defaultProfile));
        saved = JSON.stringify(defaultProfile);
    }
    try {
        const data = JSON.parse(saved);
        if (data.name) {
            document.querySelectorAll("#adminUserNameDisplay, #adminMenuName, .profile-info strong, .sidebar-user strong").forEach(el => {
                el.textContent = data.name;
            });
            const initials = data.name.split(" ").map(n => n[0]).filter(Boolean).join("").toUpperCase().substring(0, 2);
            document.querySelectorAll(".profile-avatar, .user-avatar").forEach(el => {
                el.textContent = initials || "MR";
            });
            const nameInput = document.getElementById("adminNameInput");
            if (nameInput) nameInput.value = data.name;
        }
        if (data.email) {
            const emailSpan = document.querySelector(".profile-dropdown-header span");
            if (emailSpan) emailSpan.textContent = data.email;
            const emailInput = document.getElementById("adminEmailInput");
            if (emailInput) emailInput.value = data.email;
        }
        if (data.phone) {
            const phoneInput = document.getElementById("adminPhoneInput");
            if (phoneInput) phoneInput.value = data.phone;
        }
    } catch (e) {
        console.error("Error loading saved profile", e);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSavedProfile);
} else {
    loadSavedProfile();
}

// =========================================
// THEME SWITCHER (LIGHT / DARK MODE)
// =========================================

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        document.documentElement.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
        document.documentElement.classList.remove("dark-mode");
    }

    const lightBtn = document.getElementById("lightThemeBtn");
    const darkBtn = document.getElementById("darkThemeBtn");

    if (lightBtn && darkBtn) {
        if (theme === "dark") {
            darkBtn.classList.add("active");
            lightBtn.classList.remove("active");
        } else {
            lightBtn.classList.add("active");
            darkBtn.classList.remove("active");
        }
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("accountexTheme") || "light";
    applyTheme(savedTheme);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}

function openProfileModal() {
    if (profileSettingsModal) {
        if (profileDropdownMenu) profileDropdownMenu.classList.remove("active");
        loadSavedProfile();
        initTheme();
        profileSettingsModal.classList.add("active");
    }
}

function closeProfileModal() {
    if (profileSettingsModal) {
        profileSettingsModal.classList.remove("active");
    }
}

if (openProfileModalBtn) openProfileModalBtn.addEventListener("click", openProfileModal);
if (closeProfileModalBtn) closeProfileModalBtn.addEventListener("click", closeProfileModal);
if (cancelProfileModalBtn) cancelProfileModalBtn.addEventListener("click", closeProfileModal);

if (profileSettingsModal) {
    profileSettingsModal.addEventListener("click", (e) => {
        if (e.target === profileSettingsModal) closeProfileModal();
    });
}

// =========================================
// DYNAMIC ACTIVITY LOGGING SYSTEM (PER USER ID)
// =========================================

function getActiveUserName() {
    try {
        const saved = localStorage.getItem("accountexProfile");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.name) return data.name;
        }
    } catch (e) {}
    return "Muhammad Rehan";
}

function getDefaultActivities(userName) {
    return [
        {
            type: "success",
            icon: "fa-circle-check",
            title: "Payment Received Confirmation",
            desc: `${userName} recorded payment of Rs. 45,000 received from Ahmed Traders for Invoice #INV-1025.`,
            time: "Today, 2:30 PM"
        },
        {
            type: "info",
            icon: "fa-user-gear",
            title: "Profile Settings Updated",
            desc: `User ID "${userName}" updated account profile details.`,
            time: "Today, 11:15 AM"
        },
        {
            type: "warning",
            icon: "fa-file-invoice",
            title: "Vendor Bill Recorded",
            desc: `${userName} entered purchase bill #BILL-784 for Rs. 18,500 from Al-Noor Suppliers.`,
            time: "Yesterday, 5:40 PM"
        },
        {
            type: "info",
            icon: "fa-sliders",
            title: "Theme Preference Updated",
            desc: `${userName} updated system UI theme preferences.`,
            time: "Yesterday, 3:20 PM"
        },
        {
            type: "primary",
            icon: "fa-print",
            title: "Report Exported",
            desc: `${userName} generated and exported Executive Financial Summary Report.`,
            time: "16 Aug 2026, 10:00 AM"
        }
    ];
}

function renderActivityLogs() {
    const timeline = document.getElementById("activityTimeline");
    if (!timeline) return;

    const userName = getActiveUserName();
    let activities = [];

    try {
        const saved = localStorage.getItem("accountexActivities");
        if (saved) {
            activities = JSON.parse(saved);
        } else {
            activities = getDefaultActivities(userName);
        }
    } catch (e) {
        activities = getDefaultActivities(userName);
    }

    if (!activities || activities.length === 0) {
        timeline.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-medium); font-size: 13px;">No activity logs recorded for active user <strong>${userName}</strong>.</div>`;
        return;
    }

    let html = "";
    activities.forEach(item => {
        html += `
        <div class="activity-item">
            <div class="activity-icon ${item.type}"><i class="fas ${item.icon}"></i></div>
            <div class="activity-details">
                <strong>${item.title}</strong>
                <p>${item.desc}</p>
                <span>${item.time}</span>
            </div>
        </div>
        `;
    });

    timeline.innerHTML = html;
}

function addActivityLog(title, desc, type = "info", icon = "fa-circle-info") {
    const userName = getActiveUserName();
    const newActivity = {
        type: type,
        icon: icon,
        title: title,
        desc: `${userName}: ${desc}`,
        time: "Just now"
    };

    let activities = [];
    try {
        const saved = localStorage.getItem("accountexActivities");
        if (saved) {
            activities = JSON.parse(saved);
        } else {
            activities = getDefaultActivities(userName);
        }
    } catch (e) {
        activities = getDefaultActivities(userName);
    }

    activities.unshift(newActivity);
    localStorage.setItem("accountexActivities", JSON.stringify(activities));
    renderActivityLogs();
}

function openActivityModal() {
    if (profileDropdownMenu) profileDropdownMenu.classList.remove("active");
    renderActivityLogs();
    const modal = document.getElementById("activityLogModal");
    if (modal) {
        modal.classList.add("active");
    }
}

function closeActivityModal() {
    const modal = document.getElementById("activityLogModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

// Global Delegated Listener for Theme Switch, Activity Log & Settings Triggers
document.addEventListener("click", (e) => {
    const lightBtn = e.target.closest("#lightThemeBtn");
    if (lightBtn) {
        localStorage.setItem("accountexTheme", "light");
        applyTheme("light");
        addActivityLog("Theme Changed", "Switched interface mode to Light Mode.", "info", "fa-sun");
        showToast("Switched to Light Mode", "info");
        return;
    }

    const darkBtn = e.target.closest("#darkThemeBtn");
    if (darkBtn) {
        localStorage.setItem("accountexTheme", "dark");
        applyTheme("dark");
        addActivityLog("Theme Changed", "Switched interface mode to Dark Mode.", "info", "fa-moon");
        showToast("Switched to Dark Mode", "info");
        return;
    }

    const activityBtn = e.target.closest("#openActivityBtn");
    if (activityBtn) {
        e.preventDefault();
        openActivityModal();
        return;
    }

    const closeActBtn = e.target.closest("#closeActivityModalBtn, #closeActivityModalFooterBtn");
    if (closeActBtn) {
        closeActivityModal();
        return;
    }

    const clearActBtn = e.target.closest("#clearActivityLogBtn");
    if (clearActBtn) {
        localStorage.setItem("accountexActivities", JSON.stringify([]));
        renderActivityLogs();
        showToast("Activity log cleared", "info");
        return;
    }

    const settingsBtn = e.target.closest("#openSettingsBtn, .sidebar-bottom a");
    if (settingsBtn && settingsBtn.textContent.includes("Settings")) {
        e.preventDefault();
        openProfileModal();
        return;
    }

    const actModal = document.getElementById("activityLogModal");
    if (actModal && e.target === actModal) {
        closeActivityModal();
    }
});

if (profileSettingsForm) {
    profileSettingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newName = document.getElementById("adminNameInput")?.value.trim() || "";
        const newEmail = document.getElementById("adminEmailInput")?.value.trim() || "";
        const newPhone = document.getElementById("adminPhoneInput")?.value.trim() || "";

        if (newName) {
            const profileObj = { name: newName, email: newEmail, phone: newPhone };
            localStorage.setItem("accountexProfile", JSON.stringify(profileObj));

            loadSavedProfile();
            addActivityLog("Profile Details Updated", `Updated account details for user ID "${newName}".`, "info", "fa-user-gear");
            closeProfileModal();
            showToast("System & profile settings saved!", "success");
        }
    });
}

// Logout Action
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (profileDropdownMenu) profileDropdownMenu.classList.remove("active");
        showToast("Logged out successfully. Redirecting...", "info");
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    });
}


// =========================================
// FINANCIAL ANALYSIS CHART (CHART.JS)
// =========================================

const chartCanvas = document.getElementById("financialChart");
const chartFilter = document.getElementById("chartFilter");

if (chartCanvas && typeof Chart !== "undefined") {
    const ctx = chartCanvas.getContext("2d");

    const incomeGradient = ctx.createLinearGradient(0, 0, 0, 300);
    incomeGradient.addColorStop(0, "rgba(22, 163, 74, 0.25)");
    incomeGradient.addColorStop(1, "rgba(22, 163, 74, 0.0)");

    const expenseGradient = ctx.createLinearGradient(0, 0, 0, 300);
    expenseGradient.addColorStop(0, "rgba(220, 38, 38, 0.25)");
    expenseGradient.addColorStop(1, "rgba(220, 38, 38, 0.0)");

    const chartDataMap = {
        monthly: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            income: [240000, 280000, 310000, 290000, 350000, 380000, 340000, 325800, 360000, 390000, 410000, 450000],
            expense: [120000, 140000, 160000, 135000, 170000, 180000, 150000, 148650, 165000, 175000, 190000, 210000]
        },
        weekly: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            income: [78000, 85000, 80800, 82000],
            expense: [35000, 38000, 36650, 39000]
        },
        yearly: {
            labels: ["2022", "2023", "2024", "2025", "2026"],
            income: [2800000, 3400000, 4100000, 4800000, 5200000],
            expense: [1500000, 1800000, 2100000, 2400000, 2600000]
        }
    };

    let activeFilter = "monthly";

    const financialChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartDataMap[activeFilter].labels,
            datasets: [
                {
                    label: "Income (Rs.)",
                    data: chartDataMap[activeFilter].income,
                    borderColor: "#16a34a",
                    backgroundColor: incomeGradient,
                    fill: true,
                    tension: 0.35,
                    borderWidth: 3,
                    pointBackgroundColor: "#16a34a",
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: "Expenses (Rs.)",
                    data: chartDataMap[activeFilter].expense,
                    borderColor: "#dc2626",
                    backgroundColor: expenseGradient,
                    fill: true,
                    tension: 0.35,
                    borderWidth: 3,
                    pointBackgroundColor: "#dc2626",
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        usePointStyle: true,
                        font: { family: "Inter", size: 12, weight: "600" }
                    }
                },
                tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            return `${context.dataset.label}: Rs. ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: "Inter", size: 11 } }
                },
                y: {
                    grid: { color: "#e5e7eb" },
                    ticks: {
                        font: { family: "Inter", size: 11 },
                        callback: function (value) {
                            return "Rs. " + (value >= 1000000 ? (value / 1000000).toFixed(1) + "M" : (value / 1000).toFixed(0) + "k");
                        }
                    }
                }
            }
        }
    });

    if (chartFilter) {
        chartFilter.addEventListener("change", (e) => {
            const selected = e.target.value;
            if (chartDataMap[selected]) {
                financialChart.data.labels = chartDataMap[selected].labels;
                financialChart.data.datasets[0].data = chartDataMap[selected].income;
                financialChart.data.datasets[1].data = chartDataMap[selected].expense;
                financialChart.update();
            }
        });
    }
}


// =========================================
// LOCALSTORAGE PERSISTENCE LAYER
// =========================================

const LOCAL_STORAGE_KEY = "accountex_custom_records";

function getSavedRecords() {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Error reading localStorage", e);
        return [];
    }
}

function saveRecord(record) {
    const records = getSavedRecords();
    records.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
}

function getPageContext(thList) {
    if (!thList || thList.length === 0) return "dashboard";
    const joinStr = thList.join(" | ");

    if (joinStr.includes("outstanding balance") || joinStr.includes("aging status")) return "receivables";
    if (thList[0].includes("invoice") || joinStr.includes("issue date")) return "invoices";
    if (joinStr.includes("bill #") || joinStr.includes("amount due")) return "payables";
    if (joinStr.includes("cash in") || joinStr.includes("cash out")) return "cashbook";
    if (joinStr.includes("debit") || joinStr.includes("credit") || joinStr.includes("account title")) return "ledger";
    if (joinStr.includes("customer / business") || joinStr.includes("total invoiced")) return "customers";
    if (joinStr.includes("total purchases") || joinStr.includes("pending payable")) return "suppliers";
    if (joinStr.includes("payment method")) return "income-expense";
    return "dashboard";
}

function renderRecordRow(record, tbody, pageContext) {
    const { party, type, category, amount, dateRaw, status, ref } = record;
    const dateObj = new Date(dateRaw || Date.now());
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    const dueDateObj = new Date(dateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formattedDueDate = dueDateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const email = (party || "Client").toLowerCase().replace(/[^a-z0-9]/g, "") + "@domain.com";
    const isIncome = type === "income";
    const numAmount = parseFloat(amount) || 0;

    const tr = document.createElement("tr");
    tr.setAttribute("data-saved-id", record.id || "");

    if (pageContext === "receivables") {
        // Customer | Invoice # | Due Date | Original Amount | Outstanding Balance | Aging Status
        const balanceDue = status === "paid" ? 0 : numAmount;
        tr.innerHTML = `
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas fa-user"></i></div>
                    <div><strong>${party}</strong><span>${email}</span></div>
                </div>
            </td>
            <td>${ref}</td>
            <td>${formattedDueDate}</td>
            <td>Rs. ${numAmount.toLocaleString()}</td>
            <td class="${status === "paid" ? "amount received" : "amount spent"}">Rs. ${balanceDue.toLocaleString()}</td>
            <td><span class="status ${status === "paid" ? "paid" : "pending"}">${status === "paid" ? "Current" : "Pending"}</span></td>
        `;
    } else if (pageContext === "invoices") {
        // Invoice # | Client / Customer | Issue Date | Due Date | Total Amount | Status
        tr.innerHTML = `
            <td><strong>${ref}</strong></td>
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas fa-user"></i></div>
                    <div><strong>${party}</strong><span>${email}</span></div>
                </div>
            </td>
            <td>${formattedDate}</td>
            <td>${formattedDueDate}</td>
            <td class="amount received">Rs. ${numAmount.toLocaleString()}</td>
            <td><span class="status ${status === "paid" ? "paid" : "pending"}">${status === "paid" ? "Paid" : "Pending"}</span></td>
        `;
    } else if (pageContext === "payables") {
        // Supplier / Vendor | Bill # | Due Date | Total Amount | Amount Due | Status
        const amountDue = status === "paid" ? 0 : numAmount;
        tr.innerHTML = `
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas fa-building"></i></div>
                    <div><strong>${party}</strong><span>${email}</span></div>
                </div>
            </td>
            <td>${ref}</td>
            <td>${formattedDueDate}</td>
            <td>Rs. ${numAmount.toLocaleString()}</td>
            <td class="${status === "paid" ? "amount received" : "amount spent"}">Rs. ${amountDue.toLocaleString()}</td>
            <td><span class="status ${status === "paid" ? "paid" : "pending"}">${status === "paid" ? "Paid" : "Pending"}</span></td>
        `;
    } else if (pageContext === "cashbook") {
        // Date | Particulars / Description | Category | Cash In (Rs.) | Cash Out (Rs.) | Running Balance (Rs.)
        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas fa-cash-register"></i></div>
                    <div><strong>${party}</strong><span>${ref}</span></div>
                </div>
            </td>
            <td><span class="category">${category || "Sales"}</span></td>
            <td class="amount received">${isIncome ? "+ Rs. " + numAmount.toLocaleString() : "-"}</td>
            <td class="amount spent">${!isIncome ? "- Rs. " + numAmount.toLocaleString() : "-"}</td>
            <td><strong>Rs. ${numAmount.toLocaleString()}</strong></td>
        `;
    } else if (pageContext === "ledger") {
        // Date | Account Title / Description | Voucher # | Debit (Rs.) | Credit (Rs.) | Running Balance (Rs.)
        tr.innerHTML = `
            <td>${formattedDate}</td>
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas fa-book"></i></div>
                    <div><strong>${party}</strong><span>${category || "General"}</span></div>
                </div>
            </td>
            <td>${ref}</td>
            <td class="amount spent">${!isIncome ? "Rs. " + numAmount.toLocaleString() : "-"}</td>
            <td class="amount received">${isIncome ? "Rs. " + numAmount.toLocaleString() : "-"}</td>
            <td><strong>Rs. ${numAmount.toLocaleString()}</strong></td>
        `;
    } else if (pageContext === "customers") {
        // Customer / Business | Contact Email | Phone | Total Invoiced | Current Balance | Status
        tr.innerHTML = `
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas fa-user"></i></div>
                    <div><strong>${party}</strong><span>CUST-${Math.floor(100+Math.random()*900)}</span></div>
                </div>
            </td>
            <td>${email}</td>
            <td>+92 300 1234567</td>
            <td class="amount received">Rs. ${numAmount.toLocaleString()}</td>
            <td class="amount spent">Rs. 0</td>
            <td><span class="status paid">Active</span></td>
        `;
    } else if (pageContext === "suppliers") {
        // Supplier / Vendor | Category | Contact Email | Total Purchases | Pending Payable | Status
        tr.innerHTML = `
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas fa-building"></i></div>
                    <div><strong>${party}</strong><span>SUP-${Math.floor(100+Math.random()*900)}</span></div>
                </div>
            </td>
            <td><span class="category">${category || "General"}</span></td>
            <td>${email}</td>
            <td>Rs. ${numAmount.toLocaleString()}</td>
            <td class="amount spent">Rs. 0</td>
            <td><span class="status paid">Active</span></td>
        `;
    } else {
        // Default Dashboard: Transaction Name | Date | Category | Amount | Status
        const iconClass = isIncome ? "fa-user" : "fa-building";
        const amountClass = isIncome ? "amount received" : "amount spent";
        const amountPrefix = isIncome ? "+ " : "- ";
        const statusClass = status === "paid" ? "status paid" : "status pending";
        const statusText = status === "paid" ? "Paid" : "Pending";

        tr.innerHTML = `
            <td>
                <div class="transaction-name">
                    <div class="transaction-avatar"><i class="fas ${iconClass}"></i></div>
                    <div><strong>${party}</strong><span>${ref}</span></div>
                </div>
            </td>
            <td>${formattedDate}</td>
            <td><span class="category">${category || "General"}</span></td>
            <td class="${amountClass}">${amountPrefix}Rs. ${numAmount.toLocaleString()}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        `;
    }

    tbody.insertBefore(tr, tbody.firstChild);
}

function loadSavedRecords() {
    const table = document.querySelector(".transactions-table");
    const tbody = table ? table.querySelector("tbody") : null;
    if (!table || !tbody) return;

    const thList = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim().toLowerCase());
    const pageContext = getPageContext(thList);

    const saved = getSavedRecords();
    saved.slice().reverse().forEach(record => {
        renderRecordRow(record, tbody, pageContext);
    });
}

// Run loadSavedRecords on DOM ready
document.addEventListener("DOMContentLoaded", loadSavedRecords);
// Fallback immediate execution in case DOMContentLoaded fired
if (document.readyState === "complete" || document.readyState === "interactive") {
    loadSavedRecords();
}


// =========================================
// ADD TRANSACTION MODAL & FORM HANDLING
// =========================================

const addTransactionBtn = document.getElementById("addTransactionBtn");
const addTransactionModal = document.getElementById("addTransactionModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const addTransactionForm = document.getElementById("addTransactionForm");

function openModal() {
    if (addTransactionModal) {
        addTransactionModal.classList.add("active");
        const dateInput = document.getElementById("transDate");
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split("T")[0];
            dateInput.value = today;
        }
    }
}

function closeModal() {
    if (addTransactionModal) {
        addTransactionModal.classList.remove("active");
    }
}

if (addTransactionBtn) addTransactionBtn.addEventListener("click", openModal);
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);

if (addTransactionModal) {
    addTransactionModal.addEventListener("click", (e) => {
        if (e.target === addTransactionModal) closeModal();
    });
}

if (addTransactionForm) {
    addTransactionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const party = document.getElementById("transParty").value.trim();
        const type = document.getElementById("transType").value;
        const category = document.getElementById("transCategory").value;
        const amount = parseFloat(document.getElementById("transAmount").value);
        const dateRaw = document.getElementById("transDate").value;
        const status = document.getElementById("transStatus").value;
        const ref = document.getElementById("transRef").value.trim() || "INV-" + Math.floor(1000 + Math.random() * 9000);

        if (!party || isNaN(amount)) return;

        const newRecord = {
            id: Date.now().toString(),
            party,
            type,
            category,
            amount,
            dateRaw,
            status,
            ref
        };

        // Save to LocalStorage
        saveRecord(newRecord);

        // Render immediately to table
        const table = document.querySelector(".transactions-table");
        const tbody = table ? table.querySelector("tbody") : null;
        if (table && tbody) {
            const thList = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim().toLowerCase());
            const pageContext = getPageContext(thList);
            renderRecordRow(newRecord, tbody, pageContext);
        }

        closeModal();
        addTransactionForm.reset();
        showToast(`Record for "${party}" saved successfully!`, "success");
    });
}