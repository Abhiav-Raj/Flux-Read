import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon as Lock } from '@radix-ui/react-icons';
import { Button, Theme } from '@radix-ui/themes';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!data.email || !data.password) {
      toast.error('All fields are required');
      return;
    }
  
    try {
      setLoading(true);
  
      // Debugging log: Check the values of email and password being sent
      console.log("Sending Login Request with data:", data);
  
      const response = await axios.post('http://localhost:8000/admin/login', 
        { email: data.email, password: data.password },
        { withCredentials: true } // Ensures cookies/sessions work
      );
  
      // Debugging log: Check the response data from the server
      console.log("Response Data:", response.data);
  
      localStorage.setItem('user', JSON.stringify(response.data));
  
      if (response.status === 200) {
        toast.success('User Login successful');
        navigate('/');
        setData({ email: '', password: '' });
      } 
  
    } catch (error) {
      console.error('Login error:', error);
  
      if (error.response) {
        // Debugging log: Print the error response data
        console.log("Error Response Data:", error.response.data);
        toast.error('Login failed: ' + (error.response.data.message || 'Unknown error'));
      } else {
        toast.error('Network Error: Unable to reach the server');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Theme>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-96">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-indigo-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Email address"
                onChange={handleChange}
                value={data.email}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                placeholder="Password"
                onChange={handleChange}
                value={data.password}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </Theme>
  );
};

export default Login;
