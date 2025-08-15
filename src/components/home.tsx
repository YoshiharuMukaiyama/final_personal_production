import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Fighter = {
  name: string;
  category: string;
  wins: string;
  losses: string;
};

export function Home() {
  const [fightersByCategory, setFightersByCategory] = useState<Record<string, Fighter[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const categoryOrder = [
    "Flyweight Division",
    "Bantamweight Division",
    "Featherweight Division",
    "Lightweight Division",
    "Welterweight Division",
    "Middleweight Division",
    "Light Heavyweight Division",
    "Heavyweight Division",
  ];

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const res = await axios.get("https://api.octagon-api.com/fighters");
        const data = res.data;

        const fighterArray: Fighter[] = Object.values(data)
          .filter((f: any) => f.name && !f.category.toLowerCase().includes("woman"))
          .map((f: any) => ({
            name: f.name,
            category: f.category,
            wins: f.wins,
            losses: f.losses,
          }));

        const grouped: Record<string, Fighter[]> = {};
        categoryOrder.forEach(cat => {
          const fightersInCat = fighterArray
            .filter(f => f.category.toLowerCase() === cat.toLowerCase())
            .slice(0, 16);
          if (fightersInCat.length > 0) grouped[cat] = fightersInCat;
        });

        setFightersByCategory(grouped);
      } catch (err: any) {
        setError(err.message || "Failed to fetch fighters");
      } finally {
        setLoading(false);
      }
    };

    fetchFighters();
  }, []);

  // 名前をURL向けのスラッグに変換する関数
  const nameToSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      {categoryOrder.map(category => {
        const fighters = fightersByCategory[category];
        if (!fighters || fighters.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: "1.5rem" }}>
            <h2>{category}</h2>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {fighters.map((f, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "0.25rem",
                  }}
                >
                  {/* 順位 */}
                  <div
                    style={{
                      minWidth: "2.5rem",
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                      textAlign: "right",
                    }}
                  >
                    {idx === 0 ? "👑" : `${idx}位`}
                  </div>

                  {/* 名前 */}
                  <div
                    style={{ marginLeft: "1rem", cursor: "pointer" }}
                    className="fighter-name"
                    onClick={() => navigate(`/${nameToSlug(f.name)}`)}
                  >
                    {f.name}
                  </div>

                  {/* 戦績 */}
                  <div style={{ marginLeft: "1rem", color: "#555", flexShrink: 0 }}>
                    {f.wins}-{f.losses}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <style>
        {`
          .fighter-name:hover {
            color: red;
          }
        `}
      </style>
    </div>
  );
}
