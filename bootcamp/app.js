// State management
let currentView = 'landing';
let isDarkMode = true;
let calendarView = 'month';
let teamTab = 'directory';
let taskView = 'kanban';
let isDND = false;

let notifications = [
    { id: 1, type: 'reminder', title: 'Upcoming Meeting', msg: 'Project Review starts in 15 mins.', time: '10:15 AM', read: false },
    { id: 2, type: 'mention', title: 'Marcus mentioned you', msg: '@Alex check the new UI designs.', time: 'Yesterday', read: false },
    { id: 3, type: 'deadline', title: 'Task Deadline', msg: 'API Integration is due tomorrow.', time: '2:00 PM', read: true }
];

let events = [
    { id: 1, title: 'Project Review', start: '2026-04-27T11:30', end: '2026-04-27T13:00', category: 'meeting' },
    { id: 2, title: 'Daily Standup', start: '2026-04-27T09:00', end: '2026-04-27T09:30', category: 'meeting' },
    { id: 3, title: 'Submit Report', start: '2026-04-28T16:00', end: '2026-04-28T17:00', category: 'deadline' }
];

let teamMembers = [
    { id: 101, name: 'Alex Johnson', role: 'Manager', dept: 'Engineering', status: 'online', email: 'alex@smart.com' },
    { id: 102, name: 'Sarah Jenkins', role: 'Admin', dept: 'Operations', status: 'busy', email: 'sarah@smart.com' },
    { id: 103, name: 'Marcus Chen', role: 'Viewer', dept: 'Product', status: 'away', email: 'marcus@smart.com' },
    { id: 104, name: 'Elena Rodriguez', role: 'Manager', dept: 'Design', status: 'offline', email: 'elena@smart.com' }
];

let tasks = [
    { id: 201, title: 'UI Design System', status: 'in-progress', priority: 'high', desc: 'Create a cohesive design system for the app.', assignees: [101, 104], due: '2026-05-10', tags: ['Design', 'Priority'] },
    { id: 202, title: 'API Integration', status: 'todo', priority: 'medium', desc: 'Connect frontend to backend services.', assignees: [101], due: '2026-05-15', tags: ['Backend'] },
    { id: 203, title: 'User Testing', status: 'review', priority: 'high', desc: 'Gather feedback from beta users.', assignees: [102, 103], due: '2026-05-05', tags: ['Research'] },
    { id: 204, title: 'Final Deployment', status: 'todo', priority: 'low', desc: 'Push to production.', assignees: [101, 102], due: '2026-05-20', tags: ['Ops'] }
];

