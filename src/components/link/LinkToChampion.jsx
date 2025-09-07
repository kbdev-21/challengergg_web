import {Link} from "react-router-dom";

export default function LinkToChampion({championName, position, children}) {
  const url = position ? `/champions/${championName}/${position.toLowerCase()}` : `/champions/${championName}`;

  return (
    <Link to={url}>
      {children}
    </Link>
  )
}