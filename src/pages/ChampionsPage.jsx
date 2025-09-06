import {useQuery} from "@tanstack/react-query";
import {fetchAllChampionStats} from "../services/challengerggApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import {useState} from "react";
import PositionIcon from "../components/PositionIcon.jsx";
import {Asterisk, Cannabis, LoaderPinwheel} from "lucide-react";
import {getChampionAvatarUrl} from "../services/ddragonApi.js";
import {useGlobal} from "../contexts/GlobalContext.jsx";
import {getTextColorForChampionTier} from "../common/stringUtils.js";

export default function ChampionsPage() {
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
    <div className={"flex flex-col gap-2 pt-10"}>
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

  return (
    <div className={"w-full max-w-screen-lg overflow-x-auto bg-bg2 rounded-md"}>
      {/*{champs.map((champ, index) => {*/}
      {/*  return (*/}
      {/*    <div>{champ.code}</div>*/}
      {/*  )*/}
      {/*})}*/}
      <table className="table-auto w-[1024px]">
        <thead>
        <tr>
          <th className={"p-3 bg-bg3 font-[700] text-xs text-text1"}>Rank</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Role</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Champion</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Tier</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Win rate</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Pick rate</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Avg. Solokills</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Avg. CS/m</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Avg. Dmg/m</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Dmg type</th>
          <th className={"p-3 bg-bg3 font-[500] text-xs text-text2"}>Weak against</th>
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

            <td className={"h-14"}>
              <div className={"flex items-center gap-[10px] w-[150px] pl-4"}>
                <img alt={"champ-avt"} className={`w-[38px] h-[38px] rounded-xl`}
                     src={getChampionAvatarUrl(champ.championName, currentPatch)}/>
                <div className={"font-[500]"}>{champ.championDisplayName}</div>
              </div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] ${getTextColorForChampionTier(champ.tier)}`}>{champ.tier}</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] text-text2`}>{(champ.winRate * 100).toFixed(2)}%</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] text-text2`}>{(champ.pickRate * 100).toFixed(2)}%</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] text-text2`}>{(champ.avgSolokills).toFixed(1)}</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] text-text2`}>{(champ.avgCspm).toFixed(1)}</div>
            </td>

            <td className={"h-14"}>
              <div className={`text-center font-[500] text-text2`}>{(champ.avgDpm).toFixed(0)}</div>
            </td>

            <td className={"h-14"}>
              <div className={"flex justify-center"}>
                <div className={`w-[70px]`}>
                  <DmgTypeChart physical={champ.avgPhysicalDmg} magic={champ.avgMagicDmg} trueDmg={champ.avgTrueDmg}/>
                </div>
              </div>
            </td>

            <td className={"h-14"}>
              <div className={"flex justify-center gap-1"}>
                {champ.matchUps
                  .filter((m) => m.picks >= 20)
                  .filter((m) => m.winRate <= 0.4)
                  .slice(0, 3).map((matchUp, index) => {
                    return (<div key={index} className="w-6 h-6 overflow-hidden rounded-full">
                      <img
                        alt="avt"
                        src={getChampionAvatarUrl(matchUp.opponentChampionName, currentPatch)}
                        className="w-full h-full object-cover scale-110"
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