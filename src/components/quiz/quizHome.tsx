import React from 'react';
import { Link } from 'react-router-dom';

export const QuizHome: React.FC = () => {
  return (
    <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
      <h1>Fighter Nickname Quiz</h1>
      <Link
        to="/quiz/play"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#435d86ff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          marginTop: '10px',
        }}
      >
        クイズスタート
      </Link>
    </div>
  );
};
