import {Link, NavLink, useLocation} from "react-router-dom";
import Logo from "../Logo.jsx";
import SearchBar from "../SearchBar.jsx";
import {CircleUserRound, Crown, Info, Menu, Swords, X} from "lucide-react";
import {useState} from "react";

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = location.pathname === "/";

  return (
    <div className={"w-full bg-bg2 border-b border-b-bg3 shadow-md"}>
      {/* Header content for desktop */}
      <div className={"hidden lg:flex w-full px-8 py-4 justify-between gap-8"}>
        {/* Left part */}
        <div className={"flex items-center gap-10 h-12 shrink-0"}>
          <NavLink to={"/"}>
            <Logo/>
          </NavLink>
          <HorizontalMenu/>
        </div>

        {/* Right part */}
        <div className={"flex w-full items-center justify-end gap-8"}>
          <div className={`w-full max-w-[450px] ${isHome && "hidden"}`}>
            <SearchBar bgStyle={"bg-bg1"}/>
          </div>
          <div className={"shrink-0"}>
            <Info className={"cursor-pointer"}/>
          </div>
        </div>
      </div>

      {/* Header content for mobile */}
      <div className={"flex flex-col lg:hidden w-full px-6 py-4 justify-between gap-4"}>
        {/* Top part */}
        <div className={"flex justify-between items-center h-12"}>
          <NavLink to={"/"}>
            <Logo/>
          </NavLink>
          <div className={"flex gap-5"}>
            <Link to={"/champions"} className={"block sm:hidden"}>
              <Crown strokeWidth={1.75} size={24}/>
            </Link>
            <div className={"block sm:hidden"}>
              {isMenuOpen ? (
                <X strokeWidth={1.75} onClick={() => setIsMenuOpen(false)} className="cursor-pointer"/>
              ) : (
                <Menu strokeWidth={1.75} onClick={() => setIsMenuOpen(true)} className="cursor-pointer"/>
              )}
            </div>
          </div>

          <div className={"hidden sm:block h-12"}>
            <HorizontalMenu/>
          </div>
        </div>

        {/* Bottom part */}
        <div className={`w-full ${isHome && "hidden"}`}>
          <SearchBar bgStyle={"bg-bg1"}/>
        </div>

        {/* Slide-out mobile menu */}
        {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
      </div>

    </div>
  );
}

function HorizontalMenu() {
  return (
    <div className={"flex items-center gap-10 h-12 shrink-0"}>
      <NavLink
        to={"/champions"}
        className={({isActive}) => `text-base ${isActive ? "text-text1" : "text-text2"}`}
      >
        Champions
      </NavLink>
      <NavLink
        to={"/leaderboard"}
        className={({isActive}) => `text-base ${isActive ? "text-text1" : "text-text2"}`}
      >
        Leaderboard
      </NavLink>
      <NavLink
        to={"/chat"}
        className={({isActive}) => `text-base ${isActive ? "text-text1" : "text-text2"}`}
      >
        Find Teammates
      </NavLink>
    </div>
  )
}

function MobileMenu({onClose}) {
  return (
    <div className="absolute top-[72px] left-0 w-full bg-bg2 border-t border-bg3 shadow-md flex flex-col gap-4 py-4 px-6 z-50">
      <NavLink to="/champions" onClick={onClose} className="text-base text-text1">
        Champions
      </NavLink>
      <NavLink to="/leaderboard" onClick={onClose} className="text-base text-text1">
        Leaderboard
      </NavLink>
      <NavLink to="/chat" onClick={onClose} className="text-base text-text1">
        Find Teammates
      </NavLink>
    </div>
  );
}
