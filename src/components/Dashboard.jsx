import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import * as api from '../Api/api';

/**
 * COMPOSANT CONTENEUR : Dashboard
 * Rôle : Gère la logique métier du tableau de bord (chargement, suppression, navigation)
 * Présentation : Délègue l'affichage au composant DashboardView (pages/DashboardPage.jsx)
 */
export default function Dashboard() {

  // ========== ÉTAT ET HOOKS ==========
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);


  // ========== CHARGEMENT INITIAL ==========
  useEffect(() => {
    loadChecklists();
  }, []);

  // ========== FONCTIONS DE GESTION DES DONNÉES ==========
  
  // Charge toutes les checklists depuis l'API
  async function loadChecklists() {
    try {
      setLoading(true);
      const data = await api.getAllChecklists();
      const checklistsWithStatus = data.map(checklist => ({
        ...checklist,
        status: checklist.statut ?? checklist.status ?? 0
      }));
      setChecklists(checklistsWithStatus);
    } catch (error) {
      console.error('Error loading checklists:', error);
      setChecklists([]);
    } finally {
      setLoading(false);
    }
  }

  // Supprime une checklist après confirmation
  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this checklist?');
    
    if (confirmed) {
      try {
        await api.deleteChecklist(id);
        await loadChecklists();
      } catch (error) {
        console.error('Error deleting checklist:', error);
      }
    }
  }

  // ========== FONCTIONS DE NAVIGATION ==========
  
  function handleView(id) {
    navigate(`/checklist/${id}`);
  }

  function handleEdit(id) {
    navigate(`/edit/${id}`);
  }

  function handleNew() {
    navigate('/new');
  }


  // ========== RENDU ==========
  return (
    <DashboardPage
      checklists={checklists}
      loading={loading}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNew={handleNew}
    />
  );
}
