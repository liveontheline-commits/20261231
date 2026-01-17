import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import FindLoads from './pages/FindLoads';
import MyShipments from './pages/MyShipments';
import MyFleet from './pages/MyFleet';
import MyJobs from './pages/MyJobs';
import AdminPanel from './pages/AdminPanel';
import AddressBook from './pages/AddressBook';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import TrustSafety from './pages/TrustSafety';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import TeamManagement from './pages/TeamManagement';
import JobWizard from './pages/JobWizard';
import PostEmptyVehicle from './pages/PostEmptyVehicle';
import Financials from './pages/Financials';
import Reports from './pages/Reports';
import DashboardLayout from './components/DashboardLayout';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { LanguageProvider } from './context/LanguageContext';

function App() {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Protected Route Wrapper with Dashboard Layout
    const ProtectedRoute = ({ children }) => {
        if (!user) return <Navigate to="/login" />;
        return <DashboardLayout>{children}</DashboardLayout>;
    };

    return (
        <LanguageProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 font-sans">
                    <Navbar />
                    {/* Add padding-top to account for fixed Navbar */}
                    <main className="pt-20">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />

                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                            <Route path="/find-loads" element={<ProtectedRoute><FindLoads /></ProtectedRoute>} />
                            <Route path="/my-shipments" element={<ProtectedRoute><MyShipments /></ProtectedRoute>} />
                            <Route path="/my-fleet" element={<ProtectedRoute><MyFleet /></ProtectedRoute>} />
                            <Route path="/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
                            <Route path="/address-book" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
                            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

                            <Route path="/how-it-works" element={<HowItWorks />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/trust-safety" element={<TrustSafety />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/careers" element={<Careers />} />
                            <Route path="/contact" element={<Contact />} />

                            {/* Enterprise Routes */}
                            <Route path="/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
                            <Route path="/create-job-wizard" element={<ProtectedRoute><JobWizard /></ProtectedRoute>} />
                            <Route path="/empty-vehicle" element={<ProtectedRoute><PostEmptyVehicle /></ProtectedRoute>} />
                            <Route path="/financials" element={<ProtectedRoute><Financials /></ProtectedRoute>} />
                            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </LanguageProvider>
    );
}

export default App;
