import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import AddStaff from './AddStaff';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, filterRole, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3001/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // Filter out admin users for display (show only staff and customers)
      const filteredData = data.filter(user => user.role !== 'admin');
      setUsers(filteredData);
    } catch (err) {
      setError(err.message || 'Error loading users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'all' || user.role === filterRole;

      return matchesSearch && matchesRole;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'username':
          return a.username.localeCompare(b.username);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const getStaffCount = () => {
    return users.filter(user => user.role === 'staff').length;
  };

  const getCustomerCount = () => {
    return users.filter(user => user.role === 'customer').length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'staff':
        return 'badge-staff';
      case 'customer':
        return 'badge-customer';
      default:
        return 'badge-default';
    }
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading-message">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>👥 User Management</h1>
        <p className="user-management-subtitle">Manage all customers and staff members</p>
      </div>

      {error && (
        <div className="user-management-error" role="alert">
          {error}
          <button onClick={fetchUsers} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-label">Total Users</div>
          <div className="summary-value">{users.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Staff Members</div>
          <div className="summary-value">{getStaffCount()}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Customers</div>
          <div className="summary-value">{getCustomerCount()}</div>
        </div>
        <button 
          className="add-staff-btn"
          onClick={() => setShowAddStaffModal(true)}
          title="Add a new staff member"
        >
          ➕ Add Staff
        </button>
      </div>

      {/* Controls */}
      <div className="user-management-controls">
        <div className="control-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search users"
          />
        </div>

        <div className="control-group">
          <label>Filter by role:</label>
          <select
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            aria-label="Filter by user role"
          >
            <option value="all">All Users</option>
            <option value="staff">Staff Only</option>
            <option value="customer">Customers Only</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort users"
          >
            <option value="name">Full Name</option>
            <option value="username">Username</option>
            <option value="role">Role</option>
            <option value="email">Email</option>
            <option value="created">Newest First</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="user-table-wrapper">
        {filteredUsers.length === 0 ? (
          <div className="no-results">
            No users found matching your search
          </div>
        ) : (
          <table className="user-table" aria-label="Users table">
            <thead>
              <tr>
                <th className="col-name">Full Name</th>
                <th className="col-username">Username</th>
                <th className="col-email">Email</th>
                <th className="col-role">Role</th>
                <th className="col-joined">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`row-${user.role}`}>
                  <td className="col-name">
                    <strong>{user.fullName}</strong>
                  </td>
                  <td className="col-username">
                    <code>{user.username}</code>
                  </td>
                  <td className="col-email">{user.email}</td>
                  <td className="col-role">
                    <span className={`role-badge ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="col-joined">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="user-management-footer">
        <p>Showing {filteredUsers.length} of {users.length} users</p>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <AddStaff 
          onStaffAdded={() => {
            setShowAddStaffModal(false);
            fetchUsers();
          }}
          onCancel={() => setShowAddStaffModal(false)}
        />
      )}
    </div>
  );
}

export default UserManagement;
