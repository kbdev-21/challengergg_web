import ComingSoon from "../ComingSoon.jsx";
import {fetchMatchesByPuuid, fetchPlayerChampionStatsByPuuid} from "../../services/challengerggApi.js";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {upperCaseFirstLowerCaseAll} from "../../common/stringUtils.js";
import {positionTextFormatMap, queueEnumToTextMap, rankImgMap} from "../../common/constants.js";
import {ChevronRight} from "lucide-react";
import LoadingSpinner from "../LoadingSpinner.jsx";
import MatchCard from "../MatchCard.jsx";
import ErrorAlert from "../ErrorAlert.jsx";
import {getChampionAvatarUrl} from "../../services/ddragonApi.js";
import {useGlobal} from "../../contexts/GlobalContext.jsx";
import {Link} from "react-router-dom";
import {useState} from "react";

export default function OverviewSection({ playerData }) {
  const puuid = playerData.puuid;
  const region = playerData.region;

  const initMatches = 15;
  const additionFetchMatches = 10;

  const [showMoreButtonClickedCount, setShowMoreButtonClickedCount] = useState(0);

  const {
    data: matchPages,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["matchDtos", puuid, region],
    queryFn: ({ pageParam = 0 }) => {
      const limit = pageParam === 0 ? initMatches : additionFetchMatches;
      return fetchMatchesByPuuid(puuid, pageParam, limit, region);
    },
    getNextPageParam: (lastPage, allPages) => {
      const limit = allPages.length === 1 ? initMatches : additionFetchMatches;
      if (lastPage.length < limit) return undefined;
      return allPages
        .map((page, index) =>
          index === 0 ? page.length : additionFetchMatches
        )
        .reduce((a, b) => a + b, 0);
    },
  });

  if(isLoading) return <LoadingSpinner/>;
  if(isError) return <div>Error</div>;

  const matchDtos = matchPages.pages.flat();

  return (
    <div className={"flex flex-col lg:flex-row gap-2 mt-2 w-full"}>
      {/* Left part */}
      <div className={"flex-1 flex flex-col gap-2"}>
        {/* Rank display */}
        <div className={"bg-bg2 border border-bg3 p-3 flex flex-col gap-2 rounded-md"}>
          <RankDisplay index={0} />
          <div className={"border-t border-t-bg4 w-full mt-1 mb-2"}></div>
          <RankDisplay index={1} />
        </div>
        {/* Stat display */}
        <div className={"bg-bg2 border border-bg3 p-3 flex flex-col gap-2 rounded-md"}>
          <div className={"flex justify-between items-center pb-1"}>
            <div>Champions</div>
            <Link to={`/profile/${region.toLowerCase()}/${playerData.gameName}-${playerData.tagLine}/champions`}>
              <ChevronRight size={16} className={"cursor-pointer"}/>
            </Link>

          </div>
          <ChampionsDisplay playerData={playerData} puuid={playerData.puuid}/>
        </div>
      </div>

      {/* Match history */}
      <div className={"w-full lg:w-[720px] flex flex-col gap-2"}>
        {matchDtos.map((matchDto) => (
          <div key={matchDto.matchId}>
            <MatchCard matchDto={matchDto} puuid={puuid} />
          </div>
        ))}

        <button
          className={
            "w-full h-12 bg-bg2 rounded-md border border-bg3 flex justify-center items-center text-text2 cursor-pointer"
          }
          onClick={() => {
            setShowMoreButtonClickedCount(showMoreButtonClickedCount + 1);
            fetchNextPage();
          }}
          disabled={isFetchingNextPage || !hasNextPage || showMoreButtonClickedCount >= 1}
        >
          {isFetchingNextPage ? <LoadingSpinner marginTop={false}/> : hasNextPage ? "Show more matches" : "No more matches"}
        </button>
      </div>
    </div>
  );

  function RankDisplay({ index }) {
    return (
      <>
        <div className={"font-[400] text-sm"}>
          {queueEnumToTextMap[playerData.ranks[index].queue]}
        </div>
        <div className={"flex gap-2"}>
          <img
            sizes={"100px"}
            src={rankImgMap[playerData.ranks[index].tier]}
            alt={"rank"}
            className={"w-20"}
          />
          <div className={"flex w-full justify-between mt-3 h-[45px]"}>
            <div className={"flex flex-col justify-between"}>
              <div className={"font-[500] text-base"}>
                {upperCaseFirstLowerCaseAll(playerData.ranks[index].tier)}{" "}
                {!["CHALLENGER", "GRANDMASTER", "MASTER"].includes(
                  playerData.ranks[index].tier
                )
                  ? playerData.ranks[index].division
                  : ""}
              </div>
              <div className={"text-xs text-text2"}>{playerData.ranks[index].points} LP</div>
            </div>
            <div className={"flex flex-col justify-between items-end mt-1"}>
              <div className={"text-xs text-text2"}>
                {playerData.ranks[index].wins}W {playerData.ranks[index].losses}L
              </div>
              <div className={"text-xs text-text2"}>
                Win rate {(playerData.ranks[index].winRate * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function ChampionsDisplay({playerData}) {
  const {currentPatch} = useGlobal();

  const {
    data: playerChampStatDtos,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["playerChampStatDtos", playerData.puuid],
    queryFn: () => fetchPlayerChampionStatsByPuuid(playerData.puuid),
  })

  if(isLoading) return <LoadingSpinner/>;
  if(isError) return <ErrorAlert/>;

  return (
    <div className={"w-full"}>
      {playerChampStatDtos.length > 0 ? (
        <div className={"flex flex-col"}>
          {playerChampStatDtos.slice(0, 10).map((statDto, index) => (
            <ChampionStatRow stat={statDto} key={index} />
          ))}
        </div>
      ) : (
        <div className={"text-text2 text-xs text-center my-10"}>You have no Ranked Matches to analyze</div>
      )}
      <Link
        to={`/profile/${playerData.region.toLowerCase()}/${playerData.gameName}-${playerData.tagLine}/champions`}
        replace={true}
        className={"cursor-pointer text-text2 text-xs w-full flex justify-center border-t border-bg3 pt-3"}
      >
        Show more + details
      </Link>
    </div>
  );

  function ChampionStatRow({stat}) {
    return (
      <div className={"w-full flex justify-between items-center py-2 border-t border-bg3"}>
        <div className={"flex gap-2"}>
          <div className="w-8 h-8 overflow-hidden rounded-full">
            <img
              alt="avt"
              src={getChampionAvatarUrl(stat.championName, currentPatch)}
              className="w-full h-full object-cover scale-110"
              sizes={"50px"}
            />
          </div>
          <div>
            <div className={"font-[500]"}>
              {stat.championDisplayName}
            </div>
            <div className={"text-xs font-[500] text-text2"}>
              {positionTextFormatMap[stat.position]}
            </div>
          </div>
        </div>
        <div className={"flex justify-end items-center gap-2"}>
          <WinRateChart wins={stat.wins} losses={stat.picks - stat.wins} />
          <div className={"text-xs font-[500] text-text2 w-[30px]"}>{(stat.winRate*100).toFixed(0)}%</div>
        </div>
      </div>
    )
  }

  function WinRateChart({ wins, losses }) {
    const total = wins + losses;
    const winRatePercent = total > 0 ? (wins / total) * 100 : 0;
    const lossRatePercent = total > 0 ? (losses / total) * 100 : 0;

    return (
      <div className="flex h-4.5 w-[86px] overflow-hidden rounded-sm">
        {winRatePercent > 0 && (
          <div
            className="bg-win flex justify-start items-center pl-1.5 text-[11px] font-[500] text-white"
            style={{ width: `${winRatePercent}%` }}
          >
            {wins}W
          </div>
        )}
        {lossRatePercent > 0 && (
          <div
            className="bg-lose flex justify-end items-center pr-1.5 text-[11px] font-[500] text-white"
            style={{ width: `${lossRatePercent}%` }}
          >
            {losses}L
          </div>
        )}
      </div>
    );
  }

}