import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={logoStyle}>MMA App</h1>
        <nav>
          <ul style={navListStyle}>
            <li style={navItemStyle}>
              <Link to="/">Home</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/analysis">Analysis</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/quiz">Quiz</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// --- 簡単なインラインスタイル ---
const headerStyle: React.CSSProperties = {
  backgroundColor: '#1f2937', // ダークグレー
  color: '#fff',
  padding: '10px 20px',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const navListStyle: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  margin: 0,
  padding: 0,
};

const navItemStyle: React.CSSProperties = {
  marginLeft: '20px',
};
