import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Classes from './pages/Classes.jsx';
import Schedule from './pages/Schedule.jsx';
import Membership from './pages/Membership.jsx';

import AdminLogin from './pages/admin/Login.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import BookingsManage from './pages/admin/BookingsManage.jsx';
import ClassesManage from './pages/admin/ClassesManage.jsx';
import TrainersManage from './pages/admin/TrainersManage.jsx';
import EnquiriesManage from './pages/admin/EnquiriesManage.jsx';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/classes" element={<PublicLayout><Classes /></PublicLayout>} />
      <Route path="/schedule" element={<PublicLayout><Schedule /></PublicLayout>} />
      <Route path="/membership" element={<PublicLayout><Membership /></PublicLayout>} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<BookingsManage />} />
        <Route path="classes" element={<ClassesManage />} />
        <Route path="trainers" element={<TrainersManage />} />
        <Route path="enquiries" element={<EnquiriesManage />} />
      </Route>
    </Routes>
  );
}
