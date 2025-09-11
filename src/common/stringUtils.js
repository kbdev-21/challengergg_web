import {BAD_WIN_RATE, GOOD_WIN_RATE} from "./constants.js";

export function formatNumber(number) {
  return number.toLocaleString("en-US");
}

export function upperCaseFirstLowerCaseAll(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function formatSecondsToMinutesAndSeconds(seconds) {
  const minutes = Math.floor(seconds / 60); // Get integer minutes
  const leftSeconds = seconds % 60; // Get remaining seconds

  return `${minutes}m${leftSeconds < 10 ? "0" + leftSeconds : leftSeconds}s`;
}

export function placementToDisplayString(placement, isMvp, isSvp) {
  if(isMvp) return "MVP";
  if(isSvp) return "SVP";
  if(placement === 1) return placement + "st";
  if(placement === 2) return placement + "nd";
  if(placement === 3) return placement + "rd";
  return placement + "th";
}

export function kdaFormat(kda) {
  return kda.toFixed(2); // Ensures two decimal places
}

export function getTextColorForChampionTier(tier) {
  if(tier === 'S') return "text-rate1";
  if(tier === 'A') return "text-rate2";
  if(tier === 'B') return "text-rate3";
  if(tier === 'C') return "text-rate4";
  if(tier === 'D') return "text-rate5";

}

export function kbScoreDescription(score) {
  if (score < 50) {
    return `Your Key Battle Score is: ${score} (???). You struggled this game! Learn from your mistakes and get better next matches.`;
  }
  if (score < 75) {
    return `Your Key Battle Score is: ${score} (!). Decent performance! You made a good contribution and did your job well.`;
  } else {
    return `Your Key Battle Score is: ${score} (!!!). You completely dominated the game and carried your team to victory!`;
  }
}

export function champTierDescription(tier) {
  if(tier === 'S') {
    return 'S Tier - OP champions'
  }
  if(tier === 'A') {
    return 'A Tier - Strong champions'
  }
  if(tier === 'B') {
    return 'B Tier - Good champions'
  }
  if(tier === 'C') {
    return 'C Tier - Normal champions'
  }
  if(tier === 'D') {
    return 'D Tier - Weak champions'
  }
}

export function champTierColor(tier) {
  if(tier === 'S') {
    return 'tier.s'
  }
  if(tier === 'A') {
    return 'tier.a'
  }
  if(tier === 'B') {
    return 'tier.b'
  }
  if(tier === 'C') {
    return 'tier.c'
  }
  if(tier === 'D') {
    return 'tier.d'
  }
}

export function getTimeSinceTimestamp(timestamp) {
  const now = Date.now();
  const diffMs = now - timestamp;

  if (diffMs < 0) {
    return "Game hasn't started yet";
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30)); // Approximate month length

  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

export function getWinRateColorClassName(winRate) {
  let winRateColorClassName = "text-lose";
  if(winRate >= BAD_WIN_RATE) winRateColorClassName = "text-text2";
  if(winRate >= GOOD_WIN_RATE) winRateColorClassName = "text-win";

  return winRateColorClassName;
}

export function getTwoPathPatch(patch) {
  return patch?.split(".").slice(0, 2).join(".");
}