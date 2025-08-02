import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminDasboard.css';

import Header from '../Header/Header';
import Menubar from '../HeaderMenu/HeaderMenu';
import AdminSidePanel from '../AdminSidePanel/AdminSidePanel';
import AdminDefaultDashboard from '../AdminDefaultDashboard/AdminDefaultDashboard';
import UserProfile from '../Profile/Profile';
import UpdatePassword from '../PasswordUpdate/PasswordUpdate';
import AdminComplaints from '../AdminComplaints/AdminComplaints';
import UserManagement from '../UserManagement/UserManagement';
import DepartmentManagement from '../DepartmentManagement/DepartmentManagement';
import SuperAdminComplaintsView from '../SuperAdminComplaintsView/SuperAdminComplaintsView';
import SolvedComplaints from '../SolvedComplaints/SolvedComplaints';


const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('menu-item-1');
  const [isSessionExpired, setSessionExpired] = useState(false);
  const [totalForms, setTotalForms] = useState(0);
  const [applicationsPerPost, setApplicationsPerPost] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobApplicationsCount = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/job-applications/count/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        setTotalForms(data.total_applications);
        setApplicationsPerPost(data.applications_per_post);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobApplicationsCount();
  }, []);

  const handleMenuClick = (menuItem) => {
    setSelectedMenu(menuItem);
  };

  const renderContent = () => {
    if (isSessionExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('user_details');
      navigate('/sessionexpires');
      return null;
    }

    switch (selectedMenu) {
      case 'menu-item-1':
      case 'menu-item-5':
      case 'menu-item-7':
        return <AdminDefaultDashboard />;
      case 'menu-item-2':
        return <UserProfile />;
      case 'menu-item-3':
        return <UpdatePassword />;
      case 'menu-item-4':
        return <AdminComplaints />;
      case 'menu-item-6':
        return <UserManagement />;
      case 'menu-item-8':
        return <DepartmentManagement />;
      case 'menu-item-9':
        return <SuperAdminComplaintsView />;
      case 'menu-item-10':
        return <SolvedComplaints />;
      
      default:
        return <AdminDefaultDashboard />;
    }
  };

  return (
    <div className="layout-container">
      <Header className="no-print" />
      <Menubar className="no-print" />
      <div className="main-content">
        <AdminSidePanel onMenuClick={handleMenuClick} className="side-panel no-print" />
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
