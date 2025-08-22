import React, { useState } from "react";

type QuestionProps = {
  question: string;
  image: string;
  options: string[];
  correctAnswer: string;
  onFinish: (isCorrect: boolean) => void;
};

const Question: React.FC<QuestionProps> = ({ question, image, options, correctAnswer, onFinish }) => {
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
        margin: "2rem auto",
        maxWidth: "600px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <h2>{question}</h2>

      <img
        src={image}
        alt="quiz"
        style={{ width: "200px", borderRadius: "8px", margin: "1rem auto" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {options.map((option) => (
          <li key={option} style={{ marginBottom: "0.5rem" }}>
            <button
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
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
          <p>{isCorrect ? "✅ 正解!" : `❌ 不正解... 正解は ${correctAnswer}`}</p>
          <button
            onClick={() => onFinish(isCorrect)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            Finish Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export const SingleNicknameQuiz: React.FC = () => {
  const question = "What is my nickname?";
  const correctAnswer = "C言語戦士";
  const options = ["C言語戦士", "同期Lover", "圧倒的行動家", "七対の雀士"].sort(
    () => 0.5 - Math.random()
  );

  return (
    <Question
      question={question}
      image="/assets/images/PhotoOfMyself.png" // ← ここに自分の画像を配置
      options={options}
      correctAnswer={correctAnswer}
      onFinish={(isCorrect) => {
        alert(isCorrect ? "🎉 おめでとう！" : "💀 残念...");
      }}
    />
  );
};
