import {Link} from "react-router-dom";

export default function LinkToChampion({championName, children}) {
  return (
    <Link to={`/champions/${championName}`}>
      {children}
    </Link>
  )
}