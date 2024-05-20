import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="float-right d-none d-sm-inline">
        Anything you want
      </div>
      <strong>Copyright &copy; 2020-{new Date().getFullYear()} Your Company Name.</strong> All rights reserved.
    </footer>
  );
};

export default Footer;
