import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#111827',
      color: 'white',
      fontSize: '24px'
    }}>
      <div>
        <h1>✅ React is Working!</h1>
        <p>If you see this, the app is running correctly.</p>
        <a href="/login" style={{ color: '#3B82F6' }}>Go to Login</a>
      </div>
    </div>
  );
}

export default TestApp;
