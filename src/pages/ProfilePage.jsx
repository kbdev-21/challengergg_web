import {Link, useNavigate, useParams} from "react-router-dom";
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
import {Bookmark, ChevronDown, ChevronRight, RefreshCcw, Star} from "lucide-react";
import {useState} from "react";
import {queueEnumToShortTextMap, queueEnumToTextMap, rankImgMap} from "../common/constants.js";
import {
  formatSecondsToMinutesAndSeconds,
  getTimeSinceTimestamp, kdaFormat,
  upperCaseFirstLowerCaseAll
} from "../common/stringUtils.js";
import KbScoreDisplay from "../components/KbScoreDisplay.jsx";
import MatchCard from "../components/MatchCard.jsx";
import PositionIcon from "../components/PositionIcon.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import ComingSoon from "../components/ComingSoon.jsx";
import OverviewSection from "../components/profile-page/OverviewSection.jsx";
import ChampionsSection from "../components/profile-page/ChampionsSection.jsx";

export default function ProfilePage() {
  const {currentPatch} = useGlobal();

  const {nameAndTag, region, subMenu} = useParams();
  const name = nameAndTag.split("-")[0];
  const tag = nameAndTag.split("-")[1];

  const {
    data: playerDto,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["playerDto", name, tag, region],
    queryFn: () => fetchPlayerDataByGameNameAndTagLine(name, tag, region)
  });

  if (isLoading) return <LoadingSpinner/>;
  if (isError) return <ErrorAlert/>;


  return (
    <div className={""}>
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
              className={"absolute bottom-2 sm:-bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-bg4 shadow-md py-1 px-2 font-[500] text-xs"}>
              {playerDto.summonerLevel}
            </div>
          </div>
          <div className={"flex flex-col gap-1"}>
            <div className={"flex gap-2"}>
              <div className={"font-[500] text-xl xs:text-2xl truncate"}>{playerDto.gameName}</div>
              <div className={"font-[400] text-xl xs:text-2xl text-text2"}>#{playerDto.tagLine}</div>
            </div>
            <div className={"flex gap-2"}>
              <div className={"font-[400] text-sm text-text2"}>{playerDto.region} Server</div>
            </div>
            <button
              className={"mt-2 bg-main cursor-pointer py-[5px] px-6 rounded-md w-fit font-[600] text-sm text-black flex items-center gap-2"}
            >
              Follow
            </button>
          </div>
        </div>

        {/* Menu section */}
        <div className={"flex gap-4 px-3 xs:px-5"}>
          <Link
            to={`/profile/${region.toLowerCase()}/${nameAndTag}/overview`} replace={true}
            className={`cursor-pointer px-2 pb-3 text-sm font-[500] ${subMenu === "overview" ? "border-b-2 border-b-main" : "text-text2"}`}
          >
            Overview
          </Link>
          <Link
            to={`/profile/${region.toLowerCase()}/${nameAndTag}/champions`} replace={true}
            className={`cursor-pointer px-2 pb-3 text-sm font-[500] ${subMenu === "champions" ? "border-b-2 border-b-main" : "text-text2"}`}
          >
            Champions
          </Link>
          <Link
            to={`/profile/${region.toLowerCase()}/${nameAndTag}/live-match`} replace={true}
            className={`cursor-pointer truncate px-2 pb-3 text-sm font-[500] ${subMenu === "live-match" ? "border-b-2 border-b-main" : "text-text2"}`}
          >
            Live Match
          </Link>
        </div>
      </div>


      {/* Overview Section */}
      {subMenu === "overview" && (
        <OverviewSection playerData={playerDto}/>
      )}
      {subMenu === "champions" && (
        <ChampionsSection/>
      )}
      {subMenu === "live-match" && (
        <LiveMatchSection/>
      )}

    </div>
  );
}

function LiveMatchSection() {
  return (
    <ComingSoon/>
  )
}





