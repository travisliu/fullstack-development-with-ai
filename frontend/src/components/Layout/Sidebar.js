import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Sidebar - Brand Logo */}
      <a href="/" className="brand-link">
        <span className="brand-text font-weight-light">FeatureFlags Dashboard</span>
      </a>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* Add items here */}
            <li className="nav-item">
              <Link href="/featureflags" className="nav-link">
                  <i className="nav-icon fas fa-flag"></i>
                  <p>Feature Flags</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/segments" className="nav-link">
                  <i className="nav-icon fas fa-users"></i>
                  <p>Segments</p>
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link href="/users" className="nav-link">
                  <i className="nav-icon fas fa-cog"></i>
                  <p>Users</p>
                </Link>
              </li>
            )}
            {/* More navigation items as needed */}
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};

export default Sidebar;
