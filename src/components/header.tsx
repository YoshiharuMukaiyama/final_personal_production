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
              <Link to="/" style={linkStyle}>Home</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/analysis" style={linkStyle}>Analysis</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/quiz" style={linkStyle}>Quiz</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// --- スタイル ---
const headerHeight = 60; // ヘッダーの高さ(px)

const headerStyle: React.CSSProperties = {
  position: 'fixed', // 上部に固定
  top: 0,
  left: 0,
  width: '100%',
  height: `${headerHeight}px`,
  backgroundColor: '#1f2937',
  color: '#fff',
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  zIndex: 1000, // 他の要素より前に表示
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
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
  maxWidth: '60%', // 幅制限
  justifyContent: 'flex-end', // 右寄せ
};

const navItemStyle: React.CSSProperties = {
  marginLeft: '20px',
};

const linkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 500,
};

// --- bodyに余白を追加してヘッダー下のコンテンツを隠さない ---
// App.tsx などのルートコンポーネントで
// <div style={{ paddingTop: `${headerHeight}px` }}>...</div>
