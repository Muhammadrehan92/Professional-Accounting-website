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
    const modal = document.getElementById("searchModalOverlay");
    const notifDrop = document.getElementById("notificationDropdown");
    const profMenu = document.getElementById("profileDropdownMenu");
    const input = document.getElementById("globalSearchInput");

    if (notifDrop) notifDrop.classList.remove("active");
    if (profMenu) profMenu.classList.remove("active");

    if (modal) {
        modal.classList.add("active");
        setTimeout(() => input && input.focus(), 100);
        renderSearchResults("");
    }
}

function closeSearchModal() {
    const modal = document.getElementById("searchModalOverlay");
    if (modal) {
        modal.classList.remove("active");
    }
}

document.addEventListener("click", (e) => {
    const srchBtn = e.target.closest("#searchToggleBtn, .search-toggle-btn");
    if (srchBtn) {
        e.preventDefault();
        openSearchModal();
        return;
    }
    const closeSrch = e.target.closest("#closeSearchModalBtn");
    if (closeSrch) {
        e.preventDefault();
        closeSearchModal();
        return;
    }
    const modal = document.getElementById("searchModalOverlay");
    if (modal && e.target === modal) {
        closeSearchModal();
    }
});

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

// Delegated Handler for Dropdowns, Options & Modals
document.addEventListener("click", (e) => {
    const profBtn = e.target.closest("#profileDropdownBtn, .topbar-profile");
    if (profBtn) {
        e.stopPropagation();
        const notifDrop = document.getElementById("notificationDropdown");
        const profMenu = document.getElementById("profileDropdownMenu");
        if (notifDrop) notifDrop.classList.remove("active");
        if (profMenu) profMenu.classList.toggle("active");
        return;
    }

    const notifBtn = e.target.closest("#notificationBtn, .notification-btn");
    if (notifBtn) {
        e.stopPropagation();
        const notifDrop = document.getElementById("notificationDropdown");
        const profMenu = document.getElementById("profileDropdownMenu");
        if (profMenu) profMenu.classList.remove("active");
        if (notifDrop) notifDrop.classList.toggle("active");
        return;
    }

    const openProfSettings = e.target.closest("#openProfileModalBtn");
    if (openProfSettings) {
        e.preventDefault();
        openProfileModal();
        return;
    }

    const openAct = e.target.closest("#openActivityBtn");
    if (openAct) {
        e.preventDefault();
        openActivityModal();
        return;
    }

    const addBtn = e.target.closest("#addTransactionBtn, .add-transaction-btn");
    if (addBtn) {
        e.preventDefault();
        openModal();
        return;
    }

    const srchBtn = e.target.closest("#searchToggleBtn");
    if (srchBtn) {
        e.preventDefault();
        openSearchModal();
        return;
    }

    // Close dropdowns if clicked outside
    const notifDrop = document.getElementById("notificationDropdown");
    const profMenu = document.getElementById("profileDropdownMenu");
    if (notifDrop && !e.target.closest("#notificationDropdown") && !e.target.closest("#notificationBtn")) {
        notifDrop.classList.remove("active");
    }
    if (profMenu && !e.target.closest("#profileDropdownMenu") && !e.target.closest("#profileDropdownBtn")) {
        profMenu.classList.remove("active");
    }
});


// =========================================
// ADMIN PROFILE & SYSTEM AUTHENTICATION (LOCALSTORAGE)
// =========================================

// =========================================
// MULTI-USER SYSTEM & DATA ISOLATION LAYER
// =========================================

function getUsersDB() {
    try {
        const stored = localStorage.getItem("accountexUsersDB");
        if (stored) return JSON.parse(stored);
    } catch (e) {}

    const defaultDB = {
        "muhammad rehan": { name: "Muhammad Rehan", email: "rehan@accountex.com", phone: "+92 300 9876543", password: "admin123" },
        "admin user": { name: "Admin User", email: "admin@accountex.com", phone: "+92 300 1234567", password: "admin123" },
        "admin": { name: "Admin User", email: "admin@accountex.com", phone: "+92 300 1234567", password: "admin123" }
    };
    localStorage.setItem("accountexUsersDB", JSON.stringify(defaultDB));
    return defaultDB;
}

function saveUserToDB(name, password, email = "", phone = "") {
    const db = getUsersDB();
    const cleanName = name.trim();
    const key = cleanName.toLowerCase();
    const existing = db[key] || {};
    const userObj = {
        name: cleanName,
        email: email || existing.email || `${key.replace(/[^a-z0-9]/g, "")}@accountex.com`,
        phone: phone || existing.phone || "+92 300 9876543",
        password: password || existing.password || "admin123"
    };

    db[key] = userObj;
    localStorage.setItem("accountexUsersDB", JSON.stringify(db));
    localStorage.setItem("accountexLoggedInUser", cleanName);
    localStorage.setItem("accountexProfile", JSON.stringify(userObj));
    return userObj;
}

