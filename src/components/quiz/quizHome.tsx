import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const QuizHome: React.FC = () => {

  return (
    <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
      <h1>Fighter Nickname Quiz</h1>
      <Link
        to="/quiz/play_nickname"
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
        スタート
      </Link>

      <div style={{ paddingTop: '40px' }}>
        <h1>Kanji Tattoo Fighter Quiz</h1>
        <Link
          to="/quiz/play_tattoo"
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
          スタート
        </Link>
      </div>

      <div style={{ paddingTop: '40px' }}>
        <h1>MMA Fan Nickname Quiz</h1>
        <Link
          to="/quiz/play_fan"
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
          スタート
        </Link>
      </div>
    </div>
  );
};
