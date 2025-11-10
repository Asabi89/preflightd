import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Checklist from './components/Checklist';
import Form from './components/Form';
import './assets/css/App.css'
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checklist/:id" element={<Checklist />} />
          <Route path="/new" element={<Form />} />
          <Route path="/edit/:id" element={<Form />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}