function getActiveUserName() {
    try {
        const loggedIn = localStorage.getItem("accountexLoggedInUser");
        if (loggedIn && loggedIn.trim()) return loggedIn.trim();

        const saved = localStorage.getItem("accountexProfile");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.name && data.name.trim()) return data.name.trim();
        }
    } catch (e) {}
    return "Muhammad Rehan";
}

function getUserKey() {
    return getActiveUserName().toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
}

function getUserRecordsKey() {
    return `accountex_records_${getUserKey()}`;
}

function getUserActivitiesKey() {
    return `accountex_activities_${getUserKey()}`;
}

function getSavedProfile() {
    const activeName = getActiveUserName();
    const db = getUsersDB();
    const userObj = db[activeName.toLowerCase().trim()];
    if (userObj) return userObj;

    try {
        const saved = localStorage.getItem("accountexProfile");
        if (saved) {
            const data = JSON.parse(saved);
            if (data.name) return data;
        }
    } catch (e) {}

    return { name: activeName, email: `${getUserKey()}@accountex.com`, phone: "+92 300 9876543", password: "admin123" };
}

function loadSavedProfile() {
    const data = getSavedProfile();
    try {
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
        const passwordInput = document.getElementById("adminPasswordInput");
        if (passwordInput && data.password) {
            passwordInput.value = data.password;
        }
    } catch (e) {
        console.error("Error loading active user profile", e);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSavedProfile);
} else {
    loadSavedProfile();
}

// =========================================
// SYSTEM LOGIN, PASSWORD & ID VALIDATION SYSTEM
// =========================================

function ensureLoginModal() {
    let modal = document.getElementById("loginModalOverlay");
    if (!modal) {
        modal = document.createElement("div");
        modal.className = "modal-overlay";
        modal.id = "loginModalOverlay";
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 440px;">
                <div class="modal-header" style="text-align: center; justify-content: center; position: relative;">
                    <div style="text-align: center; width: 100%;">
                        <div class="logo-icon" style="margin: 0 auto 10px; width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px;">
                            <i class="fas fa-user-lock"></i>
                        </div>
                        <h3 style="font-size: 20px; font-weight: 700; color: var(--text-dark); margin: 0;">System Authentication</h3>
                        <p style="font-size: 13px; color: var(--text-medium); margin: 4px 0 0;">Enter valid User ID / Name and Password to sign in</p>
                    </div>
                </div>
                <form id="loginForm" novalidate>
                    <div class="modal-body" style="padding: 20px 24px;">
                        <div class="form-group full-width" style="margin-bottom: 16px;">
                            <label for="loginUserId" style="font-weight: 600;">User ID / Name</label>
                            <div class="input-with-icon">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" id="loginUserId" class="form-control" placeholder="Enter User ID or Name" required autocomplete="username">
                            </div>
                            <div class="invalid-feedback" id="loginUserIdError">
                                <i class="fas fa-circle-exclamation"></i> Invalid User ID / Name
                            </div>
                        </div>

                        <div class="form-group full-width" style="margin-bottom: 16px;">
                            <label for="loginPassword" style="font-weight: 600;">Password</label>
                            <div class="input-with-icon password-input-wrapper">
                                <i class="fas fa-key input-icon"></i>
                                <input type="password" id="loginPassword" class="form-control" placeholder="Enter Password" required autocomplete="current-password">
                                <button type="button" class="toggle-password-btn" title="Show/Hide Password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback" id="loginPasswordError">
                                <i class="fas fa-circle-exclamation"></i> Invalid Password
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-medium); margin-top: 8px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: normal; margin: 0;">
                                <input type="checkbox" id="rememberMeCheck" checked style="accent-color: var(--primary);"> Remember Me
                            </label>
                            <span style="color: var(--primary); cursor: pointer; font-weight: 600;" id="demoCredentialsHint">Demo Credentials?</span>
                        </div>
                    </div>
                    <div class="modal-footer" style="padding: 16px 24px; background: #f8fafc;">
                        <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-right-to-bracket"></i> Log In
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }
    setupLoginModalEvents();
}

function isUserLoggedIn() {
    const status = localStorage.getItem("accountexIsLoggedIn");
    if (status === null) {
        localStorage.setItem("accountexIsLoggedIn", "true");
        return true;
    }
    return status === "true";
}

function showLoginModal() {
    ensureLoginModal();
    const modal = document.getElementById("loginModalOverlay");
    if (modal) {
        modal.classList.add("active");
        const userIdInput = document.getElementById("loginUserId");
        const passInput = document.getElementById("loginPassword");
        const profile = getSavedProfile();

        if (userIdInput) {
            userIdInput.value = profile.name || getActiveUserName();
        }
        if (passInput && profile.password) {
            passInput.value = profile.password;
        }

        setTimeout(() => {
            if (passInput) passInput.focus();
        }, 150);
    }
}

