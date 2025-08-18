import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// --- Question コンポーネント ---
type QuestionProps = {
  question: string;
  options: string[];
  correctAnswer: string;
  onNext: (isCorrect: boolean) => void;
  imgUrl: string;
};

const Question: React.FC<QuestionProps> = ({
  question,
  options,
  correctAnswer,
  onNext,
  imgUrl,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (!isAnswered) {
      setSelected(option);
      setIsAnswered(true);
    }
  };

  const isCorrect = selected === correctAnswer;

  return (
    <div
      style={{
        padding: "1rem",
        margin: "3rem", // 上下左右の余白
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      {/* 左側に質問と選択肢 */}
      <div style={{ flex: 1, textAlign: "left", paddingLeft: "3rem" }}>
        <h2>{question}</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {options.map((option) => (
            <li key={option} style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => handleSelect(option)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    isAnswered && option === correctAnswer
                      ? "lightgreen"
                      : isAnswered && option === selected
                        ? "salmon"
                        : "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: isAnswered ? "default" : "pointer",
                }}
                disabled={isAnswered}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>

        {isAnswered && (
          <>
            <p>{isCorrect ? "✅ Correct!" : `❌ Wrong... Correct answer is ${correctAnswer}`}</p>
            <button
              onClick={() => {
                onNext(isCorrect);
                setIsAnswered(false);
                setSelected(null);
              }}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Next Question
            </button>
          </>
        )}
      </div>

      {/* 右側に画像 */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt="fighter"
          style={{
            width: "120px", borderRadius: "8px", flexShrink: 0,
            marginTop: "2.5rem",
          }}
        />
      )}
    </div>
  );
};

// --- QuizPlay コンポーネント ---
type Fighter = {
  name: string;
  nickname: string;
  imgUrl: string;
};

export const QuizPlay: React.FC = () => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [current, setCurrent] = useState<Fighter | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [results, setResults] = useState<{ question: string; isCorrect: boolean }[]>([]);
  const navigate = useNavigate();

  // APIから選手情報取得
  useEffect(() => {
    const fetchFighters = async () => {
      const res = await axios.get("https://api.octagon-api.com/fighters");
      const data = res.data;

      const filtered: Fighter[] = Object.values(data as Record<string, any>)
        .filter((f: any) => !f.category.toLowerCase().includes("women") && f.nickname)
        .map((f: any) => ({
          name: f.name,
          nickname: f.nickname,
          imgUrl: f.imgUrl,
        }));

      setFighters(filtered);
    };

    fetchFighters();
  }, []);

  // 問題生成
  const makeQuestion = () => {
    if (fighters.length === 0) return;

    const random = fighters[Math.floor(Math.random() * fighters.length)];
    setCurrent(random);

    const nicknamesPool = fighters
      .filter((f) => f.nickname !== random.nickname)
      .map((f) => f.nickname);

    const randomThree = nicknamesPool.sort(() => 0.5 - Math.random()).slice(0, 3);
    const shuffled = [random.nickname, ...randomThree].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
  };

  // 正誤処理
  const handleNext = (isCorrect: boolean) => {
    if (!current) return;

    const questionText = `What is ${current.name}'s nickname?`;
    setResults([...results, { question: questionText, isCorrect }]);

    if (count + 1 >= 10) {
      navigate("/quiz/result", { state: { results: [...results, { question: questionText, isCorrect }] } });
    } else {
      setCount(count + 1);
      makeQuestion();
    }
  };

  useEffect(() => {
    if (fighters.length > 0) {
      makeQuestion();
    }
  }, [fighters]);

  if (!current) return <p>Loading...</p>;

  return (
    <Question
      question={`What is ${current.name}'s nickname?`}
      options={options}
      correctAnswer={current.nickname}
      onNext={handleNext}
      imgUrl={current.imgUrl}
    />
  );
};
