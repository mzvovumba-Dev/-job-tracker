import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchApplications();
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/applications', {
        headers: { authorization: token }
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/applications', 
        { company, position, status, notes },
        { headers: { authorization: token } }
      );
      setCompany('');
      setPosition('');
      setStatus('Applied');
      setNotes('');
      setShowForm(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/applications/${id}`, {
        headers: { authorization: token }
      });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Job Tracker 🚀</h1>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Applications ({applications.length})</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            + Add Application
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Application</h3>
            <form onSubmit={handleAdd}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Job position"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes..."
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Add Application
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {applications.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
              No applications yet! Click "Add Application" to get started.
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{app.company}</h3>
                  <p className="text-gray-600">{app.position}</p>
                  {app.notes && <p className="text-gray-400 text-sm mt-1">{app.notes}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === 'Applied' ? 'bg-blue-100 text-blue-600' :
                    app.status === 'Interview' ? 'bg-yellow-100 text-yellow-600' :
                    app.status === 'Offer' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;