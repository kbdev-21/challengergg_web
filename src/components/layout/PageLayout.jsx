import {NavLink} from "react-router-dom";
import Logo from "../Logo.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function PageLayout({ children }) {
  return (
    <div className="bg-bg1 text-text1 font-default font-normal text-sm">
      <Header/>
      <div className={"min-h-[100vh] pt-[74px] mb-40 overflow-x-hidden flex justify-center px-2"}>
        <div className={"w-full max-w-screen-lg"}>
          {children}
        </div>
      </div>
      <Footer/>
    </div>
  );
}