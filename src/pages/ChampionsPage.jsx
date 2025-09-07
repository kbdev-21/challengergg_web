import {useQuery} from "@tanstack/react-query";
import {fetchAllChampionStats} from "../services/challengerggApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import {useState} from "react";
import PositionIcon from "../components/PositionIcon.jsx";
import {Asterisk, Cannabis, LoaderPinwheel} from "lucide-react";
import {getChampionAvatarUrl} from "../services/ddragonApi.js";
import {useGlobal} from "../contexts/GlobalContext.jsx";
import {getTextColorForChampionTier, getTwoPathPatch} from "../common/stringUtils.js";
import LinkToChampion from "../components/link/LinkToChampion.jsx";
import {BAD_WIN_RATE} from "../common/constants.js";

export default function ChampionsPage() {
  const {currentPatch} = useGlobal();

  const [positionFilter, setPositionFilter] = useState("TOP");
  const [keyFilter, setKeyFilter] = useState("");

  const {
    data: champStatDtos,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['champStatDtos'],
    queryFn: () => fetchAllChampionStats()
  });

  if (isLoading) return <LoadingSpinner/>;
  if (isError) return <div>Error</div>;

  const positionFilterList = ["TOP", "JGL", "MID", "ADC", "SPT", ""];
  const displayChamps = champStatDtos
    .filter(c => c.position.includes(positionFilter))
    .filter(c => c.championName.toLowerCase().includes(keyFilter) || c.championDisplayName.toLowerCase().includes(keyFilter));

  return (
    <div className={"flex flex-col gap-2"}>
      {/* Introduction */}
      <div>
        <div className={"mb-1 font-[600] text-lg"}>LoL Champions Tier List</div>
        <div className={"mb-4 text-text2 font-[500]"}>
          Analytics of Elite tier matches (Master, Grandmaster, Challenger) from VN, KR, NA and EU servers for patch {getTwoPathPatch(currentPatch)}.</div>
      </div>

      {/* Filter section */}
      <div className={"grid grid-cols-1 gap-y-1 sm:grid-cols-2 bg-bg2 w-full border border-bg3 rounded-md"}>
        <div className={"grid grid-cols-6"}>
          {positionFilterList.map((position, index) => (
            <div
              key={position}
              onClick={() => setPositionFilter(position)}
              className={"cursor-pointer flex items-center justify-center border-r border-bg3 h-[50px]"}
            >
              {position === "" ? (
                <Asterisk size={32} strokeWidth={2.5}
                          className={`${positionFilter === position ? "text-text1" : "text-text3"}`}/>
              ) : (
                <PositionIcon position={position} size={20} active={positionFilter === position}/>
              )}
            </div>
          ))}
        </div>
        <div className={"flex items-center py-[5px] px-4 h-[50px]"}>
          <input
            value={keyFilter}
            onChange={(e) => setKeyFilter(e.target.value)}
            placeholder={"Search a champion"}
            className={"w-full h-full focus:outline-none bg-bg1 rounded-md border border-bg3 px-4"}
          />
        </div>
      </div>

      {/* Table */}
      <ChampsTable champs={displayChamps}/>

    </div>
  );
}

