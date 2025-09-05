import {NavLink} from "react-router-dom";
import Logo from "../Logo.jsx";

export default function Header() {
  return (
    <div className={"fixed top-0 h-20 z-40 w-full bg-bg2 px-6   border-b border-b-bg3 shadow-md flex justify-center"}>
      <div className={"w-full max-w-screen-lg flex gap-10 items-center"}>
        <NavLink to={"/"}>
          <Logo/>
        </NavLink>
        <NavLink
          to={"/champions"}
          className={({isActive}) => `font-[500] text-base ${isActive ? "text-text1" : "text-text2"}`}>
          Champions
        </NavLink>
      </div>
    </div>
  )
}