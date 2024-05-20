// pages/admin/users/[id]/edit.js
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import UserForm from '@/components/Users/UserForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import UserService from '@/services/userService';
import Link from 'next/link';

const UserEditPage = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState({});
  const [error, setError] = useState(null); // Add error state
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchUser = async () => {
      const data = await UserService.getUser(id, currentUser.token);
      setUser(data);
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleSave = async () => {
    console.log('=== handleSave ===', user);
    try {
      await UserService.updateUser(id, user, currentUser.token);
    } catch (error) {
      console.error('Failed to update user:', error);
      setError(error.message);
    }
    router.push('/users');
  };

  const handleChange = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <AdminLayout>
      <section className="content-header">
        <h1>Edit User</h1>
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
            <button onClick={handleSave} className="btn btn-success">Save</button>
            <Link href="/admin/users" passHref>
              <button className="btn btn-default">Cancel</button>
            </Link>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default UserEditPage;