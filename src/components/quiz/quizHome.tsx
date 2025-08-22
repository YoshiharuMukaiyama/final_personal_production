import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const QuizHome: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const callApi = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/hello'); // Laravel の API エンドポイント
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2)); // 整形して表示
    } catch (error) {
      setApiResponse(`Error: ${error}`);
    }
  };

  return (
    <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
      <h1>Fighter Nickname Quiz</h1>
      <Link
        to="/quiz/play_nickname"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#435d86ff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          marginTop: '10px',
        }}
      >
        スタート
      </Link>

      <div style={{ paddingTop: '40px' }}>
        <h1>Kanji Tattoo Fighter Quiz</h1>
        <Link
          to="/quiz/play_tattoo"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#435d86ff',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            marginTop: '10px',
          }}
        >
          スタート
        </Link>
      </div>

      {/* APIレスポンス表示 */}
      {apiResponse && (
        <pre
          style={{
            backgroundColor: '#f0f0f0',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '5px',
          }}
        >
          {apiResponse}
        </pre>
      )}
    </div>
  );
};
