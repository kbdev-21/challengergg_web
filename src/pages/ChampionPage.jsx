import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchChampionStatByChampionName} from "../services/challengerggApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import {useEffect, useState} from "react";
import {
  getChampionAvatarUrl,
  getItemImageUrl,
  getRuneImageUrl,
  getRuneStyleImageUrl,
  getSpellImageUrl
} from "../services/ddragonApi.js";
import {useGlobal} from "../contexts/GlobalContext.jsx";
import PositionIcon from "../components/PositionIcon.jsx";
import {getTextColorForChampionTier, getTwoPathPatch, getWinRateColorClassName} from "../common/stringUtils.js";
import {BAD_WIN_RATE, GOOD_WIN_RATE, positionTextFormatMap} from "../common/constants.js";
import LinkToChampion from "../components/link/LinkToChampion.jsx";
import FullRuneBoard from "../components/FullRuneBoard.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

export default function ChampionPage() {
  const { championName } = useParams();

  const {
    data: statDtos,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["statDtos", championName],
    queryFn: () => fetchChampionStatByChampionName(championName),
  });

  if(isLoading) return <LoadingSpinner/>;
  if(isError) return <ErrorAlert/>;
  if(statDtos.length === 0) return <ErrorAlert/>;

  return (
    <BuildDisplay statDtos={statDtos}/>
  )
}

