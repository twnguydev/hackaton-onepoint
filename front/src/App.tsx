import React from 'react';
import Analyse from './pages/Analyse';
import AdminDashboard from './pages/AdminDashboard';
 
export default function App() {
  return (
    <div className="bg-[#111827] pt-20">
      <Analyse />
      <AdminDashboard />
    </div>
  );
}