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
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/applications/${editId}`,
          { company, position, status, notes },
          { headers: { authorization: token } }
        );
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/applications',
          { company, position, status, notes },
          { headers: { authorization: token } }
        );
      }
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

  const handleEdit = (app) => {
    setEditId(app.id);
    setCompany(app.company);
    setPosition(app.position);
    setStatus(app.status);
    setNotes(app.notes);
    setShowForm(true);
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

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const filteredApplications = applications
    .filter(a => filter === 'All' ? true : a.status === filter)
    .filter(a => a.company.toLowerCase().includes(search.toLowerCase()) ||
                 a.position.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Interview': return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'Offer': return 'bg-green-50 text-green-600 border border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Job Tracker</h1>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-500 font-medium transition-colors"
        >
          Sign out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <p className="text-gray-400 text-sm mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <p className="text-gray-400 text-sm mb-1">Interviews</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.interview}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <p className="text-gray-400 text-sm mb-1">Offers</p>
            <p className="text-3xl font-bold text-green-500">{stats.offer}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <p className="text-gray-400 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
          </div>
        </div>

        {/* Search Filter and Add Button */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search company or position..."
            className="flex-1 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setCompany(''); setPosition(''); setStatus('Applied'); setNotes(''); }}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Add Application
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editId ? 'Edit Application' : 'New Application'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Position</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
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
                <label className="block text-gray-600 text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes..."
                  rows="3"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editId ? 'Update' : 'Add Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-400 text-lg">No applications found</p>
              <p className="text-gray-300 text-sm mt-1">
                {search || filter !== 'All' ? 'Try adjusting your search or filter' : 'Click "+ Add Application" to get started'}
              </p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={app.id} className="bg-white p-5 rounded-xl border border-gray-200 flex justify-between items-center hover:border-blue-200 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-800">{app.company}</h3>
                  <p className="text-gray-500 text-sm">{app.position}</p>
                  {app.notes && <p className="text-gray-400 text-xs mt-1">{app.notes}</p>}
                  <p className="text-gray-300 text-xs mt-1">{new Date(app.applied_date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => handleEdit(app)}
                    className="text-sm text-gray-400 hover:text-blue-600 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
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