import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'customer', 'seller', 'admin'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/user/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    // Filter by role first
    let roleMatch = true;
    if (filter === 'customer') {
      roleMatch = user.roleId?.name === 'CUSTOMER' || user.roleId?.name === 'User';
    } else if (filter === 'seller') {
      roleMatch = user.roleId?.name === 'SELLER' || user.roleId?.name === 'Vendor';
    } else if (filter === 'admin') {
      roleMatch = user.roleId?.name === 'ADMIN';
    }

    // Then filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        roleMatch && (
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.phoneNumber && user.phoneNumber.toLowerCase().includes(term)) ||
          (user.roleId?.name && user.roleId.name.toLowerCase().includes(term))
        )
      );
    }

    return roleMatch;
  });

  const getRoleBadge = (roleName) => {
    switch(roleName) {
      case 'Admin':
        return 'bg-danger';
      case 'Seller':
      case 'Vendor':
        return 'bg-warning text-dark';
      case 'Customer':
      case 'User':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">User Management</h1>
        <Link to="/admin/users/add" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>
          Add New User
        </Link>
      </div> */}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="userFilter" className="form-label">Filter by Role</label>
              <select 
                id="userFilter"
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="seller">Sellers</option>
                <option value="customer">Customers</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="searchUser" className="form-label">Search</label>
              <input 
                type="text" 
                id="searchUser" 
                className="form-control" 
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <img 
                        src={user.profilePicture || '/default-profile.png'} 
                        alt={user.name}
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getRoleBadge(user.roleId?.name)}`}>
                        {user.roleId?.name || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status ? 'bg-success' : 'bg-danger'}`}>
                        {user.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* <Link 
                          to={`/admin/users/${user._id}`} 
                          className="btn btn-sm btn-primary"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </Link> */}
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="alert alert-info mt-3">
          No users found matching your criteria.
        </div>
      )}

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="text-muted">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        {/* Pagination would go here */}
      </div>
    </div>
  );
};