/* TODO: use position instead of index */
function BuildDisplay({statDtos}) {
  const {position} = useParams();
  const {currentPatch} = useGlobal();

  const navigate = useNavigate();

  // find index based on URL param
  const initialIndex = position
    ? statDtos.findIndex((dto) => dto.position === position.toUpperCase())
    : 0;

  const [buildIndex, setBuildIndex] = useState(initialIndex === -1 ? 0 : initialIndex);

  // if the URL param changes, update index
  useEffect(() => {
    if (position) {
      const idx = statDtos.findIndex((dto) => dto.position === position.toUpperCase());
      if (idx !== -1) {
        setBuildIndex(idx);
      } else {
        navigate(`/champions/${statDtos[0].championName}`, { replace: true });
      }
    }
  }, [position, statDtos]);

  const totalPickRate = statDtos.reduce((sum, dto) => sum + dto.pickRate, 0);
  const build = statDtos[buildIndex];

  return (
    <div className={"w-full flex flex-col gap-2"}>
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
                {positionTextFormatMap[build.position]}, Global Elite tier,
                Patch {getTwoPathPatch(currentPatch)}
              </div>
            </div>

            {/* Position selector */}
            <div className={"flex gap-2 flex-wrap"}>
              {statDtos.map((statDto, index) => {
                const pickRateOnChamp = ((statDto.pickRate / totalPickRate) * 100).toFixed(0);
                const isSelected = index === buildIndex;
                return (
                  <div
                    key={statDto.code}
                    className={`${isSelected && "bg-bg4"} cursor-pointer flex gap-3 items-center border border-bg4 rounded-md p-2`}
                    onClick={() => {
                      setBuildIndex(index);
                      navigate(`/champions/${build.championName}/${statDto.position.toLowerCase()}`, {replace: true});
                    }}
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
            <div className={`font-[500] xs:text-base`}>{(build.winRate * 100).toFixed(2)}%</div>
          </DetailCell>
          <DetailCell title={"Pick rate"}>
            <div className={`font-[500] xs:text-base`}>{(build.pickRate * 100).toFixed(2)}%</div>
          </DetailCell>
          <DetailCell title={"Matches"} hasRightBorder={false}>
            <div className={`font-[500] xs:text-base`}>{build.picks.toLocaleString()}</div>
          </DetailCell>
        </div>
      </div>

      {/* Body */}
      <Body build={build}/>
    </div>
  );

  function DetailCell({title, hasRightBorder = true, children}) {
    return (
      <div
        className={`flex flex-col px-3.5 xs:px-5 text-center shrink-0 items-center gap-3 ${hasRightBorder && "border-r border-bg4"}`}>
        <div className={"text-xs text-text2 font-[500]"}>{title}</div>
        {children}
      </div>
    )
  }
}

function Body({build}) {
  const {currentPatch} = useGlobal();

  const [runeIndexSelected, setRuneIndexSelected] = useState(0);

  return (
    <div className={"flex flex-col sm:flex-row gap-2"}>
      {/* Runes, spells, boots */}
      <div className={"w-full bg-bg2 border border-bg3 rounded-md"}>
        {/* Title */}
        <div className={"p-2 border-b border-bg3 text-xs text-text2 font-[500]"}>
          {build.championDisplayName} {positionTextFormatMap[build.position]} Build
        </div>

        {/* Real body */}
        <div className={"p-2 flex flex-col gap-6"}>
          {/* Rune selectors */}
          <div className={"flex gap-2"}>
            <RuneSelector index={0}/>
            <RuneSelector index={1}/>
          </div>

          {/* Rune board */}
          <div className={"w-full max-w-[458px] flex flex-col gap-6 items-center"}>
            <div className={"text-xs font-[500] text-text2"}>Recommended Rune Build</div>
            <FullRuneBoard runeDto={build.bestRunes[runeIndexSelected]}/>
          </div>

          {/* Spells and boots */}
          <div className={"mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-y-2 pt-2"}>
            <div className={"flex flex-col lg:border-r border-bg3"}>
              <div className={"mb-1 text-xs font-[500] text-text2"}>Spells</div>
              {build.bestSpellCombos.filter(s => s.picks >= 10).slice(0,2).map((spell, index) => (
                <SpellComboWinAndPickRateRow key={index} spellCombo={spell}/>
              ))}
            </div>
            <div className={"lg:pl-2 flex flex-col"}>
              <div className={"mb-1 text-xs font-[500] text-text2 "}>Boots</div>
              {build.bestBootItems.filter(b => b.picks >= 10).slice(0,2).map((item, index) => (
                <BootWinAndPickRateRow key={index} item={item}/>
              ))}
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>

      {/* Best items, match-ups */}
      <div className={"w-full sm:w-[640px] flex flex-col gap-2"}>
        {/* Best items */}
        <div className={"w-full bg-bg2 border border-bg3 rounded-md"}>
          <div className={"p-2 border-b border-bg3 text-xs text-text2 font-[500]"}>{build.championDisplayName} Items
          </div>
          <div className={"flex flex-col w-full h-[510px] overflow-y-auto"}>
            {build.bestLegendaryItems.slice(0, 20).map((item, index) => (
              <ItemWinAndPickRateRow item={item} key={index}/>
            ))}
          </div>
        </div>

        {/* Match-ups */}
        <div className={"w-full bg-bg2 border border-bg3 rounded-md"}>
          <div
            className={"p-2 border-b border-bg3 text-xs text-text2 font-[500]"}>{build.championDisplayName} Matchups
          </div>
          <div className={"flex flex-col w-full h-[510px] overflow-y-auto"}>
            {build.matchUps.filter(m => m.picks >= 10).map((matchUp, index) => (
              <MatchUpWinAndPickRateRow matchUp={matchUp} key={index}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  function ItemWinAndPickRateRow({item}) {
    return (
      <div className={"w-full flex justify-between items-center p-2 pr-4 border-b border-bg3"}>
        <img alt={"item-img"} src={getItemImageUrl(item.itemId, currentPatch)} className={"w-8 h-8 rounded-md"}/>
        <div className={"flex flex-col items-center gap-0.5"}>
          <div className={"text-xs font-[600]"}>{(item.pickRate * 100).toFixed(2)}%</div>
          <div className={"text-xs text-text2"}>{item.picks} games</div>
          {/*<div className={"text-xs text-text2"}>{item.itemId}</div>*/}
        </div>
        <div
          className={`text-xs ${getWinRateColorClassName(item.winRate)} font-[600] w-[40px]`}>{(item.winRate * 100).toFixed(2)}%
        </div>
      </div>
    )
  }

  function BootWinAndPickRateRow({item}) {
    return (
      <div className={"w-full flex justify-between items-center py-2 pl-0 pr-4 border-t border-bg3"}>
        <div className={"w-[70px] lg:w-fit"}>
          <img alt={"item-img"} src={getItemImageUrl(item.itemId, currentPatch)} className={"w-8 h-8 rounded-md"}/>
        </div>
        <div className={"flex flex-col items-center gap-0.5"}>
          <div className={"text-xs font-[600]"}>{(item.pickRate * 100).toFixed(2)}%</div>
          <div className={"text-xs text-text2"}>{item.picks} games</div>
          {/*<div className={"text-xs text-text2"}>{item.itemId}</div>*/}
        </div>
        <div
          className={`text-xs ${getWinRateColorClassName(item.winRate)} font-[600] w-[40px]`}>{(item.winRate * 100).toFixed(2)}%
        </div>
      </div>
    )
  }

  function SpellComboWinAndPickRateRow({spellCombo}) {
    return (
      <div className={"w-full flex justify-between items-center py-2 pl-0 pr-4 border-t border-bg3"}>
        <div className={"flex gap-1 w-[70px]"}>
          <img alt={"item-img"} src={getSpellImageUrl(spellCombo.spell1, currentPatch)} className={"w-8 h-8 rounded-md"}/>
          <img alt={"item-img"} src={getSpellImageUrl(spellCombo.spell2, currentPatch)} className={"w-8 h-8 rounded-md"}/>
        </div>

        <div className={"flex flex-col items-center gap-0.5"}>
          <div className={"text-xs font-[600]"}>{(spellCombo.pickRate * 100).toFixed(2)}%</div>
          <div className={"text-xs text-text2"}>{spellCombo.picks} games</div>
          {/*<div className={"text-xs text-text2"}>{item.itemId}</div>*/}
        </div>
        <div
          className={`text-xs ${getWinRateColorClassName(spellCombo.winRate)} font-[600] w-[40px]`}>{(spellCombo.winRate * 100).toFixed(2)}%
        </div>
      </div>
    )
  }

  function MatchUpWinAndPickRateRow({matchUp}) {
    return (
      <div className={"w-full flex justify-between items-center p-2 pr-4 border-b border-bg3"}>
        <div className={"relative flex items-center"}>
          <LinkToChampion championName={matchUp.opponentChampionName}>
            <img
              sizes={"50px"}
              alt={"item-img"}
              src={getChampionAvatarUrl(matchUp.opponentChampionName, currentPatch)} className={"w-8 h-8 rounded-xl"}
            />
          </LinkToChampion>
          <div className={"absolute text-xs font-[500] left-10 w-[80px] truncate"}>
            <LinkToChampion
              championName={matchUp.opponentChampionName}>{matchUp.opponentChampionDisplayName}</LinkToChampion>

          </div>
        </div>
        <div className={"flex flex-col items-center gap-0.5"}>
          <div className={"text-xs font-[600]"}>{(matchUp.pickRate * 100).toFixed(2)}%</div>
          <div className={"text-xs text-text2"}>{matchUp.picks} games</div>
        </div>
        <div
          className={`text-xs ${getWinRateColorClassName(matchUp.winRate)} font-[600] w-[40px]`}>{(matchUp.winRate * 100).toFixed(2)}%
        </div>
      </div>
    );
  }

  function RuneSelector({index}) {
    return (
      <div onClick={() => setRuneIndexSelected(index)}
           className={`cursor-pointer ${index === runeIndexSelected && "bg-bg4"} p-3 border border-bg4 rounded-md w-full max-w-[225px] flex flex-col gap-6 items-center`}>
        <div className={"flex gap-1.5 items-center"}>
          <img className={"h-6 w-6"} alt={"rune-img"} src={getRuneStyleImageUrl(build.bestRunes[index].mainStyle)}/>
          <div className={"h-9 w-9 bg-bg1 rounded-[100%] p-[1px] mr-1"}>
            <img alt={"rune-img"} src={getRuneImageUrl(build.bestRunes[index].main)}/>
          </div>
          <img className={"h-6 w-6"} alt={"rune-img"} src={getRuneStyleImageUrl(build.bestRunes[index].subStyle)}/>
        </div>
        <div className={"w-full flex justify-around items-center"}>
          <div className={"flex flex-col items-center gap-0.5"}>
            <div className={"text-xs font-[600]"}>{(build.bestRunes[index].pickRate * 100).toFixed(2)}%</div>
            <div className={"text-xs text-text2"}>{build.bestRunes[index].picks} games</div>
          </div>
          <div
            className={`text-xs ${getWinRateColorClassName(build.bestRunes[index].winRate)} font-[600] w-[40px]`}>{(build.bestRunes[index].winRate * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    )
  }
}



