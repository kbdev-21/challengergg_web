import {NavLink, useLocation} from "react-router-dom";
import Logo from "../Logo.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import {useEffect} from "react";
import {Tooltip} from "react-tooltip";

export default function PageLayout({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-bg1 text-text1 font-default font-normal text-sm">
      <Header/>
      <div className={"min-h-[100vh] pt-48 lg:pt-32 pb-32 overflow-x-hidden flex justify-center px-2"}>
        <div className={"w-full max-w-screen-lg"}>
          {children}
        </div>
      </div>
      <Footer/>
      <Tooltip id="text-tooltip" className="max-w-72 text-center" opacity={1} delayShow={100} />
    </div>
  );
}