import React from 'react';
import { Link } from 'react-router-dom';

export const QuizHome: React.FC = () => {
  return (
    <div>
      <h1>Quiz Home Page</h1>
      <Link to="/quiz/play">クイズスタート</Link>
    </div>
  );
};