function hideLoginModal() {
    const modal = document.getElementById("loginModalOverlay");
    if (modal) {
        modal.classList.remove("active");
    }
}

function setupLoginModalEvents() {
    const loginForm = document.getElementById("loginForm");
    const userIdInput = document.getElementById("loginUserId");
    const passwordInput = document.getElementById("loginPassword");
    const userIdError = document.getElementById("loginUserIdError");
    const passwordError = document.getElementById("loginPasswordError");
    const demoHint = document.getElementById("demoCredentialsHint");

    if (demoHint) {
        demoHint.addEventListener("click", () => {
            const profile = getSavedProfile();
            const uIn = document.getElementById("loginUserId");
            const pIn = document.getElementById("loginPassword");
            if (uIn) uIn.value = profile.name;
            if (pIn) pIn.value = profile.password;
            showToast(`User ID: "${profile.name}" | Password: "${profile.password}"`, "info");
        });
    }

    if (userIdInput) {
        userIdInput.addEventListener("input", () => {
            userIdInput.classList.remove("is-invalid");
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            passwordInput.classList.remove("is-invalid");
        });
    }

    if (loginForm) {
        loginForm.onsubmit = function (e) {
            e.preventDefault();

            const enteredUserId = (userIdInput ? userIdInput.value : "").trim();
            const enteredPassword = (passwordInput ? passwordInput.value : "").trim();

            if (!enteredUserId || enteredUserId.length < 2) {
                if (userIdInput) userIdInput.classList.add("is-invalid");
                if (userIdError) userIdError.style.display = "flex";
                showToast("Please enter a valid User ID / Name.", "error");
                return;
            }

            if (!enteredPassword) {
                if (passwordInput) passwordInput.classList.add("is-invalid");
                if (passwordError) passwordError.style.display = "flex";
                showToast("Please enter your password.", "error");
                return;
            }

            const db = getUsersDB();
            const userKey = enteredUserId.toLowerCase();
            const existingUser = db[userKey];

            if (existingUser) {
                // Verify existing password
                if (enteredPassword !== existingUser.password) {
                    if (passwordInput) passwordInput.classList.add("is-invalid");
                    if (passwordError) passwordError.style.display = "flex";
                    showToast("Invalid Password for user ID '" + enteredUserId + "'.", "error");
                    return;
                }
            } else {
                // Register new user dynamically
                saveUserToDB(enteredUserId, enteredPassword);
            }

            // Set active logged-in user
            localStorage.setItem("accountexLoggedInUser", enteredUserId);
            localStorage.setItem("accountexIsLoggedIn", "true");
            hideLoginModal();

            loadSavedProfile();
            refreshUserRecordsTable();
            renderActivityLogs();

            showToast(`Welcome back, ${enteredUserId}! Signed into your personal account.`, "success");
            addActivityLog("User Authentication", `User ID "${enteredUserId}" signed into personal account.`, "success", "fa-user-check");
        };
    }
}

// Global Delegated Password Visibility Toggle & Error Clear Listener
document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(".toggle-password-btn");
    if (toggleBtn) {
        e.preventDefault();
        const wrapper = toggleBtn.closest(".password-input-wrapper") || toggleBtn.parentElement;
        const input = wrapper ? wrapper.querySelector("input") : null;
        if (input) {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            const icon = toggleBtn.querySelector("i");
            if (icon) {
                icon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
            }
        }
    }
});

document.addEventListener("input", (e) => {
    if (e.target && e.target.classList.contains("is-invalid")) {
        e.target.classList.remove("is-invalid");
    }
});

