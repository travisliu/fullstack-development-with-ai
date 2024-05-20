// src/components/LoginForm.js

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Ensure the path is correct based on your project structure

/**
 * LoginForm Component.
 *
 * This component renders a login form.
 *
 * @component
 *
 * @example
 * return (
 *   <LoginForm />
 * )
 *
 * @data-testid
 * 
 * - `LoginForm-form`: This attribute is used to select the form element. Useful for simulating form submission events.
 * - `LoginForm-usernameGroup`: This attribute is used to select the div that groups the username label and input field. Useful for checking if the username input field is rendered correctly.
 * - `LoginForm-usernameInput`: This attribute is used to select the username input field. Useful for simulating user input events for the username field.
 * - `LoginForm-passwordGroup`: This attribute is used to select the div that groups the password label and input field. Useful for checking if the password input field is rendered correctly.
 * - `LoginForm-passwordInput`: This attribute is used to select the password input field. Useful for simulating user input events for the password field.
 * - `LoginForm-error`: This attribute is used to select the error message. Useful for checking if the error message is rendered correctly when there is an error.
 * - `LoginForm-submitButton`: This attribute is used to select the submit button. Useful for simulating click events on the submit button.
 */
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    await login(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="form-signin" data-testid="LoginForm-form">
      <div className="form-group" data-testid="LoginForm-usernameGroup">
        <label htmlFor="inputUsername" className="sr-only">Username</label>
        <input type="text" id="inputUsername" className="form-control" placeholder="Username" required autoFocus
               value={username} onChange={(e) => setUsername(e.target.value)} data-testid="LoginForm-usernameInput" />
      </div>
      <div className="form-group" data-testid="LoginForm-passwordGroup">
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required
               value={password} onChange={(e) => setPassword(e.target.value)} data-testid="LoginForm-passwordInput" />
      </div>
      {error && <div className="alert alert-danger" role="alert" data-testid="LoginForm-error">{error}</div>}
      <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={isLoading} data-testid="LoginForm-submitButton">
        {isLoading ? 'Logging in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
