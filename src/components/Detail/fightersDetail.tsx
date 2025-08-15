import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type FighterDetail = {
  category: string;
  draws: string;
  imgUrl: string;
  losses: string;
  name: string;
  nickname: string;
  wins: string;
  status: string;
  placeOfBirth: string;
  trainsAt: string;
  fightingStyle: string;
  age: string;
  height: string;
  weight: string;
  octagonDebut: string;
  reach: string;
  legReach: string;
};

export function FighterDetail() {
  const { fighterSlug } = useParams<{ fighterSlug: string }>();
  const [fighter, setFighter] = useState<FighterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFighter = async () => {
      try {
        const res = await axios.get(`https://api.octagon-api.com/fighters`);
        const data: FighterDetail[] = Object.values(res.data);

        const found = data.find(
          f => f.name.toLowerCase().replace(/ /g, "-") === fighterSlug
        );

        if (!found) throw new Error("Fighter not found");

        setFighter(found);
      } catch (err: any) {
        setError(err.message || "Failed to fetch fighter data");
      } finally {
        setLoading(false);
      }
    };

    fetchFighter();
  }, [fighterSlug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!fighter) return <p>No fighter data.</p>;

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{fighter.name}</h1>
      {fighter.nickname && <h3>({fighter.nickname})</h3>}

      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        {/* テキスト情報 */}<ul style={{ listStyle: "none", paddingLeft: 0, flex: 1 }}>
          <li><strong>Category:</strong> {fighter.category}</li>
          <li><strong>Fight Record:</strong> {fighter.wins}-{fighter.losses}-{fighter.draws}</li>
          <li><strong>Place of Birth:</strong> {fighter.placeOfBirth}</li>
          <li><strong>Training Facility:</strong> {fighter.trainsAt}</li>
          <li><strong>Age:</strong> {fighter.age}</li>
          <li>
            <strong>Height:</strong> {fighter.height}" {(Number(fighter.height) * 2.54).toFixed(1)} cm
          </li>
          <li>
            <strong>Reach:</strong> {fighter.reach}" {(Number(fighter.reach) * 2.54).toFixed(1)} cm
          </li>
          <li>
            <strong>Leg Reach:</strong> {fighter.legReach}" {(Number(fighter.legReach) * 2.54).toFixed(1)} cm
          </li>
          <li>
            <strong>Weight:</strong> {fighter.weight} lbs {(Number(fighter.weight) / 2.205).toFixed(1)} kg
          </li>
          <li><strong>Octagon Debut:</strong> {fighter.octagonDebut}</li>
          {fighter.fightingStyle && <li><strong>Fighting Style:</strong> {fighter.fightingStyle}</li>}
          <li><strong>Status:</strong> {fighter.status}</li>
        </ul>

        {/* 右端画像 */}
        {fighter.imgUrl && (
          <img
            src={fighter.imgUrl}
            alt={fighter.name}
            style={{ maxWidth: "180px", borderRadius: "4px" }}
          />
        )}
      </div>
    </div>
  );
}
