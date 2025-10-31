// API configuration
const API_URL = 'https://greenvelvet.alwaysdata.net/pfc';
const TOKEN = '285cf61c89c0bf8a86dc69dfa741b9a9c08cf671';

// Get all checklists
export async function getAllChecklists() {
  const response = await fetch(`${API_URL}/checklists`, {
    headers: { 'token': TOKEN }
  });
  const data = await response.json();
  return data.response || [];
}

// Get one checklist by id
export async function getChecklist(id) {
  const response = await fetch(`${API_URL}/checklist?id=${id}`, {
    headers: { 'token': TOKEN }
  });
  return await response.json();
}

// Create a new checklist
export async function createChecklist(checklistData) {
  const response = await fetch(`${API_URL}/checklist/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': TOKEN
    },
    body: JSON.stringify(checklistData)
  });
  return await response.json();
}

// Update existing checklist
export async function updateChecklist(id, checklistData) {
  const response = await fetch(`${API_URL}/checklist/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': TOKEN
    },
    body: JSON.stringify({ id, ...checklistData })
  });
  return await response.json();
}

// Delete a checklist
export async function deleteChecklist(id) {
  const response = await fetch(`${API_URL}/checklist/delete?id=${id}`, {
    headers: { 'token': TOKEN }
  });
  return await response.json();
}

// Update checklist status (0: new, 1: in progress, 2: completed)
export async function updateStatus(id, status) {
  const response = await fetch(`${API_URL}/checklist/statut?id=${id}&statut=${status}`, {
    headers: { 'token': TOKEN }
  });
  return await response.json();
}
