import {useGlobal} from "../contexts/GlobalContext.jsx";
import {
  getChampionAvatarUrl, getItemImageUrl,
  getRuneImageUrl,
  getRuneStyleImageUrl,
  getSpellImageUrl
} from "../services/ddragonApi.js";
import {Bookmark, ChevronDown, Star} from "lucide-react";
import {useState} from "react";
import {queueEnumToShortTextMap} from "../common/constants.js";
import {
  formatSecondsToMinutesAndSeconds,
  getTimeSinceGameStart, kdaFormat, placementToDisplayString
} from "../common/stringUtils.js";
import KbScoreDisplay from "../components/KbScoreDisplay.jsx";
import PositionIcon from "./PositionIcon.jsx";
import LinkToProfile from "./link/LinkToProfile.jsx";
import LinkToChampion from "./link/LinkToChampion.jsx";
import TextTooltip from "./TextTooltip.jsx";

export default function MatchCard({matchDto, puuid}) {
  const {currentPatch} = useGlobal();

  const [isDisplayDetail, setIsDisplayDetail] = useState(false);

  const selfPerformance = matchDto.performances.find(p => p.puuid === puuid);
  const win = selfPerformance.win;

  return (
    <div>
      {/* Match Card */}
      <div
        className={`
          flex justify-between cursor-pointer
          bg-gradient-to-br ${win ? "from-win/20" : "from-lose/20"} via-bg2 to-bg2 border border-bg3 rounded-[5px] px-3 py-2.5 border-l-[5px] ${win ? "border-l-win" : "border-l-lose"}
        `}
        onClick={() => {
          setIsDisplayDetail(!isDisplayDetail)
        }}
      >
        {/* Match overall info */}
        <div className={"flex flex-col justify-between w-[84px]"}>
          <div className={"flex flex-col"}>
            <div className={`font-[500] ${win ? "text-win" : "text-lose"}`}>
              {queueEnumToShortTextMap[matchDto.queue]}
            </div>
            <div className={`text-xs text-text2`}>
              {getTimeSinceGameStart(matchDto.startTimeStamp)}
            </div>
          </div>
          <div className={"flex flex-col gap-[3px]"}>
            <div className={`text-xs font-[500]`}>
              {win ? "Victory" : "Defeat"}
            </div>
            <div className={`text-xs text-text2`}>
              {formatSecondsToMinutesAndSeconds(matchDto.duration)}
            </div>
          </div>
        </div>

        {/* Player info */}
        <div className={"flex flex-col gap-2"}>
          {/* Champ, spell, rune display */}
          <div className={"flex gap-[2px]"}>
            <div className={"relative"}>
              <LinkToChampion championName={selfPerformance.championName} position={selfPerformance.position}>
                <img
                  alt={"champ-avt"}
                  src={getChampionAvatarUrl(selfPerformance.championName, currentPatch)}
                  className={`w-[54px] h-[54px] rounded-md outline-2 -outline-offset-3 ${win ? "outline-win" : "outline-lose"}`}
                />
              </LinkToChampion>

              {selfPerformance.position !== "UNK" && (
                <div className={"absolute -bottom-[1px] -right-[1px] bg-bg4 p-[2px] rounded-sm"}>
                  <PositionIcon position={selfPerformance.position}/>
                </div>
              )}
            </div>

            <div className={"flex flex-col gap-[2px]"}>
              <img
                alt={"spell1"}
                src={getSpellImageUrl(selfPerformance.spell1Id, currentPatch)}
                className={`w-[26px] h-[26px] rounded-md`}
              />
              <img
                alt={"spell2"}
                src={getSpellImageUrl(selfPerformance.spell2Id, currentPatch)}
                className={`w-[26px] h-[26px] rounded-md`}
              />
            </div>
            <div className={"flex flex-col gap-[2px]"}>
              <div className={"w-[26px] h-[26px] rounded-[100%] bg-bg1 p-[1px]"}>
                <img
                  alt={"mainRune"}
                  src={getRuneImageUrl(selfPerformance.runeMain)}
                  className={`rounded-md`}
                />
              </div>

              <div className={"w-[26px] h-[26px] rounded-[100%] bg-bg1 p-1"}>
                <img
                  alt={"subRune"}
                  src={getRuneStyleImageUrl(selfPerformance.runeSubStyle)}
                  className={`rounded-md`}
                />
              </div>
            </div>
            <div className={'flex flex-col justify-center items-center w-20 '}>
              <div
                className={"font-[500]"}>{selfPerformance.kills} / {selfPerformance.deaths} / {selfPerformance.assists}</div>
              <div className={"font-[500] text-xs text-text2"}>{kdaFormat(selfPerformance.kda)} KDA</div>
            </div>
          </div>

          {/* Items */}
          <div className={"flex gap-[2px]"}>
            {selfPerformance.itemIds.map((itemId, index) =>
              itemId !== 0 ? (
                <img
                  key={index}
                  alt="item"
                  src={getItemImageUrl(itemId, currentPatch)}
                  className="w-[26px] h-[26px] rounded-md"
                />
              ) : (
                <div
                  key={index}
                  className="w-[26px] h-[26px] rounded-md bg-bg3 shrink-0"
                />
              )
            )}
          </div>
        </div>

        {/* KB Score display */}
        <div className={"hidden xs:flex flex-col gap-[6px] justify-center items-center"}>
          <div className={"text-xs text-text2"}>KB Score</div>
          <KbScoreDisplay score={selfPerformance.kbScore}/>
          <div
            className={`text-xs font-[500] ${selfPerformance.mvp ? "text-main" : selfPerformance.svp ? "text-text1" : "text-text2"}`}
          >
            {placementToDisplayString(selfPerformance.kbScorePlacement, selfPerformance.mvp, selfPerformance.svp)}
          </div>
        </div>

        {/* Players display */}
        <div className={"hidden sm:flex"}>
          <FivePlayerDisplay startIndex={0}></FivePlayerDisplay>
          <FivePlayerDisplay startIndex={5}></FivePlayerDisplay>
        </div>

        {/* Open detail button */}
        <div className={"flex flex-col justify-end items-center"}>
          <ChevronDown size={20} className={`hidden xs:block ${isDisplayDetail && "rotate-180"}`}/>
          <ChevronDown size={18} className={`block xs:hidden ${isDisplayDetail && "rotate-180"}`}/>
        </div>
      </div>

      {/* Detail part */}
      {isDisplayDetail && (
        <MatchDetail matchDto={matchDto}/>
      )}

    </div>
  );


  function FivePlayerDisplay({startIndex}) {
    return (
      <div className={"flex flex-col w-24"}>
        {matchDto.performances.slice(startIndex, startIndex + 5).map((performance, index) => (
          <div key={index} className={"flex items-center gap-1"}>
            <img
              alt={"champ-avt"}
              className={"w-[18px] h-[18px] rounded-[100%]"}
              src={getChampionAvatarUrl(performance.championName, currentPatch)}
            />
            <LinkToProfile gameName={performance.gameName} tagLine={performance.tagLine} region={matchDto.region}>
              <div
                className={`text-xs w-16 truncate ${performance.puuid === puuid ? "text-text1" : "text-text2"} hover:text-text1 hover:underline`}>
                {performance.gameName}
              </div>
            </LinkToProfile>

          </div>

        ))}
      </div>
    );
  }
}

