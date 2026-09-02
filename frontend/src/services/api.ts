import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const fetchHazards = () => axios.get(`${API_BASE}/hazards`).then(res => res.data);
export const fetchHabitations = () => axios.get(`${API_BASE}/habitations`).then(res => res.data);
export const fetchSafeZones = () => axios.get(`${API_BASE}/safezones`).then(res => res.data);
export const fetchRelocationPlan = () => axios.get(`${API_BASE}/relocation-plan`).then(res => res.data);