// Initialize Lucide icons
function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Navigation logic
function navigateTo(viewId, params = {}) {
    const mainView = document.getElementById('main-view');
    const template = document.getElementById(`${viewId}-template`);

    if (!template) return;

    if (mainView.children.length > 0) {
        mainView.firstElementChild.classList.add('page-transition-exit');
        setTimeout(() => { renderView(viewId, template, params); }, 300);
    } else {
        renderView(viewId, template, params);
    }
    
    currentView = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderView(viewId, template, params) {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = '';
    
    const content = template.content.cloneNode(true);
    const wrapper = document.createElement('div');
    wrapper.className = 'page-transition-enter';
    wrapper.appendChild(content);
    
    mainView.appendChild(wrapper);
    initIcons();
    
    if (viewId === 'calendar') renderCalendar();
    if (viewId === 'team') renderTeam();
    if (viewId === 'member-profile') populateProfile(params.memberId);
    if (viewId === 'tasks') renderTasks();
    if (viewId === 'reports') renderReports();
    
    updateNav(viewId);
}

function updateNav(viewId) {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const hideOn = ['dashboard', 'calendar', 'team', 'member-profile', 'tasks', 'settings', 'reports'];
    nav.style.display = hideOn.includes(viewId) ? 'none' : 'block';
}

// Reports Logic
function renderReports() {
    renderProductivityChart();
    renderReportsHeatmap();
}

function renderProductivityChart() {
    const container = document.getElementById('productivity-chart');
    if (!container) return;
    
    const data = [
        { label: 'W1', planned: 20, completed: 18 },
        { label: 'W2', planned: 25, completed: 22 },
        { label: 'W3', planned: 22, completed: 25 },
        { label: 'W4', planned: 30, completed: 28 }
    ];

    container.innerHTML = data.map(d => `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <div style="display: flex; align-items: flex-end; gap: 4px; height: 100px;">
                <div class="bar planned" style="height: ${d.planned * 3}px; width: 12px; background: var(--border); border-radius: 2px;"></div>
                <div class="bar completed" style="height: ${d.completed * 3}px; width: 12px; background: var(--primary); border-radius: 2px;"></div>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${d.label}</span>
        </div>
    `).join('');
}

function renderReportsHeatmap() {
    const container = document.getElementById('reports-heatmap-container');
    if (!container) return;

    let html = `<div style="display: grid; grid-template-columns: 80px repeat(12, 1fr); gap: 4px;">`;
    html += `<div></div>` + Array.from({length: 12}, (_, i) => `<div style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">${i+8}AM</div>`).join('');
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    days.forEach(day => {
        html += `<div style="font-size: 0.8rem; color: var(--text-main);">${day}</div>`;
        for (let i = 0; i < 12; i++) {
            const opacity = Math.random();
            html += `<div style="height: 30px; background: var(--primary); opacity: ${opacity}; border-radius: 4px;"></div>`;
        }
    });
    html += `</div>`;
    container.innerHTML = html;
}

function exportReport(type) {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Exporting...`;
    initIcons();

    setTimeout(() => {
        alert(`Your ${type.toUpperCase()} report has been generated and downloaded successfully.`);
        btn.innerHTML = originalText;
        initIcons();
        toggleDropdown('export-menu');
    }, 2000);
}

// Notifications Logic
function toggleNotificationDrawer() {
    const drawer = document.getElementById('notification-drawer');
    drawer.classList.toggle('active');
    if (drawer.classList.contains('active')) {
        renderNotifications();
    }
}

function renderNotifications() {
    const list = document.getElementById('notifications-list');
    if (!list) return;
    list.innerHTML = '';

    const sortedNotis = [...notifications].sort((a, b) => b.id - a.id);
    sortedNotis.forEach(n => {
        const item = document.createElement('div');
        item.className = `notification-item ${n.read ? '' : 'unread'}`;
        item.innerHTML = `
            <div class="noti-header">
                <span>${n.type.toUpperCase()}</span>
                <span>${n.time}</span>
            </div>
            <div class="noti-title">${n.title}</div>
            <div class="noti-msg">${n.msg}</div>
        `;
        item.onclick = () => { n.read = true; renderNotifications(); updateBadge(); };
        list.appendChild(item);
    });
    updateBadge();
}

function markAllRead() {
    notifications.forEach(n => n.read = true);
    renderNotifications();
    updateBadge();
}

function updateBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badgeElements = document.querySelectorAll('.notification-bell .badge');
    badgeElements.forEach(badge => {
        badge.innerText = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    });
}

function requestPushPermission() {
    alert("Smart Schedule wants to show notifications.\n[Allow] [Block]");
    setTimeout(() => {
        alert("Push notifications enabled!");
    }, 1000);
}

function toggleDND() {
    isDND = !isDND;
    const settingsBox = document.getElementById('dnd-settings-box');
    if (settingsBox) {
        settingsBox.classList.toggle('hidden', !isDND);
    }
}

// Auth handlers
function handleAuth(event, type) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Processing...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        localStorage.setItem('isAuthenticated', 'true');
        navigateTo('dashboard');
    }, 1000);
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    navigateTo('landing');
}

// Tasks Logic
function renderTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    container.innerHTML = '';

    if (taskView === 'kanban') {
        renderKanban(container);
    } else if (taskView === 'list') {
        renderTaskList(container);
    } else {
        container.innerHTML = `<div class="gantt-container">
            <h3 style="margin-bottom:1rem">Project Timeline</h3>
            ${tasks.map(t => `
                <div class="gantt-row">
                    <div class="gantt-label">${t.title}</div>
                    <div class="gantt-timeline">
                        <div class="gantt-bar" style="left:${Math.random()*50}%; width:${20+Math.random()*40}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }
}

function renderKanban(container) {
    const columns = [
        { id: 'todo', label: 'To Do' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'review', label: 'Review' },
        { id: 'done', label: 'Done' }
    ];

    container.className = 'kanban-board';
    columns.forEach(col => {
        const colEl = document.createElement('div');
        colEl.className = 'kanban-column';
        colEl.innerHTML = `
            <div class="column-header">
                <h3>${col.label}</h3>
                <span class="task-count">${tasks.filter(t => t.status === col.id).length}</span>
            </div>
            <div class="column-tasks" id="col-${col.id}"></div>
        `;
        
        const tasksList = colEl.querySelector('.column-tasks');
        tasks.filter(t => t.status === col.id).forEach(task => {
            const taskEl = createTaskCard(task);
            tasksList.appendChild(taskEl);
        });

        colEl.addEventListener('dragover', (e) => { e.preventDefault(); colEl.classList.add('drag-over'); });
        colEl.addEventListener('dragleave', () => colEl.classList.remove('drag-over'));
        colEl.addEventListener('drop', (e) => {
            e.preventDefault();
            colEl.classList.remove('drag-over');
            const taskId = e.dataTransfer.getData('text/plain');
            handleTaskDrop(taskId, col.id);
        });

        container.appendChild(colEl);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.innerHTML = `
        <div class="task-tags">${task.tags.map(tag => `<span class="tag" style="background:rgba(99,102,241,0.1); color:var(--primary)">${tag}</span>`).join('')}</div>
        <div class="task-title">${task.title}</div>
        <p class="task-desc-brief">${task.desc}</p>
        <div class="task-footer">
            <div class="task-meta"><i data-lucide="calendar"></i> ${task.due}</div>
            <div class="avatar-stack">
                ${task.assignees.map(id => `<img src="https://ui-avatars.com/api/?name=${teamMembers.find(m=>m.id==id).name}&size=20">`).join('')}
            </div>
        </div>
    `;
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.onclick = () => viewTaskDetail(task.id);
    
    // Re-init icons for the card
    setTimeout(() => initIcons(), 0);
    return card;
}

function handleTaskDrop(taskId, newStatus) {
    const task = tasks.find(t => t.id == taskId);
    if (task) {
        task.status = newStatus;
        renderTasks();
    }
}

function switchTaskView(view) {
    taskView = view;
    document.querySelectorAll('.switcher-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `tab-${view}`);
    });
    renderTasks();
}

function viewTaskDetail(taskId) {
    const task = tasks.find(t => t.id == taskId);
    if (!task) return;
    
    document.getElementById('td-title').innerText = task.title;
    document.getElementById('td-desc').innerText = task.desc;
    document.getElementById('td-status').innerText = task.status.replace('-', ' ').toUpperCase();
    document.getElementById('td-priority').innerText = task.priority.toUpperCase();
    document.getElementById('td-priority').className = `status-pill priority-${task.priority}`;
    
    openModal('task-detail-modal');
}

function filterTasks() {
    const priority = document.getElementById('task-filter-priority').value;
    // For demo, we just alert or could re-render with filtered data
    console.log(`Filtering tasks by priority: ${priority}`);
    renderTasks();
}

function handleCreateProject(event) {
    event.preventDefault();
    alert('Project created with milestones and team assigned!');
    closeModal('project-modal');
}

function switchTeamTab(tab) {
    teamTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `tab-${tab}`);
    });
    renderTeam();
}

function populateProfile(memberId) {
    const m = teamMembers.find(member => member.id == memberId);
    if (!m) return;
    
    document.getElementById('prof-avatar').src = `https://ui-avatars.com/api/?name=${m.name}&size=128&background=6366f1&color=fff`;
    document.getElementById('prof-name').innerText = m.name;
    document.getElementById('prof-role-dept').innerText = `${m.role} • ${m.dept}`;
    const statusEl = document.getElementById('prof-status');
    statusEl.className = `status-indicator ${m.status}`;
    statusEl.innerText = m.status.toUpperCase();
}

// Bulk Actions
function toggleDropdown(id) {
    document.getElementById(id).classList.toggle('active');
}

function bulkAction(type) {
    alert(`Bulk ${type} initiated for selected members.`);
    toggleDropdown('bulk-menu');
}

function handleInvite(event) {
    event.preventDefault();
    alert('Invitation sent successfully!');
    closeModal('invite-modal');
}

// Calendar Logic
function renderCalendar() {
    const container = document.getElementById('calendar-view-container');
    if (!container) return;
    container.innerHTML = '';

    if (calendarView === 'month') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach(day => {
            const header = document.createElement('div');
            header.className = 'cal-header-cell';
            header.innerText = day;
            container.appendChild(header);
        });

        for (let i = 1; i <= 31; i++) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell';
            cell.innerHTML = `<div class="cell-date">${i}</div>`;
            cell.setAttribute('data-day', i);
            
            // Add events for April 27 and 28
            const dayEvents = events.filter(e => e.start.includes(`2026-04-${i < 10 ? '0' + i : i}`));
            dayEvents.forEach(ev => {
                const evEl = document.createElement('div');
                evEl.className = `cal-event event-${ev.category}`;
                evEl.innerText = ev.title;
                evEl.draggable = true;
                evEl.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', ev.id));
                cell.appendChild(evEl);
            });

            cell.addEventListener('dragover', (e) => e.preventDefault());
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                const eventId = e.dataTransfer.getData('text/plain');
                handleEventDrop(eventId, cell.getAttribute('data-day'));
            });

            container.appendChild(cell);
        }
    } else {
        container.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted)">${calendarView.charAt(0).toUpperCase() + calendarView.slice(1)} view is coming soon in this demo.</div>`;
    }
}

