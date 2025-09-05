import {NavLink} from "react-router-dom";
import Logo from "./Logo.jsx";

export default function PageLayout({ children }) {
  return (
    <div className="bg-bg1 text-text1 font-default font-normal text-sm antialiased">
      <Header/>
      <div className={"min-h-[100vh] mt-20 mb-40 overflow-x-hidden"}>
        {children}
      </div>
      <Footer/>
    </div>
  );
}

function Header() {
  return (
    <div className={"fixed top-0 h-20 z-40 w-full bg-bg2 px-6 flex items-center gap-10 border-b border-b-bg3 shadow-md"}>
      <NavLink to={"/"}>
        <Logo/>
      </NavLink>
      <NavLink
        to={"/champions"}
        className={({isActive}) => `font-[500] text-base ${isActive ? "text-text1" : "text-text2"}`}>
        Champions
      </NavLink>
    </div>
  )
}

function Footer(){
  return (
    <div className={"h-20 bg-main"}>
      Footer
    </div>
  )
}