import { useState, useEffect } from "react";
import axios from "axios";

export type Fighter = {
  name: string;
  nickname: string;
  age?: string;
  wins: string;
  losses: string;
  fightingStyle?: string;
};

export function useFighters() {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios.get("https://api.octagon-api.com/fighters")
      .then(res => {
        const data = Object.values(res.data) as Fighter[]; // ← 必ず配列に変換
        setFighters(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { fighters, loading, error };
}
