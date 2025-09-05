import {ChevronDown, Search} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {search} from "../services/challengerggApi.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import {useGlobal} from "../contexts/GlobalContext.jsx";
import {getChampionAvatarUrl, getProfileIconUrl} from "../services/ddragonApi.js";
import {upperCaseFirstLowerCaseAll} from "../common/stringUtils.js";
import {positionTextFormatMap, regionCodeMap} from "../common/constants.js";
import LinkToProfile from "./LinkToProfile.jsx";

export default function SearchBar() {
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState("VN");
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    // TODO
    if(searchResult && searchResult.players.length > 0 && !searchText.includes("#")) {
      const player = searchResult.players[0];
      navigate(`/profiles/${player.region.toLowerCase()}/${player.gameName}-${player.tagLine}`);
      return;
    }
    if(searchText === ""){
      return;
    }
    let gameName = searchText;
    let tagLine = regionCodeMap[selectedRegion];
    if(searchText.includes("#")) {
      gameName = searchText.split("#")[0] !== "" ? searchText.split("#")[0] : "Hide on bush";
      tagLine = searchText.split("#")[1] !== "" ? searchText.split("#")[1] : regionCodeMap[selectedRegion];
    }
    navigate(`/profiles/${selectedRegion.toLowerCase()}/${gameName}-${tagLine}`);
  }

  const selfRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (selfRef.current && !selfRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selfRef} className={"relative"}>
      <div className={"w-full h-12 bg-bg2 rounded-full border border-bg3 flex items-center px-5 gap-4"}>
        <div className={"flex items-center gap-[2px] cursor-pointer"}>
          <div className={"font-[600] text-main"}>{selectedRegion}</div>
          <ChevronDown className={"text-text2"} size={13} strokeWidth={4}/>
        </div>
        <form
          className={"w-full flex"}
          onSubmit={(e) => {
            e.preventDefault(); // ✅ prevent the default "?submit"
            onSubmit();         // call your navigation function
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
            <Search className={"text-text2 cursor-pointer"} size={20} strokeWidth={2.25}/>
          </button>
        </form>
      </div>
      <div  className={`absolute ${isDropdownOpen ? "flex" : "hidden"} justify-center w-full px-4 xs:pl-16 xs:pr-10`}>
        <div className={"mt-1 w-full rounded-sm bg-bg2 border border-bg3"}>
          {isLoading && <LoadingSpinner/>}
          {!isLoading && searchResult ? (
            <SearchResultDisplay searchResult={searchResult} />
          ) : (
            <div className={"w-full flex justify-center items-center text-center py-10 px-4 xs:px-10 font-[500] text-text2"}>
              Example: Hide on bush #VN2
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SearchResultDisplay({searchResult}) {
  const {currentPatch} = useGlobal();

  const champions = searchResult.champions;
  const players = searchResult.players;
  return (
    <div className={"flex flex-col"}>
      {(champions.length === 0 && players.length === 0) && (
        <div className={"w-full flex justify-center items-center text-center py-10 px-4 xs:px-10 font-[500] text-text2"}>
          First time? Enter GameName#Tag. Afterwards, you can just search for it
        </div>
      )}
      {champions.length > 0 && champions.slice(0, 5).map(champion => (
        <ChampionResultLine
          key={champion.code}
          champion={champion}
        />
      ))}
      {players.length > 0 && players.slice(0, 5).map(player => (
        <PlayerResultLine
          key={player.gameName + player.tagLine}
          player={player}
        />
      ))}
    </div>
  );

  function ChampionResultLine({champion}) {
    return (
      <div className={"w-full flex gap-2 px-2 h-14 items-center border-b border-bg3 hover:bg-bg3"}>
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
    )
  }

  function PlayerResultLine({player}) {
    return (
      <LinkToProfile newWindow={false} region={player.region} gameName={player.gameName} tagLine={player.tagLine}>
      <div className={"w-full flex gap-2 px-2 h-14 items-center border-b border-bg3 hover:bg-bg3"}>
        <img alt={"avt"} src={getProfileIconUrl(player.profileIconId, currentPatch)} className={"w-10 h-10 rounded-[100%]"}/>
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