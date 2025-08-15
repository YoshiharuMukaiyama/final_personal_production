import { useLocation, useNavigate } from "react-router-dom";

export function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: [] };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>結果</h2>
      <p>正解数: {results.filter((r: any) => r.isCorrect).length} / {results.length}</p>
      <ul>
        {results.map((r: any, idx: number) => (
          <li key={idx}>
            Q{idx + 1}: {r.question} → {r.isCorrect ? "✅ 正解" : "❌ 不正解"}
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/quiz/play")}
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
        もう一度プレイ
      </button>
      <button
        onClick={() => navigate("/quiz")}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          marginLeft: "3rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ホームへ
      </button>
    </div>
  );
}
