import {ChevronDown, Search} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {search} from "../services/challengerggApi.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import {useGlobal} from "../contexts/GlobalContext.jsx";
import {getChampionAvatarUrl, getProfileIconUrl} from "../services/ddragonApi.js";
import {upperCaseFirstLowerCaseAll} from "../common/stringUtils.js";
import {positionTextFormatMap, regionCodeMap} from "../common/constants.js";
import LinkToProfile from "./link/LinkToProfile.jsx";
import LinkToChampion from "./link/LinkToChampion.jsx";

export default function SearchBar({bgStyle = "bg-bg2"}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRegion, setSelectedRegion] = useState("VN");
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsDropdownOpen(false);
    setSearchText("");
  }, [location.pathname]);

  const {
    data: searchResult,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchResult", searchText],
    queryFn: () => search(searchText),
    enabled: searchText.length > 0
  })

  function onSubmit() {
    if (searchResult && searchResult.champions.length > 0) {
      const champion = searchResult.champions[0];
      navigate(`/champions/${champion.championName}`);
      return;
    }
    if (searchResult && searchResult.players.length > 0) {
      const player = searchResult.players[0];
      navigate(`/profile/${player.region.toLowerCase()}/${player.gameName}-${player.tagLine}`);
      return;
    }
    if (searchText === "") {
      return;
    }
    let gameName = searchText;
    let tagLine = regionCodeMap[selectedRegion];
    if (searchText.includes("#")) {
      gameName = searchText.split("#")[0] !== "" ? searchText.split("#")[0].trim() : "Hide on bush";
      tagLine = searchText.split("#")[1] !== "" ? searchText.split("#")[1].trim() : regionCodeMap[selectedRegion];
    }
    navigate(`/profile/${selectedRegion.toLowerCase()}/${gameName}-${tagLine}`);
  }

  const searchBarRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchBarRef} className={"relative"}>
      <div className={`w-full h-12 ${bgStyle} rounded-full border border-bg3 flex items-center px-4 gap-4`}>
        <RegionSelector/>
        <form
          className={"w-full flex"}
          onSubmit={(e) => {
            e.preventDefault(); // prevent the default "?submit"
            onSubmit();
          }}
        >
          <input
            tabIndex={0}
            onFocus={() => setIsDropdownOpen(true)}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={"w-full focus:outline-none font-[400]"}
            placeholder={"Search for champions, players"}
          />
          <button type={"submit"}>
            <Search className={"text-text2 cursor-pointer ml-1"} size={20} strokeWidth={2.25}/>
          </button>
        </form>
      </div>
      <div className={`absolute ${isDropdownOpen ? "flex" : "hidden"} justify-center w-full px-4`}>
        <div className={"mt-1 w-full rounded-sm bg-bg2 border border-bg3"}>
          {isLoading ? (<></>) : searchResult ? (
            <SearchResultDisplay searchResult={searchResult}/>
          ) : (
            <div
              className={"w-full flex justify-center items-center text-center py-10 px-4 xs:px-10 font-[500] text-text2"}>
              Example: Hide on bush #VN2
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function RegionSelector() {
    const [isOpen, setIsOpen] = useState(false);

    const regionSelectorRef = useRef();

    useEffect(() => {
      function handleClickOutside(event) {
        if (regionSelectorRef.current && !regionSelectorRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const regionList = ["VN", "KR", "EUW", "EUN", "NA", "BR"];

    return (
      <div ref={regionSelectorRef} className={"relative"}>
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            setIsDropdownOpen(false);
          }}
          className={"flex items-center justify-between cursor-pointer"}
        >
          <div className={"font-[600] text-main text-center w-8"}>{selectedRegion}</div>
          <ChevronDown className={`text-text2 ${isOpen && "rotate-180"}`} size={13} strokeWidth={4}/>
        </div>
        {isOpen && (
          <div className={"absolute bg-bg2 border border-bg3 flex flex-col mt-1 -left-2"}>
            {regionList.map((region, index) => (
              <div
                onClick={() => {
                  setSelectedRegion(region);
                  setIsOpen(false);
                }}
                className={"py-2 px-3 font-[600] text-text2 cursor-pointer border-b border-bg3"}
              >
                {region}
              </div>
            ))}

          </div>
        )}
      </div>

    )
  }
}

function SearchResultDisplay({searchResult}) {
  const {currentPatch} = useGlobal();

  const champions = searchResult.champions;
  const players = searchResult.players;

  const displayItems = 5;

  return (
    <div className={"flex flex-col"}>
      {(champions.length === 0 && players.length === 0) && (
        <div
          className={"w-full flex justify-center items-center text-center py-10 px-4 xs:px-10 font-[500] text-text2"}>
          First time? Enter GameName #Tag. Afterwards, you can just search for it
        </div>
      )}
      {champions.length > 0 && champions.slice(0, displayItems).map(((champion, index) => (
        <ChampionResultLine
          key={champion.code}
          champion={champion}
          highlight={index === 0}
        />
      )))}
      {players.length > 0 && players.slice(0, displayItems).map(((player, index) => (
        <PlayerResultLine
          key={player.gameName + player.tagLine}
          player={player}
          highlight={champions.length === 0 && index === 0}
        />
      )))}
    </div>
  );

  function ChampionResultLine({champion, highlight = false}) {
    return (
      <LinkToChampion championName={champion.championName} position={champion.position}>
        <div
          className={`w-full flex gap-2 px-2 h-14 items-center border-b border-bg3 hover:bg-bg4 ${highlight && 'bg-bg4'}`}>
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              alt="avt"
              src={getChampionAvatarUrl(champion.championName, currentPatch)}
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div className={"flex flex-col gap-[2px]"}>
            <div className={"font-[500]"}>{champion.championDisplayName}</div>
            <div className={"text-text2 text-xs"}>{positionTextFormatMap[champion.position]}</div>
          </div>
        </div>
      </LinkToChampion>
    )
  }

  function PlayerResultLine({player, highlight = false}) {
    return (
      <LinkToProfile newWindow={false} region={player.region} gameName={player.gameName} tagLine={player.tagLine}>
        <div
          className={`w-full flex gap-2 px-2 h-14 items-center border-b border-bg3 hover:bg-bg4 ${highlight && 'bg-bg4'}`}>
          <img alt={"avt"} src={getProfileIconUrl(player.profileIconId, currentPatch)}
               className={"w-10 h-10 rounded-[100%]"}/>
          <div className={"flex flex-col gap-[2px] overflow-x-hidden"}>
            <div className={"flex gap-1"}>
              <div className={"font-[500] max-w-32 xs:max-w-screen truncate"}>{player.gameName}</div>
              <div className={"font-[500] text-text2"}>#{player.tagLine}</div>
            </div>
            <div className={"text-text2 text-xs"}>
              {player.region} | {upperCaseFirstLowerCaseAll(player.ranks[0].tier)} {player.ranks[0].division}
            </div>
          </div>
        </div>
      </LinkToProfile>
    )
  }
}