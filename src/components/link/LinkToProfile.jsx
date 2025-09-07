import {Link} from "react-router-dom";

export default function LinkToProfile({region, gameName, tagLine, children, newWindow = true}) {
  if(!newWindow) {
    return (
      <Link to={`/profile/${region.toLowerCase()}/${gameName}-${tagLine}`}>
        {children}
      </Link>
    )
  }
  else {
    return (
      <a href={`/profile/${region.toLowerCase()}/${gameName}-${tagLine}`} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
}