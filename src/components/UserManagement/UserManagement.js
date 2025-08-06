// import React, { useState, useEffect } from "react";
// import "./UserManagement.css";

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formValues, setFormValues] = useState({
//     name: "",
//     username: "",
//     email: "",
//     mobile_number: "",
//     password: "",
//     panchyat: "Jamtara",
//     village: "Jamtara",
//     department: "",
//     is_recptionstaff: false,
//     is_candidate: false,
//     is_staff: true,
//     is_superuser: false,
//     is_jantadarbar: false,
//   });

//   useEffect(() => {
//     fetchUsers();
//     fetchDepartments();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://127.0.0.1:8000/api/users/", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch users");
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error(error);
//       alert("Error fetching users");
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://127.0.0.1:8000/api/departments/", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch departments");
//       const data = await response.json();
//       setDepartments(data);
//     } catch (error) {
//       console.error(error);
//       alert("Error fetching departments");
//     }
//   };

//   const openModal = (user = null) => {
//     setEditingUser(user);
//     setIsModalVisible(true);
//     setFormValues(
//       user || {
//         name: "",
//         username: "",
//         email: "",
//         mobile_number: "",
//         password: "",
//         panchyat: "Jamtara",
//         village: "Jamtara",
//         department: "",
//         is_recptionstaff: false,
//         is_candidate: false,
//         is_staff: true,
//         is_superuser: false,
//         is_jantadarbar: false,
//       }
//     );
//   };

//   const closeModal = () => {
//     setIsModalVisible(false);
//     setEditingUser(null);
//     setFormValues({
//       name: "",
//       username: "",
//       email: "",
//       mobile_number: "",
//       password: "",
//       panchyat: "Jamtara",
//       village: "Jamtara",
//       department: "",
//       is_recptionstaff: false,
//       is_candidate: false,
//       is_staff: true,
//       is_superuser: false,
//       is_jantadarbar: false,
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormValues((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const method = editingUser ? "PUT" : "POST";
//       const url = editingUser
//         ? `http://127.0.0.1:8000/api/users/${editingUser.id}/`
//         : "http://127.0.0.1:8000/api/signup/";

//       const token = localStorage.getItem("token");

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formValues),
//       });

//       if (!response.ok) throw new Error("Failed to save user");

//       await fetchUsers();
//       closeModal();
//       alert(editingUser ? "User updated successfully" : "User added successfully");
//     } catch (error) {
//       console.error(error);
//       alert("Error saving user");
//     }
//   };

//   const deleteUser = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to delete user");
//       await fetchUsers();
//       alert("User deleted successfully");
//     } catch (error) {
//       console.error(error);
//       alert("Error deleting user");
//     }
//   };

//   const getDepartmentNameFromList = (id) => {
//     const dept = departments.find((d) => d.id === id);
//     return dept ? dept.name : "—";
//   };

//   return (
//     <div className="user-management">
//       <h2>User Management</h2>
//       <button className="add-user-btn" onClick={() => openModal()}>
//         Add User
//       </button>
//       <table className="user-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Mobile</th>
//             <th>Department</th>
//             <th>Roles</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.name}</td>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>{user.mobile_number}</td>
//               <td>{getDepartmentNameFromList(user.department)}</td>
//               <td>
//                 {user.is_staff && "Officer"}
//                 {user.is_superuser && "Deputy Commissioner "}
//                 {user.is_recptionstaff && "Reception "}
//                 {user.is_candidate && "Applicant"} 
//                 {user.is_jantadarbar&& " Janta Darbar"}
//               </td>
//               <td>
//                 <button className="edit-btn" onClick={() => openModal(user)}>
//                   Edit
//                 </button>
//                 <button className="delete-btn" onClick={() => deleteUser(user.id)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {isModalVisible && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>{editingUser ? "Edit User" : "Add User"}</h3>
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="User Name"
//                 value={formValues.name}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Login User ID"
//                 value={formValues.username}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="User Email"
//                 value={formValues.email}
//                 onChange={handleInputChange}
//                 required
//                 pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
//                 title="Enter a valid email address (e.g., example@domain.com)"
//               />
//               <input
//                 type="text"
//                 name="mobile_number"
//                 placeholder="Mobile Number"
//                 value={formValues.mobile_number}
//                 onChange={handleInputChange}
//                 required
//                 pattern="[6-9][0-9]{9}"
//                 maxLength="10"
//                 title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
//               />
//               {/* <input
//                 type="text"
//                 name="mobile_number"
//                 placeholder="Mobile Number"
//                 value={formValues.mobile_number}
//                 onChange={handleInputChange}
//                 required
//               /> */}
//               <select
//                 name="department"
//                 value={formValues.department}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>

//               {!editingUser && (
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={formValues.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               )}

//               {/* Boolean Roles */}
//               <label>
//                 <input
//                   type="checkbox"
//                   name="is_staff"
//                   checked={formValues.is_staff}
//                   onChange={handleInputChange}
//                 />
//                 Department Staff
//               </label>
//               {/* <label>
//                 <input
//                   type="checkbox"
//                   name="is_superuser"
//                   checked={formValues.is_superuser}
//                   onChange={handleInputChange}
//                 />
//                 Superuser
//               </label> */}
//               <label>
//                 <input
//                   type="checkbox"
//                   name="is_recptionstaff"
//                   checked={formValues.is_recptionstaff}
//                   onChange={handleInputChange}
//                 />
//                 Reception Staff
//               </label>
//                <label>
//                 <input
//                   type="checkbox"
//                   name="is_jantadarbar"
//                   checked={formValues.is_jantadarbar}
//                   onChange={handleInputChange}
//                 />
//                 Janta Darbar ID
//               </label> 

//               <button type="submit" className="save-btn">
//                 {editingUser ? "Update" : "Add"}
//               </button>
//               <button type="button" className="cancel-btn" onClick={closeModal}>
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;
import React, { useState, useEffect } from "react";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    email: "",
    mobile_number: "",
    password: "",
    panchyat: "Jamtara",
    village: "Jamtara",
    department: "",
    is_recptionstaff: false,
    is_candidate: false,
    is_staff: true,
    is_superuser: false,
    is_jantadarbar: false,
  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/users/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching users");
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/departments/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching departments");
    }
  };

  const filterUsers = () => {
    if (roleFilter === "all") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => {
        switch (roleFilter) {
          case "officer":
            return user.is_staff;
          case "deputy":
            return user.is_superuser;
          case "reception":
            return user.is_recptionstaff;
          case "applicant":
            return user.is_candidate;
          case "janta":
            return user.is_jantadarbar;
          default:
            return true;
        }
      });
      setFilteredUsers(filtered);
    }
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    setFormValues(
      user || {
        name: "",
        username: "",
        email: "",
        mobile_number: "",
        password: "",
        panchyat: "Jamtara",
        village: "Jamtara",
        department: "",
        is_recptionstaff: false,
        is_candidate: false,
        is_staff: true,
        is_superuser: false,
        is_jantadarbar: false,
      }
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    setFormValues({
      name: "",
      username: "",
      email: "",
      mobile_number: "",
      password: "",
      panchyat: "Jamtara",
      village: "Jamtara",
      department: "",
      is_recptionstaff: false,
      is_candidate: false,
      is_staff: true,
      is_superuser: false,
      is_jantadarbar: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `http://127.0.0.1:8000/api/users/${editingUser.id}/`
        : "http://127.0.0.1:8000/api/signup/";

      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) throw new Error("Failed to save user");

      await fetchUsers();
      closeModal();
      alert(editingUser ? "User updated successfully" : "User added successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving user");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");
      await fetchUsers();
      alert("User deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  const getDepartmentNameFromList = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "—";
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="filter-controls">
        <button className="add-user-btn" onClick={() => openModal()}>
          Add User
        </button>
        <div className="role-filter">
          <label htmlFor="role-filter-select">Filter by Role:</label>
          <select
            id="role-filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="officer">Officers</option>
            <option value="deputy">Deputy Commissioners</option>
            <option value="reception">Reception Desk</option>
            <option value="applicant">Applicants</option>
            <option value="janta">Janta Darbar</option>
          </select>
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.mobile_number}</td>
              <td>{getDepartmentNameFromList(user.department)}</td>
              <td>
                {user.is_staff && "Officer "}
                {user.is_superuser && "Deputy Commissioner "}
                {user.is_recptionstaff && "Reception "}
                {user.is_candidate && "Applicant "}
                {user.is_jantadarbar && "Janta Darbar"}
              </td>
              <td>
                <button className="edit-btn" onClick={() => openModal(user)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingUser ? "Edit User" : "Add User"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="User Name"
                value={formValues.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Login User ID"
                value={formValues.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="User Email"
                value={formValues.email}
                onChange={handleInputChange}
                required
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Enter a valid email address (e.g., example@domain.com)"
              />
              <input
                type="text"
                name="mobile_number"
                placeholder="Mobile Number"
                value={formValues.mobile_number}
                onChange={handleInputChange}
                required
                pattern="[6-9][0-9]{9}"
                maxLength="10"
                title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
              />
              <select
                name="department"
                value={formValues.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              {!editingUser && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  required
                />
              )}

              <label>
                <input
                  type="checkbox"
                  name="is_staff"
                  checked={formValues.is_staff}
                  onChange={handleInputChange}
                />
                Department Staff
              </label>
              <label>
                <input
                  type="checkbox"
                  name="is_recptionstaff"
                  checked={formValues.is_recptionstaff}
                  onChange={handleInputChange}
                />
                Reception Staff
              </label>
              <label>
                <input
                  type="checkbox"
                  name="is_jantadarbar"
                  checked={formValues.is_jantadarbar}
                  onChange={handleInputChange}
                />
                Janta Darbar ID
              </label>

              <button type="submit" className="save-btn">
                {editingUser ? "Update" : "Add"}
              </button>
              <button type="button" className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;