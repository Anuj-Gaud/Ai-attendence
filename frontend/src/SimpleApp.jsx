import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function SimpleApp() {
  const [page, setPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Check if logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setPage('dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setPage('dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        studentId,
        name,
        email,
        password,
        department,
        role
      });
      
      if (response.data.success) {
        alert('Registration successful! Please login.');
        setPage('login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111827',
      padding: '20px'
    },
    card: {
      backgroundColor: '#1F2937',
      padding: '32px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '24px'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '16px',
      backgroundColor: '#374151',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    buttonDisabled: {
      backgroundColor: '#4B5563',
      cursor: 'not-allowed'
    },
    error: {
      backgroundColor: '#EF4444',
      color: 'white',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '16px'
    },
    link: {
      color: '#3B82F6',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    text: {
      color: '#9CA3AF',
      textAlign: 'center',
      marginTop: '16px'
    },
    dashboard: {
      backgroundColor: '#1F2937',
      padding: '32px',
      borderRadius: '8px',
      color: 'white',
      maxWidth: '800px',
      width: '100%'
    },
    stat: {
      backgroundColor: '#374151',
      padding: '24px',
      borderRadius: '8px',
      marginBottom: '16px'
    }
  };

  if (page === 'dashboard' && user) {
    return (
      <div style={styles.container}>
        <div style={styles.dashboard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={styles.title}>Welcome, {user.name || user.email}!</h1>
            <button onClick={handleLogout} style={{ ...styles.button, width: 'auto', padding: '8px 16px', backgroundColor: '#EF4444' }}>
              Logout
            </button>
          </div>
          
          <div style={styles.stat}>
            <h3 style={{ marginBottom: '8px' }}>Role</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>{user.role.toUpperCase()}</p>
          </div>
          
          <div style={styles.stat}>
            <h3 style={{ marginBottom: '8px' }}>Email</h3>
            <p>{user.email}</p>
          </div>
          
          <div style={styles.stat}>
            <h3 style={{ marginBottom: '8px' }}>Department</h3>
            <p>{user.department || 'Not specified'}</p>
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#10B981', borderRadius: '8px' }}>
            <p style={{ fontWeight: 'bold' }}>✅ System is working!</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Your login was successful. The full dashboard UI will load here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'register') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Register</h1>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Student ID (e.g., STU001)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={styles.input}
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <p style={styles.text}>
            Already have an account?{' '}
            <span style={styles.link} onClick={() => setPage('login')}>
              Login here
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={styles.text}>
          Don't have an account?{' '}
          <span style={styles.link} onClick={() => setPage('register')}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default SimpleApp;
