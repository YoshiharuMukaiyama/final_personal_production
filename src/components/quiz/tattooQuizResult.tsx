import { useLocation, useNavigate } from "react-router-dom";

export function TattooQuizResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: [] };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>結果</h2>
      <p>正解数: {results.filter((r: any) => r.isCorrect).length} / {results.length}</p>

      <ul style={{ listStyle: "none", padding: 0, maxWidth: "400px", margin: "0 auto" }}>
        {results.map((r: any, idx: number) => (
          <li
            key={idx}
            style={{
              display: "flex",
              justifyContent: "center",  // 中央寄せ
              alignItems: "center",
              marginBottom: "0.5rem",
              gap: "1.5rem",             // 名前とアイコンの間隔を広く
            }}
          >
            <span>{`Q${idx + 1}: ${r.question}`}</span>
            <span>{r.isCorrect ? "✅" : "❌"}</span>
          </li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => navigate("/quiz/play_tattoo")}
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
            marginLeft: "1rem",
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
    </div>
  );
}
