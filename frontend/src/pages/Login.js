import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-center items-center text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Job Tracker</h1>
        <p className="text-blue-100 text-lg text-center">Track your job applications and land your dream job faster.</p>
        <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-sm">
          <div className="bg-blue-500 p-4 rounded-xl">
            <p className="text-3xl font-bold">500+</p>
            <p className="text-blue-100 text-sm">Jobs Tracked</p>
          </div>
          <div className="bg-blue-500 p-4 rounded-xl">
            <p className="text-3xl font-bold">98%</p>
            <p className="text-blue-100 text-sm">Success Rate</p>
          </div>
          <div className="bg-blue-500 p-4 rounded-xl">
            <p className="text-3xl font-bold">200+</p>
            <p className="text-blue-100 text-sm">Users</p>
          </div>
          <div className="bg-blue-500 p-4 rounded-xl">
            <p className="text-3xl font-bold">50+</p>
            <p className="text-blue-100 text-sm">Companies</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Email address</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;