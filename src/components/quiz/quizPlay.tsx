import React, { useEffect, useState } from "react";
import axios from "axios";

// Fighter型
type Fighter = {
  name: string;
  nickname: string;
  imgUrl: string;
  category: string;
};

// 問題表示用コンポーネント
type QuestionProps = {
  question: string;
  options: string[];
  correctAnswer: string;
  onNext: () => void;
};

const Question: React.FC<QuestionProps> = ({
  question,
  options,
  correctAnswer,
  onNext,
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
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
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
          <p>{isCorrect ? "✅ 正解！" : `❌ 不正解... 正解は ${correctAnswer}`}</p>
          <button
            onClick={() => {
              onNext();
              setIsAnswered(false);
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
            次の問題へ
          </button>
        </>
      )
      }
    </div >
  );
};

// メインのQuizコンテナ
export function QuizPlay() {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [current, setCurrent] = useState<Fighter | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  // API取得
  useEffect(() => {
    const fetchFighters = async () => {
      const res = await axios.get("https://api.octagon-api.com/fighters");
      const data = res.data;

      // 型アサーションで unknown → any に変換してから filter
      const filtered: Fighter[] = Object.values(data as Record<string, any>)
        .filter((f: any) =>
          !f.category.toLowerCase().includes("women") &&
          f.nickname &&
          f.nickname.trim() !== ""
        )
        .map((f: any) => ({
          name: f.name,
          nickname: f.nickname,
          imgUrl: f.imgUrl,
          category: f.category,
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

    const randomThree = nicknamesPool
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const shuffled = [random.nickname, ...randomThree].sort(
      () => 0.5 - Math.random()
    );

    setOptions(shuffled);
  };

  // 初回問題生成
  useEffect(() => {
    if (fighters.length > 0) {
      makeQuestion();
    }
  }, [fighters]);

  if (!current) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
      <div>
        <Question
          question={`${current.name} のニックネームはどれ？`}
          options={options}
          correctAnswer={current.nickname}
          onNext={makeQuestion}
        />
      </div>
      <img
        src={current.imgUrl}
        alt={current.name}
        style={{ width: "100px", borderRadius: "8px" }}
      />
    </div>
  );
}
