import {useParams} from "react-router-dom";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {fetchMatchesByPuuid, fetchPlayerDataByGameNameAndTagLine} from "../services/challengerggApi.js";
import {useGlobal} from "../contexts/GlobalContext.jsx";
import {
  getChampionAvatarUrl, getItemImageUrl,
  getProfileIconUrl,
  getRuneImageUrl,
  getRuneStyleImageUrl,
  getSpellImageUrl
} from "../services/ddragonApi.js";
import {Bookmark, ChevronDown, Star} from "lucide-react";
import {useState} from "react";
import {queueEnumToShortTextMap, queueEnumToTextMap, rankImgMap} from "../common/constants.js";
import {
  formatNumber,
  formatSecondsToMinutesAndSeconds,
  getTimeSinceGameStart, kdaFormat,
  upperCaseFirstLowerCaseAll
} from "../common/stringUtils.js";
import KbScoreDisplay from "../components/KbScoreDisplay.jsx";
import MatchCard from "../components/MatchCard.jsx";
import PositionIcon from "../components/PositionIcon.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function ProfilePage() {
  const {currentPatch} = useGlobal();

  const params = useParams();
  const name = params.nameAndTag.split("-")[0];
  const tag = params.nameAndTag.split("-")[1];
  const region = params.region;

  const [currentMenuSelection, setCurrentMenuSelection] = useState(0);

  const {
    data: playerDto,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["playerDto", name, tag, region],
    queryFn: () => fetchPlayerDataByGameNameAndTagLine(name, tag, region)
  });

  if (isLoading) return <LoadingSpinner/>;

  if (isError) {
    return <div>Error</div>
  }

  return (
    <div className={"pt-10"}>
      {/* Top header */}
      <div className={"w-full bg-bg2 border border-bg3 rounded-md flex flex-col gap-4"}>
        {/* Info section */}
        <div className={"flex gap-4 p-3 xs:p-5"}>
          <div className={"relative"}>
            <img
              sizes={"150px"}
              src={getProfileIconUrl(playerDto.profileIconId, currentPatch)}
              className={"rounded-md w-20 sm:w-28 h-auto aspect-square"}
              alt={"profileIcon"}
            />
            <div
              className={"absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-bg4 shadow-md py-1 px-2 font-[500] text-xs"}>
              {playerDto.summonerLevel}
            </div>
          </div>
          <div className={"flex flex-col gap-3"}>
            <div className={"flex gap-2 flex-row"}>
              <div className={"font-[500] text-xl sm:text-2xl truncate"}>{playerDto.gameName}</div>
              <div className={"font-[400] text-xl sm:text-2xl text-text2"}>#{playerDto.tagLine}</div>
            </div>
            <button
              className={"bg-main cursor-pointer py-[5px] px-6 rounded-md w-fit font-[600] text-sm text-black flex items-center gap-2"}>
              Follow
            </button>
          </div>
        </div>

        {/* Menu section */}
        <div className={"flex gap-4 px-3 xs:px-5"}>
          <div
            className={`px-2 pb-3 text-sm font-[500] ${currentMenuSelection === 0 ? "border-b-2 border-b-main" : "text-text2"}`}>
            Overview
          </div>
          <div
            className={`px-2 pb-3 text-sm font-[500] ${currentMenuSelection === 1 ? "border-b-2 border-b-main" : "text-text2"}`}>
            Analytics
          </div>
          <div
            className={`px-2 pb-3 truncate text-sm font-[500] ${currentMenuSelection === 2 ? "border-b-2 border-b-main" : "text-text2"}`}>
            Live Game
          </div>
        </div>
      </div>


      {/* Overview Section */}
      <OverviewSection playerData={playerDto}/>
    </div>
  );
}

function OverviewSection({ playerData }) {
  const puuid = playerData.puuid;
  const region = playerData.region;

  const matchPerFetch = 10;

  const {
    data: matchPages,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["matchDtos", puuid, region],
    queryFn: ({ pageParam = 0 }) =>
      fetchMatchesByPuuid(puuid, pageParam, matchPerFetch, region),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < matchPerFetch) return undefined;
      return allPages.length * matchPerFetch;
    },
  });

  if (isLoading) return <LoadingSpinner/>;
  if (isError) return <div>Error</div>;

  const matchDtos = matchPages.pages.flat();

  return (
    <div className={"flex flex-col lg:flex-row gap-2 mt-2 w-full"}>
      {/* Ranks display */}
      <div className={"flex-1"}>
        <div className={"bg-bg2 border border-bg3 p-3 flex flex-col gap-2 rounded-md"}>
          <RankDisplay index={0} />
          <div className={"border-t border-t-bg4 w-full mt-1 mb-2"}></div>
          <RankDisplay index={1} />
        </div>
      </div>

      {/* Match history */}
      <div className={"w-full lg:w-[736px] flex flex-col gap-2"}>
        {matchDtos.map((matchDto) => (
          <div key={matchDto.matchId}>
            <MatchCard matchDto={matchDto} puuid={puuid} />
          </div>
        ))}

        <button
          className={
            "w-full h-12 bg-bg2 rounded-md border border-bg3 flex justify-center items-center text-text2 font-[500] cursor-pointer"
          }
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage || !hasNextPage}
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


