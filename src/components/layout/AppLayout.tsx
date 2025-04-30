
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Activity, BarChart3, Home, Users, FileText } from 'lucide-react';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-healthcare-700 flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <span>Patient Cost Compass</span>
          </h1>
        </div>
        <nav className="p-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'bg-healthcare-100 text-healthcare-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/patients" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'bg-healthcare-100 text-healthcare-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Users size={18} />
            <span>Patients</span>
          </NavLink>
          <NavLink 
            to="/expenses" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'bg-healthcare-100 text-healthcare-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <FileText size={18} />
            <span>Expenses</span>
          </NavLink>
          <NavLink 
            to="/reports" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'bg-healthcare-100 text-healthcare-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <BarChart3 size={18} />
            <span>Reports</span>
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white p-4 border-b shadow-sm">
          <div className="container mx-auto">
            <h2 className="text-xl font-semibold text-gray-800">
              Patient Cost Tracking
            </h2>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
