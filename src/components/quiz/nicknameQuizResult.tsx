import { useLocation, useNavigate } from "react-router-dom";

export function NicknameQuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: [] };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>結果</h2>
      <p>正解数: {results.filter((r: any) => r.isCorrect).length} / {results.length}</p>
      <ul style={{ listStyle: "none", padding: 0, maxWidth: "500px", margin: "0 auto" }}>
        {results.map((r: any, idx: number) => (
          <li
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ marginRight: "1rem" }}>{`Q${idx + 1}: ${r.question}`}</span>
            <span>{r.isCorrect ? "✅" : "❌"}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/quiz/play_nickname")}
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
