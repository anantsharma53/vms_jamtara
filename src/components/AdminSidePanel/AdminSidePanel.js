import './AdminSidePanel.css';
import React, { useState, useEffect } from 'react';

const AdminSidePanel = ({ onMenuClick }) => {
  const [departments, setDepartments] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem('user_details') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/departments/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        alert('Error fetching departments');
      }
    };

    fetchDepartments();
  }, [token]);

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.name || '—';
  };

  const renderMenuItem = (label, id) => (
    <li onClick={() => onMenuClick(id)}>{label}</li>
  );

  return (
    <aside className="side-panel no-print">
      <img
        src="https://i0.wp.com/static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg?ssl=1"
        alt="User profile"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          marginLeft: '10px',
        }}
      />

      <nav>
        <ul>
          <li onClick={() => onMenuClick('menu-item-1')}>
            Welcome: {userDetails.name || 'User'}<br />
            Department: {getDepartmentName(userDetails.department)}
          </li>

          {renderMenuItem('Profile', 'menu-item-2')}
          {renderMenuItem('Password Reset', 'menu-item-3')}

          {userDetails.is_superuser && (
            <>
              {renderMenuItem('Manage Department', 'menu-item-8')}
              {renderMenuItem('Manage Users', 'menu-item-6')}
              {renderMenuItem('Manage Complaint', 'menu-item-9')}
              {renderMenuItem('Audit Logs', 'menu-item-7')}
            </>
          )}

          {userDetails.is_staff && (
            <>
              {renderMenuItem('View Complaints', 'menu-item-4')}
              {renderMenuItem('Accepts Complaints', 'menu-item-10')}
            </>
          )}
      

          {renderMenuItem('Complaint Summary', 'menu-item-5')}          
          {renderMenuItem('Contact Us', 'menu-item-7')}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidePanel;