function MatchDetail({matchDto}) {
  const {currentPatch} = useGlobal();

  let highestDmg = 0;
  matchDto.performances.forEach((performance) => {
    if (performance.totalDamageDealt > highestDmg)
      highestDmg = performance.totalDamageDealt;
  });

  return (
    <div className="w-full bg-bg2 mt-1 border border-bg3 rounded-md overflow-x-auto">
      <table className="table-auto w-[718px] shrink-0 text-center">
        <thead>
        <tr>
          <th className={"text-start font-[400] text-text2 text-xs p-2 bg-bg3"}>Scoreboard</th>
          <th className={"font-[400] text-text2 text-xs p-2 bg-bg3"}>KB Score</th>
          <th className={"font-[400] text-text2 text-xs p-2 bg-bg3"}>KDA</th>
          <th className={"font-[400] text-text2 text-xs p-2 bg-bg3"}>Damage</th>
          <th className={"font-[400] text-text2 text-xs p-2 bg-bg3"}>CS</th>
          <th className={"font-[400] text-text2 text-xs p-2 bg-bg3"}>Ward</th>
          <th className={"font-[400] text-text2 text-xs p-2 bg-bg3"}>Items</th>
        </tr>
        </thead>
        <tbody className={"divide-y divide-bg4"}>
        {matchDto.performances.map((performance, index) => (
          <tr key={index}>
            {/* Champ, rune, player cell */}
            <td className={"text-start p-2"}>
              <div className={"flex gap-[2px] items-center"}>
                <div>
                  <LinkToChampion championName={performance.championName} position={performance.position}>
                    <div className={"relative"}>
                      <img
                        alt={"champ-avt"}
                        src={getChampionAvatarUrl(performance.championName, currentPatch)}
                        className={`w-[38px] h-[38px] rounded-[100%] outline-2 -outline-offset-2 ${performance.win ? "outline-win" : "outline-lose"}`}
                      />
                      <div className={"absolute -bottom-0.5 right-0 font-[500] text-[11px] p-[2px] bg-bg1 rounded-full"}>{performance.championLevel}</div>
                    </div>
                  </LinkToChampion>
                </div>
                <div className={"flex flex-col gap-[2px]"}>
                  <img
                    alt={"spell1"}
                    src={getSpellImageUrl(performance.spell1Id, currentPatch)}
                    className={`w-[18px] h-[18px] rounded-md`}
                  />
                  <img
                    alt={"spell2"}
                    src={getSpellImageUrl(performance.spell2Id, currentPatch)}
                    className={`w-[18px] h-[18px] rounded-md`}
                  />
                </div>
                <div className={"flex flex-col gap-[2px]"}>
                  <div className={"w-[18px] h-[18px] rounded-[100%] bg-bg1 p-[1px]"}>
                    <img
                      alt={"mainRune"}
                      src={getRuneImageUrl(performance.runeMain)}
                      className={`rounded-md`}
                    />
                  </div>
                  <div className={"w-[18px] h-[18px] rounded-[100%] bg-bg1 p-1"}>
                    <img
                      alt={"subRune"}
                      src={getRuneStyleImageUrl(performance.runeSubStyle)}
                      className={`rounded-md`}
                    />
                  </div>
                </div>
                <LinkToProfile gameName={performance.gameName} tagLine={performance.tagLine} region={matchDto.region}>
                  <div className={"w-20 truncate text-xs ml-1 hover:underline"}>{performance.gameName}</div>
                </LinkToProfile>
              </div>
            </td>

            {/* KB Score cell */}
            <td className={"p-2"}>
              <div className={"flex items-center gap-1.5"}>
                <KbScoreDisplay score={performance.kbScore}/>
                <div
                  className={`text-center w-6 text-xs font-[500] ${performance.mvp ? "text-main" : performance.svp ? "text-text1" : "text-text2"}`}
                >
                  {placementToDisplayString(performance.kbScorePlacement, performance.mvp, performance.svp)}
                </div>
              </div>

            </td>

            {/* KDA cell */}
            <td className={"p-2"}>
              <TextTooltip text={"KDA, KDA score and Kill Participation"}>
              <div className={'flex flex-col justify-center items-center w-16'}>
                <div
                  className={"font-[500] text-xs"}>{performance.kills} / {performance.deaths} / {performance.assists}</div>
                <div
                  className={"text-xs text-text2"}>{kdaFormat(performance.kda)} ({(performance.killParticipation * 100).toFixed(0)}%)
                </div>
              </div>
              </TextTooltip>
            </td>

            {/* Damage cell */}
            <td className="p-2">
              <div className="flex flex-col gap-1 h-full">
                <div className="text-xs font-[500]">{performance.totalDamageDealt}</div>
                <DamageChart damage={performance.totalDamageDealt} highestDamage={highestDmg}/>
              </div>
            </td>

            {/* CS cell*/}
            <td className={"p-2"}>
              <TextTooltip text={"CS and Total Gold"}>
              <div className={"flex flex-col gap-[2px]"}>
                <div className="text-xs font-[500]">{performance.totalCs}</div>
                <div className="text-xs font-[500] text-text2">{performance.totalGold}</div>
              </div>
              </TextTooltip>
            </td>

            {/* Vision cell */}
            <td className={"p-2"}>
              <TextTooltip text={"Pink wards, Wards placed and Wards killed"}>
              <div className={"flex flex-col gap-[2px]"}>
                <div className="text-xs font-[500]">{performance.pinkWardsPlaced}</div>
                <div
                  className="text-xs font-[500] text-text2">{performance.wardsPlaced} / {performance.wardsKilled}</div>
              </div>
              </TextTooltip>
            </td>

            {/* Items cell */}
            <td className={"p-2"}>
              <div className={"flex gap-[2px]"}>
                {performance.itemIds.map((itemId, index) =>
                  itemId !== 0 ? (
                    <img
                      key={index}
                      alt="item"
                      src={getItemImageUrl(itemId, currentPatch)}
                      className="w-[22px] h-[22px] rounded-sm"
                    />
                  ) : (
                    <div
                      key={index}
                      className="w-[22px] h-[22px] rounded-md bg-bg3 shrink-0"
                    />
                  )
                )}
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

function DamageChart({damage, highestDamage}) {
  // prevent division by 0
  const percent = highestDamage > 0
    ? Math.round((damage / highestDamage) * 100)
    : 0;

  return (
    <div className="w-16 h-1 flex">
      <div
        className="h-1 bg-lose"
        style={{width: `${percent}%`}}
      />
      <div
        className="h-1 bg-bg4"
        style={{width: `${100 - percent}%`}}
      />
    </div>
  );
}