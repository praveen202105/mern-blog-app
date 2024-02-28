import React, { useState,useEffect } from 'react';
import axios from 'axios';
const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Extract token parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get('token');
    // console.log(tokenParam)
    setToken(tokenParam);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm new password must match');
      return;
    }
  
    // Call your API endpoint to set the new password
    try {
      const response = await axios.post("http://localhost:5000/api/v1/user/forgot-password/verify", { password: newPassword, token });
      console.log(response.data);
      console.log(response.status); // Log the status code
  
      if (response.status === 200) {
        console.log('Password updated successfully');
        // Optionally, redirect to login page or display a success message
      } else {
        console.error('Failed to update password');
        // Optionally, display an error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Set New Password</h2>
              <form onSubmit={handleSubmit} >
                <div className="form-group">
                  <label htmlFor="newPassword">New Password:</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="newPassword" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="confirmNewPassword" 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
