import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Person = {
  id: string;
  name: string;
  nickname: string;
  imgUrl: string;
};

type QuestionProps = {
  person: Person;
  options: string[];
};

const Question: React.FC<QuestionProps> = ({ person, options }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (option: string) => {
    if (!isAnswered) {
      setSelected(option);
      setIsAnswered(true);
    }
  };

  const isCorrect = selected === person.nickname;

  return (
    <div
      style={{
        padding: "1rem",
        margin: "2rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      {/* 左側：問題と選択肢 */}
      <div style={{ flex: 1, textAlign: "left" }}>
        <h2>What is {person.name}'s nickname?</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {options.map((option) => (
            <li key={option} style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    isAnswered && option === person.nickname
                      ? "lightgreen"
                      : isAnswered && option === selected
                        ? "salmon"
                        : "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: isAnswered ? "default" : "pointer",
                  minWidth: "200px",
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>

        {isAnswered && (
          <div style={{ marginTop: "1rem" }}>
            <p>{isCorrect ? "✅ 正解!" : `❌ 不正解... 正解は ${person.nickname}`}</p>
            <button
              onClick={() => navigate("/quiz/")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ホームへ戻る
            </button>
          </div>
        )}
      </div>

      {/* 右側：画像 */}
      <img
        src={person.imgUrl}
        alt={person.name}
        style={{
          width: "150px",
          borderRadius: "8px",
          flexShrink: 0,
          marginTop: "5rem",
        }}
      />
    </div>
  );
};

export const MMAFanNicknameQuizPlay: React.FC = () => {
  const person: Person = {
    id: "1",
    name: "Yoshiharu Mukaiyama",
    nickname: "C言語戦士",
    imgUrl: "/assets/images/PhotoOfMyself.png",
  };

  const options = ["C言語戦士", "同期Lover", "圧倒的行動家", "七対の雀士"].sort(
    () => 0.5 - Math.random()
  );

  return (
    <Question
      person={person}
      options={options}
    />
  );
};