function switchCalendarView(view) {
    calendarView = view;
    document.querySelectorAll('.switcher-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === view);
    });
    renderCalendar();
}

function handleEventDrop(eventId, newDay) {
    const event = events.find(e => e.id == eventId);
    if (event) {
        event.start = `2026-04-${newDay < 10 ? '0' + newDay : newDay}T${event.start.split('T')[1]}`;
        renderCalendar();
    }
}

function handleCreateEvent(event) {
    event.preventDefault();
    const title = document.getElementById('event-title').value;
    const start = document.getElementById('event-start').value;
    const end = document.getElementById('event-end').value;
    const category = document.getElementById('event-category').value;

    if (checkConflicts(start, end)) {
        const warning = document.getElementById('conflict-warning');
        warning.classList.remove('hidden');
        setTimeout(() => warning.classList.add('hidden'), 5000);
        return;
    }

    const newEvent = {
        id: Date.now(),
        title,
        start,
        end,
        category
    };

    events.push(newEvent);
    closeModal('event-modal');
    renderCalendar();
}

function checkConflicts(start, end) {
    const newStart = new Date(start);
    const newEnd = new Date(end);

    return events.some(e => {
        const estart = new Date(e.start);
        const eend = new Date(e.end);
        return (newStart < eend && newEnd > estart);
    });
}

// Dashboard Interactions (re-binding)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    initIcons();
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('landing');
});

// Handle browser back/forward buttons (simplified)
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        navigateTo(event.state.view);
    }
});
