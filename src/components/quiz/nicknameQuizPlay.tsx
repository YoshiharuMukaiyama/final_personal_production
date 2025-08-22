import React, { useEffect, useState } from "react";
import axios from "axios";
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
  onNext: (isCorrect: boolean) => void;
};

const Question: React.FC<QuestionProps> = ({ person, options, onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (!isAnswered) {
      setSelected(option);
      setIsAnswered(true);
    }
  };

  const isCorrect = selected === person.nickname;

  return (
    <div style={{ padding: "1rem", margin: "2rem", border: "1px solid #ccc", borderRadius: "8px", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <div style={{ flex: 1, textAlign: "left" }}>
        <h2>What is the nickname of {person.name}?</h2>
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
              onClick={() => {
                onNext(isCorrect);
                setSelected(null);
                setIsAnswered(false);
              }}
              style={{
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
          </div>
        )}
      </div>

      <img
        src={isAnswered ? person.imgUrl : person.imgUrl} // API の URL を直接使用
        alt={person.name}
        style={{
          width: "120px", borderRadius: "8px", flexShrink: 0,
          marginTop: "3rem",
        }}
      />

    </div>
  );
};

export const NicknameQuizPlay: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ person: Person; isCorrect: boolean }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://api.octagon-api.com/fighters");
        // nickname が空でない、かつ category に "Woman" を含まない選手だけ抽出
        let fightersArray: Person[] = Object.entries(res.data)
          .map(([id, fighter]: [string, any]) => ({
            id,
            name: fighter.name,
            nickname: fighter.nickname,
            imgUrl: fighter.imgUrl,
            category: fighter.category,
          }))
          .filter(f => f.nickname && f.nickname.trim() !== "" && !f.category.toLowerCase().includes("women"));

        // 配列をシャッフル
        fightersArray = fightersArray.sort(() => 0.5 - Math.random());

        // 先頭10件だけ使う
        fightersArray = fightersArray.slice(0, 10);

        setPeople(fightersArray);
      } catch (err: any) {
        console.error("API fetch error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNext = (isCorrect: boolean) => {
    if (!people[currentIndex]) return;

    const updatedResults = [
      ...results,
      {
        person: people[currentIndex],
        isCorrect,
        question: people[currentIndex].name, // ← ここを追加
      },
    ];

    setResults(updatedResults);

    if (currentIndex + 1 < people.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // クイズ終了 → 結果ページに遷移
      navigate("/quiz/result_nickname", { state: { results: updatedResults } });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (people.length === 0) return <div>No people found</div>;

  const currentPerson = people[currentIndex];
  const otherNicknames = people
    .filter((p) => p.id !== currentPerson.id)
    .map((p) => p.nickname)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const options = [currentPerson.nickname, ...otherNicknames].sort(() => 0.5 - Math.random());

  return <Question person={currentPerson} options={options} onNext={handleNext} />;
};
