
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Frontend from './components/Frontend';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { AdminToggleIcon, CloseIcon } from './components/icons';

function AppContent() {
  const { isLoggedIn } = useAppContext();
  const [isAdminView, setIsAdminView] = useState(false);

  return (
    <div className="relative antialiased text-slate-700">
      <button
        onClick={() => setIsAdminView(!isAdminView)}
        className="fixed bottom-5 right-5 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-700 transition-transform transform hover:scale-110"
        aria-label="Toggle Admin Panel"
      >
        {isAdminView ? <CloseIcon /> : <AdminToggleIcon />}
      </button>

      {isAdminView ? 
        (isLoggedIn ? <AdminPanel /> : <Login setIsAdminView={setIsAdminView} />) 
        : <Frontend />
      }
    </div>
  );
}


function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
