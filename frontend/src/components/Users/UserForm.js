// components/UserEditForm.js
import React from 'react';

const UserForm = ({ user, onChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...user, [name]: value });
  };

  return (
    <form className="form-horizontal">
      <div className="form-group">
        <label htmlFor="username" className="col-sm-2 control-label">Username</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={user.username || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="col-sm-2 control-label">Email</label>
        <div className="col-sm-10">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="role" className="col-sm-2 control-label">Role</label>
        <div className="col-sm-10">
          <select
            className="form-control"
            id="role"
            name="role"
            value={user.role || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password" className="col-sm-2 control-label">Password</label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={user.password || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Add other fields as necessary */}
    </form>
  );
};

export default UserForm;
