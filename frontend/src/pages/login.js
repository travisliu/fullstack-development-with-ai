// pages/login.js
import React from 'react';
import Head from 'next/head';
import LoginForm from '@/components/login/LoginForm';

const LoginPage = () => {
  return (
    <div>
      <Head>
        <title>Login | Admin Dashboard</title>
        {/* <link rel="stylesheet" href="/path/to/adminlte.min.css" /> Adjust the path as necessary */}
      </Head>
      <div className="login-page" style={{ backgroundColor: '#f4f6f9' }}>
        <div className="login-box">
          {/* <ServiceLogo /> */}
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
