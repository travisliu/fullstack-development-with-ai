import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * AdminLayout component.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @filesource @/components/Layout/AdminLayout.js
 */
const AdminLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="wrapper ">
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        {isAuthenticated ? (
          children
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