function ChampsTable({champs}) {
  const {currentPatch} = useGlobal();

  const [sortKey, setSortKey] = useState("power");
  const [sortDirection, setSortDirection] = useState("DESC");

  function changeSortMethod(newSortKey) {
    if(sortKey === newSortKey) {
      setSortDirection(sortDirection === "DESC" ? "ASC" : "DESC");
    }
    else {
      setSortKey(newSortKey);
      setSortDirection("DESC");
    }
  }

  champs.sort((a, b) => sortDirection === "DESC" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);

  return (
    <div className={"w-full max-w-screen-lg overflow-x-auto bg-bg2 rounded-md"}>
      <table className="table-auto w-[1024px]">
        <thead>
        <tr>
          <th className={`p-3 bg-bg3 font-[500] text-xs text-text2 border-b-2 border-bg3`}>
            Rank
          </th>
          <th className={`p-3 bg-bg3 font-[500] text-xs text-text2 border-b-2 border-bg3`}>
            Role
          </th>
          <th className={`sticky -left-1 p-3 bg-bg3 font-[500] text-xs text-text2 border-b-2 border-bg3`}>
            Champion
          </th>
          <th
            onClick={() => changeSortMethod("power")}
            className={`cursor-pointer p-3 bg-bg3 text-xs border-b-2 ${sortKey === "power" ? "font-[500] text-text1 border-main" : "font-[500] text-text2 border-bg3"}`}
          >
            Tier
          </th>
          <th
            onClick={() => changeSortMethod("winRate")}
            className={`cursor-pointer p-3 bg-bg3 text-xs border-b-2 ${sortKey === "winRate" ? "font-[500] text-text1 border-main" : "font-[500] text-text2 border-bg3"}`}
          >
            Win rate
          </th>
          <th
            onClick={() => changeSortMethod("pickRate")}
            className={`cursor-pointer p-3 bg-bg3 text-xs border-b-2 ${sortKey === "pickRate" ? "font-[500] text-text1 border-main" : "font-[500] text-text2 border-bg3"}`}
          >
            Pick rate
          </th>
          <th
            onClick={() => changeSortMethod("avgKda")}
            className={`cursor-pointer p-3 bg-bg3 text-xs border-b-2 ${sortKey === "avgKda" ? "font-[500] text-text1 border-main" : "font-[500] text-text2 border-bg3"}`}
          >
            Avg. KDA
          </th>
          <th
            onClick={() => changeSortMethod("avgKp")}
            className={`cursor-pointer p-3 bg-bg3 text-xs border-b-2 ${sortKey === "avgKp" ? "font-[500] text-text1 border-main" : "font-[500] text-text2 border-bg3"}`}
          >
            Avg. KP
          </th>
          <th
            onClick={() => changeSortMethod("avgSolokills")}
            className={`cursor-pointer p-3 bg-bg3 text-xs border-b-2 ${sortKey === "avgSolokills" ? "font-[500] text-text1 border-main" : "font-[500] text-text2 border-bg3"}`}
          >
            Avg. 1V1Ks
          </th>
          <th
            onClick={() => changeSortMethod("avgDpm")}
            className={`cursor-pointer p-3 bg-bg3 text-xs border-b-2 ${sortKey === "avgDpm" ? "font-[500] text-text1 border-main" : "font-[500] text-text2 border-bg3"}`}
          >
            Avg. DMG/m
          </th>
          <th className={`p-3 bg-bg3 font-[500] text-xs text-text2 border-b-2 border-bg3`}>
            Counter picks
          </th>
        </tr>
        </thead>
        <tbody className={"divide-y divide-bg4"}>
        {champs.map((champ, index) => (
          <tr key={champ.code}>
            <td className={"h-14"}>
              <div className={"text-center text-text2 font-[500]"}>{index + 1}</div>
            </td>

            <td className={"h-14"}>
              <div className={"flex justify-center items-center"}>
                <PositionIcon position={champ.position} size={18}/>
              </div>
            </td>

            <td className={"sticky -left-1 h-14 bg-bg2"}>
              <div className={" flex items-center gap-[10px] w-[150px] pl-4"}>
                <LinkToChampion championName={champ.championName}>
                  <img
                    alt={"champ-avt"} className={`w-[38px] h-[38px] rounded-xl`}
                    src={getChampionAvatarUrl(champ.championName, currentPatch)}
                    sizes={"50px"}
                  />
                </LinkToChampion>

                <LinkToChampion championName={champ.championName}>
                <div className={"font-[500]"}>{champ.championDisplayName}</div>
                </LinkToChampion>
              </div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] ${getTextColorForChampionTier(champ.tier)}`}>{champ.tier}</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] ${sortKey === "winRate" ? "text-text1" : "text-text2"}`}>{(champ.winRate * 100).toFixed(2)}%</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] ${sortKey === "pickRate" ? "text-text1" : "text-text2"}`}>{(champ.pickRate * 100).toFixed(2)}%</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] ${sortKey === "avgKda" ? "text-text1" : "text-text2"}`}>{(champ.avgKda).toFixed(2)}</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] ${sortKey === "avgKp" ? "text-text1" : "text-text2"}`}>{(champ.avgKp * 100).toFixed(2)}%</div>
            </td>



            <td className={"h-14"}>
              <div className={`text-center font-[500] ${sortKey === "avgSolokills" ? "text-text1" : "text-text2"}`}>{(champ.avgSolokills).toFixed(2)}</div>
            </td>

            <td className={"h-14"}>
              <div className={"flex justify-center items-center"}>
                <div className={`w-16 flex flex-col items-center gap-[4px]`}>
                  <div className={`text-center text-xs font-[500] ${sortKey === "avgDpm" ? "text-text1" : "text-text2"}`}>
                    {(champ.avgDpm).toFixed(0)}
                  </div>
                  <DmgTypeChart physical={champ.avgPhysicalDmg} magic={champ.avgMagicDmg} trueDmg={champ.avgTrueDmg}/>
                </div>
              </div>
            </td>

            <td className={"h-14"}>
              <div className={"flex justify-center gap-1"}>
                {champ.matchUps
                  .filter((m) => m.picks >= 20)
                  .filter((m) => m.winRate < BAD_WIN_RATE)
                  .slice(0, 3).map((matchUp, index) => {
                    return (
                      <div key={index} className="w-6 h-6 overflow-hidden rounded-full">
                      <img
                        alt="avt"
                        src={getChampionAvatarUrl(matchUp.opponentChampionName, currentPatch)}
                        className="w-full h-full object-cover scale-110"
                        sizes={"50px"}
                      />
                    </div>)
                  })}
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

function DmgTypeChart({physical, magic, trueDmg}) {
  const total = physical + magic + trueDmg;
  const physicalPercent = (physical / total) * 100;
  const magicPercent = (magic / total) * 100;
  const trueDmgPercent = (trueDmg / total) * 100;

  return (
    <div className="w-full h-1 flex">
      <div className="bg-lose" style={{width: `${physicalPercent}%`}}/>
      <div className="bg-text1" style={{width: `${trueDmgPercent}%`}}/>
      <div className="bg-win" style={{width: `${magicPercent}%`}}/>
    </div>
  );
}