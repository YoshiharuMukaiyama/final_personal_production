import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import { Header } from './components/header';
import { Home } from './components/home';
import { FighterDetail } from './components/Detail/fightersDetail';
import { Analysis } from './components/analysis';
import { QuizHome } from './components/quiz/quizHome';
import { NicknameQuizPlay } from './components/quiz/nicknameQuizPlay';
import { NicknameQuizResult } from './components/quiz/nicknameQuizResult';
import { TattooQuizPlay } from './components/quiz/tattooQuizPlay';
import { TattooQuizResult } from './components/quiz/tattooQuizResult';
import { MMAFanNicknameQuizPlay } from './components/quiz/MMAFanQuizPlay';

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
          <Route path="/quiz/play_nickname" element={<NicknameQuizPlay />} />
          <Route path="/quiz/result_nickname" element={<NicknameQuizResult />} />
          <Route path="/quiz/play_tattoo" element={<TattooQuizPlay />} />
          <Route path="/quiz/result_tattoo" element={<TattooQuizResult />} />
          <Route path="/quiz/play_fan" element={<MMAFanNicknameQuizPlay />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