// Check Auth Status on DOM Ready
function checkAuthStatus() {
    ensureLoginModal();
    if (!isUserLoggedIn()) {
        showLoginModal();
    } else {
        hideLoginModal();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAuthStatus);
} else {
    checkAuthStatus();
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

window.openProfileModal = function() {
    const modal = document.getElementById("profileSettingsModal");
    const menu = document.getElementById("profileDropdownMenu");
    if (menu) menu.classList.remove("active");
    loadSavedProfile();
    initTheme();
    if (modal) {
        modal.style.display = "flex";
        modal.classList.add("active");
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
        modal.style.pointerEvents = "auto";
        modal.style.zIndex = "99999";
    }
};

function openProfileModal() {
    window.openProfileModal();
}

window.closeProfileModal = function() {
    const modal = document.getElementById("profileSettingsModal");
    if (modal) {
        modal.classList.remove("active");
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        modal.style.pointerEvents = "none";
        modal.style.display = "none";
        setTimeout(() => {
            modal.style.display = "";
            modal.style.opacity = "";
            modal.style.visibility = "";
            modal.style.pointerEvents = "";
        }, 100);
    }
};

function closeProfileModal() {
    window.closeProfileModal();
}

document.addEventListener("click", (e) => {
    const openProf = e.target.closest("#openProfileModalBtn");
    if (openProf) {
        e.preventDefault();
        openProfileModal();
        return;
    }
    const closeProf = e.target.closest("#closeProfileModalBtn, #cancelProfileModalBtn");
    if (closeProf) {
        e.preventDefault();
        closeProfileModal();
        return;
    }
    const modal = document.getElementById("profileSettingsModal");
    if (modal && e.target === modal) {
        closeProfileModal();
    }
});

// =========================================
// DYNAMIC ACTIVITY LOGGING SYSTEM (PER USER ID)
// =========================================

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

window.clearActivityLog = function() {
    const key = getUserActivitiesKey();
    localStorage.setItem(key, JSON.stringify([]));
    localStorage.setItem("accountexActivities", JSON.stringify([]));
    renderActivityLogs();
    showToast("Activity log cleared successfully!", "info");
};

function clearActivityLog() {
    window.clearActivityLog();
}

function renderActivityLogs() {
    const timeline = document.getElementById("activityTimeline");
    if (!timeline) return;

    const userName = getActiveUserName();
    const key = getUserActivitiesKey();
    let activities = [];

    try {
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            activities = JSON.parse(saved);
        } else {
            activities = getDefaultActivities(userName);
            localStorage.setItem(key, JSON.stringify(activities));
        }
    } catch (e) {
        activities = getDefaultActivities(userName);
    }

    if (!activities || activities.length === 0) {
        timeline.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: var(--text-medium); font-size: 13px;">
            <div style="font-size: 28px; color: var(--primary); margin-bottom: 10px;"><i class="fas fa-list-check"></i></div>
            <strong style="color: var(--text-dark); font-size: 14px; display: block; margin-bottom: 4px;">No activity log entries found.</strong>
            <span>System activity log for active user <strong>"${userName}"</strong> has been cleared.</span>
        </div>`;
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
    const key = getUserActivitiesKey();
    const newActivity = {
        type: type,
        icon: icon,
        title: title,
        desc: `${userName}: ${desc}`,
        time: "Just now"
    };

    let activities = [];
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            activities = JSON.parse(saved);
        } else {
            activities = getDefaultActivities(userName);
        }
    } catch (e) {
        activities = getDefaultActivities(userName);
    }

    activities.unshift(newActivity);
    localStorage.setItem(key, JSON.stringify(activities));
    renderActivityLogs();
}

function openActivityModal() {
    const menu = document.getElementById("profileDropdownMenu");
    if (menu) menu.classList.remove("active");
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

    const clearActBtn = e.target.closest("#clearActivityLogBtn, .clear-activity-btn");
    if (clearActBtn) {
        e.preventDefault();
        window.clearActivityLog();
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

// Delegated submit for Profile Settings Form
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "profileSettingsForm") {
        e.preventDefault();
        const nameInput = document.getElementById("adminNameInput");
        const passwordInput = document.getElementById("adminPasswordInput");
        const emailInput = document.getElementById("adminEmailInput");
        const phoneInput = document.getElementById("adminPhoneInput");

        const newName = nameInput ? nameInput.value.trim() : "";
        const newEmail = emailInput ? emailInput.value.trim() : "";
        const newPhone = phoneInput ? phoneInput.value.trim() : "";
        const newPassword = passwordInput ? passwordInput.value.trim() : "";

        let isValid = true;

        if (!newName || newName.length < 2) {
            isValid = false;
            if (nameInput) nameInput.classList.add("is-invalid");
        } else {
            if (nameInput) nameInput.classList.remove("is-invalid");
        }

        if (!newPassword || newPassword.length < 3) {
            isValid = false;
            if (passwordInput) passwordInput.classList.add("is-invalid");
        } else {
            if (passwordInput) passwordInput.classList.remove("is-invalid");
        }

        if (!isValid) {
            showToast("Invalid User ID / Name or Password.", "error");
            return;
        }

        const oldRecordsKey = getUserRecordsKey();
        const oldActivitiesKey = getUserActivitiesKey();
        const oldRecords = localStorage.getItem(oldRecordsKey);
        const oldActivities = localStorage.getItem(oldActivitiesKey);

        saveUserToDB(newName, newPassword, newEmail, newPhone);
        localStorage.setItem("accountexLoggedInUser", newName);

        const newRecordsKey = getUserRecordsKey();
        const newActivitiesKey = getUserActivitiesKey();

        if (oldRecordsKey !== newRecordsKey) {
            if (oldRecords && (!localStorage.getItem(newRecordsKey) || localStorage.getItem(newRecordsKey) === "[]")) {
                localStorage.setItem(newRecordsKey, oldRecords);
            }
            if (oldActivities && (!localStorage.getItem(newActivitiesKey) || localStorage.getItem(newActivitiesKey) === "[]")) {
                localStorage.setItem(newActivitiesKey, oldActivities);
            }
        }

        loadSavedProfile();
        refreshUserRecordsTable();
        updateDashboardOverviewCards();
        updateSubpageMetricCards();
        updateFinancialChartData();
        addActivityLog("Profile Details Updated", `Updated account details & credentials for user ID "${newName}".`, "info", "fa-user-gear");
        closeProfileModal();
        showToast(`System & profile settings saved! Active User ID is now "${newName}".`, "success");
    }
});

// Live sync for Admin Name Input
document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "adminNameInput") {
        const liveVal = e.target.value.trim();
        if (liveVal) {
            document.querySelectorAll("#adminUserNameDisplay, #adminMenuName, .profile-info strong, .sidebar-user strong, .user-info strong").forEach(el => {
                el.textContent = liveVal;
            });
            const initials = liveVal.split(" ").map(n => n[0]).filter(Boolean).join("").toUpperCase().substring(0, 2);
            document.querySelectorAll(".profile-avatar, .user-avatar").forEach(el => {
                el.textContent = initials || "MR";
            });
        }
    }
});

// Logout Action
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (profileDropdownMenu) profileDropdownMenu.classList.remove("active");
        localStorage.setItem("accountexIsLoggedIn", "false");
        showToast("Logged out successfully.", "info");
        const passInput = document.getElementById("loginPassword");
        if (passInput) passInput.value = "";
        showLoginModal();
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

    window.financialChartInstance = new Chart(ctx, {
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
                window.financialChartInstance.data.labels = chartDataMap[selected].labels;
                window.financialChartInstance.data.datasets[0].data = chartDataMap[selected].income;
                window.financialChartInstance.data.datasets[1].data = chartDataMap[selected].expense;
                window.financialChartInstance.update();
            }
        });
    }
}


// =========================================
// LOCALSTORAGE PERSISTENCE LAYER
// =========================================

const LOCAL_STORAGE_KEY = "accountex_custom_records";

// =========================================
// LOCALSTORAGE PERSISTENCE LAYER (PER USER ID)
// =========================================

function getSavedRecords() {
    try {
        const key = getUserRecordsKey();
        const activeUser = getActiveUserName().toLowerCase().trim();
        const isPrimaryAdmin = (activeUser === "muhammad rehan" || activeUser === "admin user" || activeUser === "admin");

        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            // If non-primary second user has default 2 demo items copied previously, clear them to return clean []
            if (!isPrimaryAdmin && Array.isArray(parsed) && parsed.length === 2 && parsed[0].ref === "INV-1025" && parsed[1].ref === "BILL-784" && !parsed[0].isCustom) {
                localStorage.setItem(key, JSON.stringify([]));
                return [];
            }
            return parsed;
        }

        // Default sample records ONLY for primary demo account
        if (isPrimaryAdmin) {
            const initialDefault = [
                { id: "1", party: "Ahmed Traders", type: "income", category: "Sales", amount: 45000, dateRaw: "2026-08-17", status: "paid", ref: "INV-1025" },
                { id: "2", party: "Al-Noor Suppliers", type: "expense", category: "Purchase", amount: 18500, dateRaw: "2026-08-16", status: "pending", ref: "BILL-784" }
            ];
            localStorage.setItem(key, JSON.stringify(initialDefault));
            return initialDefault;
        }

        // For any second user or new user account, return clean empty list []
        return [];
    } catch (e) {
        console.error("Error reading user records", e);
        return [];
    }
}

function saveRecord(record) {
    const key = getUserRecordsKey();
    const records = getSavedRecords();
    record.userId = getActiveUserName();
    record.isCustom = true;
    records.unshift(record);
    localStorage.setItem(key, JSON.stringify(records));
    updateDashboardOverviewCards();
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

function updateDashboardOverviewCards() {
    const saved = getSavedRecords();

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalReceivable = 0;
    let totalPayable = 0;

    saved.forEach(rec => {
        const amt = parseFloat(rec.amount) || 0;
        const isIncome = rec.type === "income";
        const isPending = rec.status === "pending";

        if (isIncome) {
            totalIncome += amt;
            if (isPending) {
                totalReceivable += amt;
            }
        } else {
            totalExpenses += amt;
            if (isPending) {
                totalPayable += amt;
            }
        }
    });

    const cashBalance = Math.max(0, totalIncome - totalExpenses - totalReceivable);
    const totalBalance = totalIncome - totalExpenses;

    const balanceEl = document.getElementById("dashTotalBalance");
    const receivableEl = document.getElementById("dashTotalReceivable");
    const payableEl = document.getElementById("dashTotalPayable");
    const cashEl = document.getElementById("dashCashBalance");

    const incomeSumEl = document.getElementById("dashTotalIncome");
    const expenseSumEl = document.getElementById("dashTotalExpenses");

    const incomeProgress = document.getElementById("incomeProgressBar");
    const expenseProgress = document.getElementById("expenseProgressBar");
    const incomePercentText = document.getElementById("incomePercentText");
    const expensePercentText = document.getElementById("expensePercentText");

    if (balanceEl) balanceEl.textContent = `Rs. ${totalBalance.toLocaleString()}`;
    if (receivableEl) receivableEl.textContent = `Rs. ${totalReceivable.toLocaleString()}`;
    if (payableEl) payableEl.textContent = `Rs. ${totalPayable.toLocaleString()}`;
    if (cashEl) cashEl.textContent = `Rs. ${cashBalance.toLocaleString()}`;

    if (incomeSumEl) incomeSumEl.textContent = `Rs. ${totalIncome.toLocaleString()}`;
    if (expenseSumEl) expenseSumEl.textContent = `Rs. ${totalExpenses.toLocaleString()}`;

    const maxVal = Math.max(totalIncome, totalExpenses, 1);
    const incPct = saved.length === 0 ? 0 : Math.round((totalIncome / maxVal) * 100);
    const expPct = saved.length === 0 ? 0 : Math.round((totalExpenses / maxVal) * 100);

    if (incomeProgress) incomeProgress.style.width = `${incPct}%`;
    if (expenseProgress) expenseProgress.style.width = `${expPct}%`;
    if (incomePercentText) incomePercentText.textContent = `${incPct > 0 ? '+' : ''}${incPct}%`;
    if (expensePercentText) expensePercentText.textContent = `${expPct > 0 ? '-' : ''}${expPct}%`;

    // Update trend labels
    const balTrend = document.getElementById("dashBalanceTrend");
    const recTrend = document.getElementById("dashReceivableTrend");
    const payTrend = document.getElementById("dashPayableTrend");
    const cashTrend = document.getElementById("dashCashTrend");

    if (balTrend) balTrend.textContent = saved.length === 0 ? "0.0%" : "8.4%";
    if (recTrend) recTrend.textContent = saved.length === 0 ? "0.0%" : "5.2%";
    if (payTrend) payTrend.textContent = saved.length === 0 ? "0.0%" : "2.8%";
    if (cashTrend) cashTrend.textContent = saved.length === 0 ? "0.0%" : "12.6%";

    updateSubpageMetricCards(saved);
    updateFinancialChartData(saved);
}

function updateSubpageMetricCards(saved) {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalReceivable = 0;
    let totalPayable = 0;

    let paidIncome = 0;
    let paidExpenses = 0;

    const uniqueCustomers = new Set();
    const uniqueSuppliers = new Set();

    saved.forEach(rec => {
        const amt = parseFloat(rec.amount) || 0;
        const isIncome = rec.type === "income";
        const isPaid = rec.status === "paid";

        if (isIncome) {
            totalIncome += amt;
            if (isPaid) paidIncome += amt;
            else totalReceivable += amt;
            if (rec.party) uniqueCustomers.add(rec.party.toLowerCase().trim());
        } else {
            totalExpenses += amt;
            if (isPaid) paidExpenses += amt;
            else totalPayable += amt;
            if (rec.party) uniqueSuppliers.add(rec.party.toLowerCase().trim());
        }
    });

    const netProfit = totalIncome - totalExpenses;
    const cashBalance = Math.max(0, paidIncome - paidExpenses);

    const cards = document.querySelectorAll(".financial-cards .financial-card h2, .financial-card h2");

    if (cards && cards.length >= 2) {
        const path = window.location.pathname.toLowerCase();

        if (path.includes("receivable")) {
            cards[0].textContent = `Rs. ${totalReceivable.toLocaleString()}`;
            cards[1].textContent = `Rs. ${saved.length === 0 ? 0 : Math.round(totalReceivable * 0.25).toLocaleString()}`;
            cards[2].textContent = `Rs. ${saved.length === 0 ? 0 : Math.round(totalReceivable * 0.75).toLocaleString()}`;
            if (cards[3]) cards[3].textContent = `Rs. ${paidIncome.toLocaleString()}`;
        } else if (path.includes("payable")) {
            cards[0].textContent = `Rs. ${totalPayable.toLocaleString()}`;
            cards[1].textContent = `Rs. ${saved.length === 0 ? 0 : Math.round(totalPayable * 0.4).toLocaleString()}`;
            cards[2].textContent = `Rs. ${saved.length === 0 ? 0 : Math.round(totalPayable * 0.6).toLocaleString()}`;
            if (cards[3]) cards[3].textContent = `Rs. ${paidExpenses.toLocaleString()}`;
        } else if (path.includes("cashbook")) {
            cards[0].textContent = `Rs. ${saved.length === 0 ? 0 : (250000).toLocaleString()}`;
            cards[1].textContent = `Rs. ${paidIncome.toLocaleString()}`;
            cards[2].textContent = `Rs. ${paidExpenses.toLocaleString()}`;
            if (cards[3]) cards[3].textContent = `Rs. ${cashBalance.toLocaleString()}`;
        } else if (path.includes("invoices")) {
            cards[0].textContent = `Rs. ${totalIncome.toLocaleString()}`;
            cards[1].textContent = `Rs. ${paidIncome.toLocaleString()}`;
            cards[2].textContent = `Rs. ${totalReceivable.toLocaleString()}`;
            if (cards[3]) cards[3].textContent = `Rs. ${saved.length === 0 ? 0 : Math.round(totalReceivable * 0.2).toLocaleString()}`;
        } else if (path.includes("income-expense")) {
            cards[0].textContent = `Rs. ${totalIncome.toLocaleString()}`;
            cards[1].textContent = `Rs. ${totalExpenses.toLocaleString()}`;
            cards[2].textContent = `Rs. ${netProfit.toLocaleString()}`;

            const revHeader = document.querySelector(".summary-card:first-child h3");
            const expHeader = document.querySelector(".summary-card:last-child h3");
            if (revHeader) revHeader.textContent = `Rs. ${totalIncome.toLocaleString()}`;
            if (expHeader) expHeader.textContent = `Rs. ${totalExpenses.toLocaleString()}`;
        } else if (path.includes("ledger")) {
            cards[0].textContent = `Rs. ${totalIncome.toLocaleString()}`;
            cards[1].textContent = `Rs. ${totalPayable.toLocaleString()}`;
            cards[2].textContent = `Rs. ${netProfit.toLocaleString()}`;
            if (cards[3]) cards[3].textContent = `Rs. ${netProfit.toLocaleString()}`;
        } else if (path.includes("customers")) {
            cards[0].textContent = `${uniqueCustomers.size}`;
            cards[1].textContent = `Rs. ${totalReceivable.toLocaleString()}`;
            if (cards[2]) cards[2].textContent = `Rs. ${totalIncome.toLocaleString()}`;
        } else if (path.includes("suppliers")) {
            cards[0].textContent = `${uniqueSuppliers.size}`;
            cards[1].textContent = `Rs. ${totalPayable.toLocaleString()}`;
            if (cards[2]) cards[2].textContent = `Rs. ${totalExpenses.toLocaleString()}`;
        }
    }
}

function updateFinancialChartData(saved) {
    if (!window.financialChartInstance) return;

    if (!saved || saved.length === 0) {
        window.financialChartInstance.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        window.financialChartInstance.data.datasets[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        window.financialChartInstance.update();
        return;
    }

    const monthlyIncome = new Array(12).fill(0);
    const monthlyExpenses = new Array(12).fill(0);

    saved.forEach(rec => {
        const amt = parseFloat(rec.amount) || 0;
        const d = new Date(rec.dateRaw || Date.now());
        const month = d.getMonth();
        if (rec.type === "income") {
            monthlyIncome[month] += amt;
        } else {
            monthlyExpenses[month] += amt;
        }
    });

    window.financialChartInstance.data.datasets[0].data = monthlyIncome;
    window.financialChartInstance.data.datasets[1].data = monthlyExpenses;
    window.financialChartInstance.update();
}

function refreshUserRecordsTable() {
    updateDashboardOverviewCards();

    const table = document.querySelector(".transactions-table");
    const tbody = table ? table.querySelector("tbody") : null;
    if (!table || !tbody) return;

    tbody.innerHTML = "";

    const thList = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim().toLowerCase());
    const pageContext = getPageContext(thList);

    const saved = getSavedRecords();
    const activeUser = getActiveUserName();

    if (saved.length === 0) {
        const tr = document.createElement("tr");
        tr.className = "no-records-row";
        tr.innerHTML = `
            <td colspan="${thList.length || 5}" style="text-align: center; padding: 32px 20px; color: var(--text-medium); font-size: 13px;">
                <div style="font-size: 24px; margin-bottom: 8px; color: var(--primary);"><i class="fas fa-folder-open"></i></div>
                <strong style="color: var(--text-dark); font-size: 14px; display: block;">No transaction records found for user "${activeUser}".</strong>
                <span style="font-size: 12px; color: var(--text-medium); margin-top: 4px; display: inline-block;">Transactions added by this user will appear here isolated to their User ID / Name.</span>
            </td>
        `;
        tbody.appendChild(tr);
        return;
    }

    saved.slice().reverse().forEach(record => {
        renderRecordRow(record, tbody, pageContext);
    });
}

function loadSavedRecords() {
    refreshUserRecordsTable();
}

// Run loadSavedRecords on DOM ready
document.addEventListener("DOMContentLoaded", loadSavedRecords);
if (document.readyState === "complete" || document.readyState === "interactive") {
    loadSavedRecords();
}


// =========================================
// AUTOMATIC BILL # / REFERENCE GENERATOR
// =========================================

function generateAutoBillNumber() {
    const path = window.location.pathname.toLowerCase();
    let prefix = "BILL-";
    let defaultStart = 785;

    const typeSelect = document.getElementById("transType");
    const categorySelect = document.getElementById("transCategory");

    const selectedType = typeSelect ? typeSelect.value : "";
    const selectedCategory = categorySelect ? categorySelect.value : "";

    if (path.includes("invoices") || path.includes("receivable") || selectedType === "income" || selectedCategory === "Sales") {
        prefix = "INV-";
        defaultStart = 1026;
    } else if (path.includes("payable") || path.includes("suppliers") || selectedType === "expense" || selectedCategory === "Purchase") {
        prefix = "BILL-";
        defaultStart = 785;
    } else if (path.includes("cashbook")) {
        prefix = "CS-";
        defaultStart = 404;
    } else if (path.includes("income-expense") || selectedCategory === "Utilities") {
        prefix = "EXP-";
        defaultStart = 206;
    } else if (path.includes("ledger")) {
        prefix = "VOUCH-";
        defaultStart = 903;
    }

    let maxNum = defaultStart - 1;
    const regex = new RegExp(prefix + "(\\d+)", "i");

    // Scan existing DOM table cells
    document.querySelectorAll("table tbody td, table tbody tr").forEach(el => {
        const text = el.textContent || "";
        const match = text.match(regex);
        if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });

    // Scan saved records in LocalStorage
    try {
        const saved = getSavedRecords();
        saved.forEach(rec => {
            if (rec.ref) {
                const match = rec.ref.match(regex);
                if (match && match[1]) {
                    const num = parseInt(match[1], 10);
                    if (!isNaN(num) && num > maxNum) {
                        maxNum = num;
                    }
                }
            }
        });
    } catch (e) {}

    const nextNum = maxNum + 1;
    return `${prefix}${nextNum}`;
}

function autoFillBillNumber() {
    const refInput = document.getElementById("transRef");
    if (refInput) {
        refInput.value = generateAutoBillNumber();
    }
}

// Regenerate click handler
document.addEventListener("click", (e) => {
    const regenBtn = e.target.closest("#regenerateRefBtn, .regenerate-ref-btn");
    if (regenBtn) {
        e.preventDefault();
        autoFillBillNumber();
        showToast("Auto-generated new Bill # / Reference!", "info");
    }
});

// Category or Type change auto update
document.addEventListener("change", (e) => {
    if (e.target && (e.target.id === "transType" || e.target.id === "transCategory")) {
        autoFillBillNumber();
    }
});

// Run on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoFillBillNumber);
} else {
    autoFillBillNumber();
}


// =========================================
// ADD TRANSACTION MODAL & FORM HANDLING
// =========================================

const addTransactionBtn = document.getElementById("addTransactionBtn");
const addTransactionModal = document.getElementById("addTransactionModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const addTransactionForm = document.getElementById("addTransactionForm");

window.openModal = function() {
    const modal = document.getElementById("addTransactionModal");
    if (modal) {
        modal.classList.add("active");
        modal.style.opacity = "1";
        modal.style.visibility = "visible";
        modal.style.pointerEvents = "auto";
        modal.style.zIndex = "99999";

        const dateInput = document.getElementById("transDate");
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split("T")[0];
            dateInput.value = today;
        }
        if (typeof autoFillBillNumber === "function") {
            autoFillBillNumber();
        }
    }
};

function openModal() {
    window.openModal();
}

window.closeModal = function() {
    const modal = document.getElementById("addTransactionModal");
    if (modal) {
        modal.classList.remove("active");
        modal.style.opacity = "";
        modal.style.visibility = "";
        modal.style.pointerEvents = "";
    }
};

function closeModal() {
    window.closeModal();
}

document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("#addTransactionBtn, .add-transaction-btn, .btn-action-main");
    if (addBtn) {
        e.preventDefault();
        openModal();
        return;
    }

    const closeBtn = e.target.closest("#closeModalBtn, #cancelModalBtn");
    if (closeBtn) {
        e.preventDefault();
        closeModal();
        return;
    }

    const modal = document.getElementById("addTransactionModal");
    if (modal && e.target === modal) {
        closeModal();
    }
});

if (addTransactionForm) {
    addTransactionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const partyInput = document.getElementById("transParty");
        const party = partyInput ? partyInput.value.trim() : "";
        const type = document.getElementById("transType")?.value || "expense";
        const category = document.getElementById("transCategory")?.value || "Purchase";
        const amount = parseFloat(document.getElementById("transAmount")?.value);
        const dateRaw = document.getElementById("transDate")?.value;
        const status = document.getElementById("transStatus")?.value || "paid";
        
        let refInput = document.getElementById("transRef");
        let ref = refInput && refInput.value.trim() ? refInput.value.trim() : generateAutoBillNumber();

        if (!party) {
            if (partyInput) partyInput.classList.add("is-invalid");
            showToast("Please enter a valid Vendor / Party Name.", "error");
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            const amountInput = document.getElementById("transAmount");
            if (amountInput) amountInput.classList.add("is-invalid");
            showToast("Please enter a valid payment amount.", "error");
            return;
        }

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
        autoFillBillNumber();
        showToast(`Record for "${party}" (${ref}) saved successfully!`, "success");
    });
}