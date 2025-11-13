// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
            
            sectionTitle.textContent = `Manage ${section.charAt(0).toUpperCase() + section.slice(1)}`;
            
            if (section === 'projects') loadProjects();
            if (section === 'skills') loadSkills();
            if (section === 'about') loadAbout();
            if (section === 'messages') loadMessages();
            if (section === 'settings') loadSettings();
        });
    });

    // Projects Management
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    const addProjectBtn = document.getElementById('add-project');

    addProjectBtn.addEventListener('click', () => {
        projectForm.reset();
        document.getElementById('project-id').value = '';
        document.getElementById('modal-title').textContent = 'Add Project';
        projectModal.classList.add('active');
    });

    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('project-id').value;
        
        const project = {
            name: document.getElementById('project-name').value,
            description: document.getElementById('project-desc').value,
            image: document.getElementById('project-image').value,
            tags: document.getElementById('project-tags').value.split(',').map(t => t.trim()),
            link: document.getElementById('project-link').value
        };

        try {
            if (id) {
                await api.updateProject(id, project);
            } else {
                await api.createProject(project);
            }
            projectModal.classList.remove('active');
            loadProjects();
        } catch (error) {
            alert('Error saving project');
        }
    });

    async function loadProjects() {
        try {
            const projects = await api.getProjects();
            const container = document.getElementById('projects-list');
            
            container.innerHTML = projects.map(p => `
                <div class="item-card">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="item-tags">
                        ${p.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editProject('${p._id}')">Edit</button>
                        <button class="btn-delete" onclick="deleteProject('${p._id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }



    window.editProject = async (id) => {
        try {
            const projects = await api.getProjects();
            const project = projects.find(p => p._id == id);
            
            document.getElementById('project-id').value = project._id;
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-desc').value = project.description;
            document.getElementById('project-image').value = project.image;
            document.getElementById('project-tags').value = project.tags.join(', ');
            document.getElementById('project-link').value = project.link;
            document.getElementById('modal-title').textContent = 'Edit Project';
            
            projectModal.classList.add('active');
        } catch (error) {
            alert('Error loading project');
        }
    };

    window.deleteProject = async (id) => {
        if (confirm('Delete this project?')) {
            try {
                await api.deleteProject(id);
                loadProjects();
            } catch (error) {
                alert('Error deleting project');
            }
        }
    };

    // Skills Management
    const skillModal = document.getElementById('skill-modal');
    const skillForm = document.getElementById('skill-form');
    const addSkillBtn = document.getElementById('add-skill');

    addSkillBtn.addEventListener('click', () => {
        skillForm.reset();
        skillModal.classList.add('active');
    });

    skillForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('skill-category').value;
        const name = document.getElementById('skill-name').value;
        
        try {
            await api.createSkill({ category, name });
            skillModal.classList.remove('active');
            loadSkills();
        } catch (error) {
            alert('Error adding skill');
        }
    });

    async function loadSkills() {
        try {
            const skills = await api.getSkills();
            const container = document.getElementById('skills-list');
            
            container.innerHTML = Object.keys(skills).map(category => `
                <div class="skill-category-card">
                    <h3>${category}</h3>
                    <ul>
                        ${skills[category].map(skill => `
                            <li>
                                ${skill.name}
                                <button class="btn-remove" onclick="removeSkill('${skill.id}')">×</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }

    window.removeSkill = async (id) => {
        try {
            await api.deleteSkill(id);
            loadSkills();
        } catch (error) {
            alert('Error removing skill');
        }
    };

    // About Section
    const aboutForm = document.getElementById('about-form');
    
    async function loadAbout() {
        try {
            const about = await api.getAbout();
            if (about.image) {
                document.getElementById('about-image').value = about.image;
                document.getElementById('about-bio1').value = about.bio1;
                document.getElementById('about-bio2').value = about.bio2;
            }
        } catch (error) {
            console.error('Error loading about:', error);
        }
    }

    aboutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.updateAbout({
                image: document.getElementById('about-image').value,
                bio1: document.getElementById('about-bio1').value,
                bio2: document.getElementById('about-bio2').value
            });
            alert('About section updated successfully!');
        } catch (error) {
            alert('Error updating about section');
        }
    });

    // Messages
    async function loadMessages() {
        try {
            const messages = await api.getMessages();
            const container = document.getElementById('messages-list');
            
            if (messages.length === 0) {
                container.innerHTML = '<p style="color: #64748b; text-align: center;">No messages yet.</p>';
                return;
            }
            
            container.innerHTML = messages.map(m => `
                <div class="message-card">
                    <div class="message-header">
                        <h3>${m.subject}</h3>
                        <span class="message-date">${new Date(m.date).toLocaleDateString()}</span>
                    </div>
                    <div class="message-info">From: ${m.name} (${m.email})</div>
                    <div class="message-body">${m.message}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    // Modal Close
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.remove('active');
            skillModal.classList.remove('active');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) projectModal.classList.remove('active');
        if (e.target === skillModal) skillModal.classList.remove('active');
    });

    // Logout
    document.querySelector('.btn-logout').addEventListener('click', () => {
        if (confirm('Logout?')) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
    });

    // Settings Section
    const settingsForm = document.getElementById('settings-form');
    
    async function loadSettings() {
        try {
            const settings = await api.getSettings();
            if (settings.favicon) {
                document.getElementById('settings-favicon').value = settings.favicon;
                document.getElementById('settings-title').value = settings.title;
                document.getElementById('settings-footer').value = settings.footer;
                document.getElementById('settings-github').value = settings.github || '';
                document.getElementById('settings-linkedin').value = settings.linkedin || '';
                document.getElementById('settings-twitter').value = settings.twitter || '';
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.updateSettings({
                favicon: document.getElementById('settings-favicon').value,
                title: document.getElementById('settings-title').value,
                footer: document.getElementById('settings-footer').value,
                github: document.getElementById('settings-github').value,
                linkedin: document.getElementById('settings-linkedin').value,
                twitter: document.getElementById('settings-twitter').value
            });
            alert('Settings updated successfully!');
        } catch (error) {
            alert('Error updating settings');
        }
    });

    // Initial Load
    loadProjects();
    loadAbout();
});
