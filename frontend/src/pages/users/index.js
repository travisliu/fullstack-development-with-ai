// pages/admin/users.js
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/userService';
import AdminLayout from '@/components/Layout/AdminLayout';

const UsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    const fetchedUsers = await UserService.getAllUsers(user.token);
    setUsers(fetchedUsers);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await UserService.deleteUser(userId, user.token);
      loadUsers(); // Reload the users list after deletion
    }
  };

  return (
    <AdminLayout>
      <section className="content-header">
        <h1>All Users</h1>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Management</h3>
            <Link href="/users/new" passHref>
              <button className="btn btn-primary" style={{ float: 'right' }}>Create New User</button>
            </Link>
          </div>
          {/* User Table */}
          <div className="card-body">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Link href={`/users/${user.userId}`} passHref>
                        <button className="btn btn-info btn-sm">Edit</button>
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.userId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default UsersPage;
