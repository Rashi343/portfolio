// API Client
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

const api = {
    // Projects
    getProjects: () => fetch(`${API_URL}/projects`).then(r => r.json()),
    createProject: (data) => fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json()),
    updateProject: (id, data) => fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteProject: (id) => fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE'
    }).then(r => r.json()),

    // Skills
    getSkills: () => fetch(`${API_URL}/skills`).then(r => r.json()),
    createSkill: (data) => fetch(`${API_URL}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteSkill: (id) => fetch(`${API_URL}/skills/${id}`, {
        method: 'DELETE'
    }).then(r => r.json()),

    // Messages
    getMessages: () => fetch(`${API_URL}/messages`).then(r => r.json()),
    createMessage: (data) => fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json()),

    // About
    getAbout: () => fetch(`${API_URL}/about`).then(r => r.json()),
    updateAbout: (data) => fetch(`${API_URL}/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json()),

    // Settings
    getSettings: () => fetch(`${API_URL}/settings`).then(r => r.json()),
    updateSettings: (data) => fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json())
};
