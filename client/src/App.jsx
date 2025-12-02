import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { RealTimeProvider } from './components/RealTimeProvider';
import AIChatbot from './components/AIChatbot';
import { ToastProvider } from './components/Toast';
import CommandPalette from './components/CommandPalette';

function App() {
  return (
    <ToastProvider>
      <RealTimeProvider>
        <Router>
          <CommandPalette />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                  <AIChatbot />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </RealTimeProvider>
    </ToastProvider>
  );
}

export default App;
