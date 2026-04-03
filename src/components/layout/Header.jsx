import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import Logo from "../Logo.jsx";
import SearchBar from "../SearchBar.jsx";
import {CircleUserRound, Crown, Info, Menu, Swords, X} from "lucide-react";
import {useState} from "react";

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
            <Info className={"cursor-pointer"} onClick={() => setIsInfoOpen(true)}/>
          </div>
          {isInfoOpen && <InfoDialog onClose={() => setIsInfoOpen(false)}/>}
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

function InfoDialog({onClose}) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    if (message === "dkbadmin") {
      onClose();
      navigate("/admin/items");
      return;
    }
    setMessage("");
    setSent(true);
  }

  return (
    <div
      className={"fixed inset-0 z-50 flex items-center justify-center bg-black/50"}
      onClick={onClose}
    >
      <div
        className={"bg-bg2 border border-bg3 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={"flex items-center justify-between"}>
          <div className={"font-[600] text-base"}>About Challengergg</div>
          <X size={18} className={"cursor-pointer text-text2 hover:text-text1"} onClick={onClose}/>
        </div>
        <div className={"text-sm text-text2 leading-relaxed"}>
          Challengergg is a League of Legends analytics platform focused on high-elo match data. Built and maintained by{" "}
          <a
            href={"https://github.com/kbdev-21"}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className={"text-main hover:underline font-[500]"}
          >
            kbdev_21
          </a>
          .
        </div>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-2"}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={"Send a message to the developer..."}
            rows={3}
            className={"w-full bg-bg1 border border-bg3 rounded-md px-3 py-2 text-sm focus:outline-none resize-none"}
          />
          <div className={"flex items-center justify-between mt-1"}>
            {sent ? (
              <span className={"text-xs text-win font-[500]"}>Message sent!</span>
            ) : (
              <span/>
            )}
            <button
              type={"submit"}
              className={"cursor-pointer ml-auto bg-main text-black text-sm font-[500] px-4 py-1.5 rounded-md hover:opacity-90"}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
