import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './service/DashboardPage';
import ChecklistPage from './service/ChecklistPage';
import FormPage from './service/FormPage';
import './assets/css/App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/checklist/:id" element={<ChecklistPage />} />
          <Route path="/new" element={<FormPage />} />
          <Route path="/edit/:id" element={<FormPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}