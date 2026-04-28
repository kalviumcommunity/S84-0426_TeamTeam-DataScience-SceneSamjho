import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import AdminPortal from './pages/AdminPortal';
import { AnalyticsDashboard } from './features/analytics';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/admin" replace />} />
            <Route path="admin" element={<AdminPortal />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
