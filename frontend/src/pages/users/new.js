import UserForm from '@/components/Users/UserForm';
import AdminLayout from '@/components/Layout/AdminLayout';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import UserService from '@/services/userService';
import Link from 'next/link';

// pages/admin/users/new.js

const NewUserPage = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState({});
  const [error, setError] = useState(null); // Add error state
  const router = useRouter();

  const handleSave = async () => {
    try {
      await UserService.createUser(user, currentUser.token);
      router.push('/users');
    } catch (error) {
      console.error('Failed to create user:', error);
      setError(error.message);
    }
  };

  const handleChange = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <AdminLayout>
      <section className="content-header">
        <h1>Create New User</h1>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-body">
            { error && (
              <div className="alert alert-danger">
                {error.split('\n').map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </div>
            )}
            <UserForm user={user} onChange={handleChange} />
            <button onClick={handleSave} className="btn btn-success">Create</button>
            <Link href="/admin/users" passHref>
              <button className="btn btn-default">Cancel</button>
            </Link>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default NewUserPage;
