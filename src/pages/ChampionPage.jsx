import {useParams} from "react-router-dom";

export default function ChampionPage() {
  const params = useParams();
  const championName = params.championName;

  return (
    <div>{championName}</div>
  )
}