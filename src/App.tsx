import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import { Header } from './components/header';
import { Home } from './components/home';
import { FighterDetail } from './components/Detail/fightersDetail';
import { Analysis } from './components/analysis';
import { QuizHome } from './components/quiz/quizHome';
import { QuizPlay } from './components/quiz/quizPlay';
import { QuizResult } from './components/quiz/quizResult';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="App"> {/* ヘッダーの下に余白を作る */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:fighterSlug" element={<FighterDetail />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/quiz" element={<QuizHome />} />
          <Route path="/quiz/play" element={<QuizPlay />} />
          <Route path="/quiz/result" element={<QuizResult />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
