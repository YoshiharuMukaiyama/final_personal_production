import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Tattoo = {
  id: number;
  name: string;
  kanji: string;
  image_before: string;
  image_after: string;
};

type QuestionProps = {
  tattoo: Tattoo;
  options: string[];
  onNext: (isCorrect: boolean) => void;
};

const Question: React.FC<QuestionProps> = ({ tattoo, options, onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (!isAnswered) {
      setSelected(option);
      setIsAnswered(true);
    }
  };

  const isCorrect = selected === tattoo.kanji;

  return (
    <div
      style={{
        padding: "1rem",
        margin: "2rem auto",
        maxWidth: "900px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1, textAlign: "left" }}>
        <h2>What is the Kanji of {tattoo.name}?</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {options.map((option) => (
            <li key={option} style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    isAnswered && option === tattoo.kanji
                      ? "lightgreen"
                      : isAnswered && option === selected
                        ? "salmon"
                        : "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: isAnswered ? "default" : "pointer",
                  minWidth: "120px",
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>

        {isAnswered && (
          <div style={{ marginTop: "1rem" }}>
            <p>{isCorrect ? "✅ 正解!" : `❌ 不正解... 正解は ${tattoo.kanji}`}</p>
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
        src={`/assets/images/${isAnswered ? tattoo.image_after : tattoo.image_before}`}
        alt={tattoo.name}
        style={{ width: "400px", borderRadius: "8px", flexShrink: 0 }}
      />
    </div>
  );
};

export const TattooQuizPlay: React.FC = () => {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ tattoo: Tattoo; isCorrect: boolean; question: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<Tattoo[]>("http://localhost:8080/api/tattoo");
        setTattoos(res.data.slice(0, 3)); // 今回は3問のみ
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
    if (!tattoos[currentIndex]) return;

    const updatedResults = [
      ...results,
      { tattoo: tattoos[currentIndex], isCorrect, question: tattoos[currentIndex].name },
    ];
    setResults(updatedResults);

    if (currentIndex + 1 < tattoos.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/quiz/result_tattoo", { state: { results: updatedResults } });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (tattoos.length === 0) return <div>No tattoos found</div>;

  const currentTattoo = tattoos[currentIndex];

  // 固定不正解リスト
  const fixedOptions: string[][] = [
    ["貯蓄", "家族", "侍"], // 1問目
    ["義理", "礼儀", "信念"], // 2問目
    ["素丁不澪四地", "米国合衆国", "基督教信者"], // 3問目
  ];

  const currentOptions = [currentTattoo.kanji, ...fixedOptions[currentIndex]].sort(() => 0.5 - Math.random());

  return <Question tattoo={currentTattoo} options={currentOptions} onNext={handleNext} />;
};
