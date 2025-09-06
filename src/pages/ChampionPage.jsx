import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchChampionStatByChampionName} from "../services/challengerggApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import {useState} from "react";
import {getChampionAvatarUrl, getItemImageUrl} from "../services/ddragonApi.js";
import {useGlobal} from "../contexts/GlobalContext.jsx";
import PositionIcon from "../components/PositionIcon.jsx";
import {getTextColorForChampionTier} from "../common/stringUtils.js";
import {BAD_WIN_RATE, GOOD_WIN_RATE, positionTextFormatMap} from "../common/constants.js";
import LinkToChampion from "../components/link/LinkToChampion.jsx";

export default function ChampionPage() {
  const params = useParams();
  const championName = params.championName;

  const {
    data: statDtos,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["statDtos", championName],
    queryFn: () => fetchChampionStatByChampionName(championName),
  });

  if(isLoading) return <LoadingSpinner/>;
  if(isError) return <div>Error</div>;

  return (
    <BuildDisplay statDtos={statDtos}/>
  )
}

function BuildDisplay({statDtos}) {
  const {currentPatch} = useGlobal();

  const [buildIndex, setBuildIndex] = useState(0);

  const totalPickRate = statDtos.reduce((sum, dto) => sum + dto.pickRate, 0);
  const build = statDtos[buildIndex];

  return (
    <div className={"w-full mt-10 flex flex-col gap-2"}>
      {/* Header */}
      <div className={"flex flex-col w-full bg-bg2 border border-bg3 rounded-md p-5 xs:p-5 gap-8"}>
        {/* General info */}
        <div className={"flex gap-4"}>
          <div className="w-20 h-20 xs:w-24 xs:h-24 overflow-hidden rounded-md shrink-0">
            <img
              alt="avt"
              sizes={"100px"}
              src={getChampionAvatarUrl(build.championName, currentPatch)}
              className="w-full h-full object-cover scale-105"
            />
          </div>
          <div className={"flex flex-col gap-3"}>
            <div className={"flex gap-3 items-center"}>
              <div className={"font-[500] text-xl xs:text-2xl"}>{build.championDisplayName}</div>
              <div className={"font-[500] text-xs xs:text-sm text-text2"}>
                {positionTextFormatMap[build.position]}, Elite Tier, Patch {currentPatch?.split(".").slice(0, 2).join(".")}
              </div>
            </div>

            {/* Position selector */}
            <div className={"flex gap-2 flex-wrap"}>
              {statDtos.map((statDto, index) => {
                const pickRateOnChamp = ((statDto.pickRate/totalPickRate)*100).toFixed(0);
                const isSelected = index === buildIndex;
                return (
                  <div
                    key={statDto.code}
                    className={`cursor-pointer flex gap-3 items-center border border-bg4 rounded-md p-2`}
                    onClick={() => setBuildIndex(index)}
                  >
                    <PositionIcon position={statDto.position} active={isSelected} size={20}/>
                    <div className={`font-[500] ${isSelected ? "text-text1" : "text-text3"}`}>{pickRateOnChamp}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className={"flex border border-bg4 rounded-md py-2.5 w-fit"}>
          <DetailCell title={"Tier"}>
            <div className={`font-[500] xs:text-base ${getTextColorForChampionTier(build.tier)}`}>{build.tier}</div>
          </DetailCell>
          <DetailCell title={"Win rate"}>
            <div className={`font-[500] xs:text-base`}>{(build.winRate*100).toFixed(2)}%</div>
          </DetailCell>
          <DetailCell title={"Pick rate"}>
            <div className={`font-[500] xs:text-base`}>{(build.pickRate*100).toFixed(2)}%</div>
          </DetailCell>
          <DetailCell title={"Matches"} hasRightBorder={false}>
            <div className={`font-[500] xs:text-base`}>{build.picks.toLocaleString()}</div>
          </DetailCell>
        </div>
      </div>

      {/* Body */}
      <Body build={build} />
    </div>
  );

  function DetailCell({title, hasRightBorder = true, children}) {
    return (
      <div className={`flex flex-col px-3.5 xs:px-5 text-center shrink-0 items-center gap-3 ${hasRightBorder && "border-r border-bg4"}`}>
        <div className={"text-xs text-text2 font-[500]"}>{title}</div>
        {children}
      </div>
    )
  }
}

function Body({build}) {
  const {currentPatch} = useGlobal();

  return (
    <div className={"flex flex-col sm:flex-row gap-2"}>
      {/* Runes, spells */}
      <div className={"w-full bg-bg2 border border-bg3 rounded-md"}>
        <div className={"p-2 border-b border-bg3 text-xs text-text2 font-[500]"}>
          {build.championDisplayName} {positionTextFormatMap[build.position]} build
        </div>
      </div>

      {/* Best items, match-ups */}
      <div className={"w-full sm:w-[640px] flex flex-col gap-2"}>
        {/* Best items */}
        <div className={"w-full bg-bg2 border border-bg3 rounded-md"}>
          <div className={"p-2 border-b border-bg3 text-xs text-text2 font-[500]"}>Best Items</div>
          <div className={"flex flex-col w-full h-[510px] overflow-y-auto"}>
            {build.bestLegendaryItems.slice(0, 20).map((item, index) => (
              <ItemWinAndPickRateRow item={item} key={index} />
            ))}
          </div>
        </div>

        {/* Match-ups */}
        <div className={"w-full bg-bg2 border border-bg3 rounded-md"}>
          <div className={"p-2 border-b border-bg3 text-xs text-text2 font-[500]"}>Popular Match-ups</div>
          <div className={"flex flex-col w-full h-[510px] overflow-y-auto"}>
            {build.matchUps.filter(m => m.picks >= 10).map((matchUp, index) => (
              <MatchUpWinAndPickRateRow matchUp={matchUp} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  function ItemWinAndPickRateRow({item}) {
    let winRateColorClassName = "text-lose";
    if(item.winRate >= BAD_WIN_RATE) winRateColorClassName = "text-text2";
    if(item.winRate >= GOOD_WIN_RATE) winRateColorClassName = "text-win";
    return (
      <div className={"w-full flex justify-between items-center p-2 pr-4 border-b border-bg3"}>
        <img alt={"item-img"} src={getItemImageUrl(item.itemId, currentPatch)} className={"w-8 h-8 rounded-md"} />
        <div className={"flex flex-col items-center gap-0.5"}>
          <div className={"text-xs font-[600]"}>{(item.pickRate*100).toFixed(2)}%</div>
          <div className={"text-xs text-text2"}>{item.picks} games</div>
          {/*<div className={"text-xs text-text2"}>{item.itemId}</div>*/}
        </div>
        <div className={`text-xs ${winRateColorClassName} font-[600] w-[40px]`}>{(item.winRate*100).toFixed(2)}%</div>
      </div>
    )
  }

  function MatchUpWinAndPickRateRow({matchUp}) {
    let winRateColorClassName = "text-lose";
    if(matchUp.winRate >= BAD_WIN_RATE) winRateColorClassName = "text-text2";
    if(matchUp.winRate >= GOOD_WIN_RATE) winRateColorClassName = "text-win";
    return (
      <div className={"w-full flex justify-between items-center p-2 pr-4 border-b border-bg3"}>
        <div className={"relative flex items-center"}>
          <LinkToChampion championName={matchUp.opponentChampionName}>
            <img alt={"item-img"} src={getChampionAvatarUrl(matchUp.opponentChampionName, currentPatch)} className={"w-8 h-8 rounded-xl"} />
          </LinkToChampion>
          <div className={"absolute text-xs font-[500] left-10 w-[80px] truncate"}>
            <LinkToChampion championName={matchUp.opponentChampionName}>{matchUp.opponentChampionDisplayName}</LinkToChampion>

          </div>
        </div>
        <div className={"flex flex-col items-center gap-0.5"}>
          <div className={"text-xs font-[600]"}>{(matchUp.pickRate*100).toFixed(2)}%</div>
          <div className={"text-xs text-text2"}>{matchUp.picks} games</div>
          {/*<div className={"text-xs text-text2"}>{item.itemId}</div>*/}
        </div>
        <div className={`text-xs ${winRateColorClassName} font-[600] w-[40px]`}>{(matchUp.winRate*100).toFixed(2)}%</div>
      </div>
    )
  }
}



