const API_URL = '/api/tutorias';
const AUTH_URL = '/api/auth';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const login = async (username, password) => {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Error de autenticación');
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getTutorias = async () => {
    const response = await fetch(API_URL, { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al cargar las tutorías');
    return response.json();
};

export const createTutoria = async (tutoria) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(tutoria),
    });
    if (!response.ok) throw new Error('Error al crear la tutoría');
    return response.json();
};

export const updateTutoria = async (id, tutoria) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(tutoria),
    });
    if (!response.ok) throw new Error('Error al actualizar la tutoría');
    return response.json();
};

export const deleteTutoria = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar la tutoría');
};

export const getTutores = async () => {
    const response = await fetch('/api/tutores', { headers: getHeaders() });
    if (!response.ok) throw new Error('Error al cargar los tutores');
    return response.json();
};

export const asignarTutor = async (tutoriaId, tutorId) => {
    const response = await fetch(`${API_URL}/${tutoriaId}/asignar/${tutorId}`, {
        method: 'PUT',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al asignar el tutor');
    return response.json();
};

export const completarTutoria = async (tutoriaId) => {
    const response = await fetch(`${API_URL}/${tutoriaId}/completar`, {
        method: 'PUT',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al completar la tutoría');
    return response.json();
};
