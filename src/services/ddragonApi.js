import axios from "axios";
import {runeIdMap, runeStyleIdMap, spellIdMap} from "../common/constants.js";

export function getProfileIconUrl(profileIconId, currentPatch) {
  return `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/profileicon/${profileIconId}.png`;
}

export function getChampionAvatarUrl(champName, currentPatch) {
  if(champName === 'FiddleSticks') champName = 'Fiddlesticks';
  return `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${champName}.png`;
}

export function getItemImageUrl(itemId, currentPatch) {
  return `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/item/${itemId}.png`;
}

export function getSpellImageUrl(spellId, currentPatch) {
  if(spellId in spellIdMap) {
    return `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/spell/${spellIdMap[spellId]}.png`;
  }
  else return "https://www.freeiconspng.com/thumbs/question-mark-icon/black-question-mark-icon-clip-art-10.png"
}

export function getRuneImageUrl(runeId) {
  if (runeId in runeIdMap) {
    return runeIdMap[runeId];
  } else return "https://www.freeiconspng.com/thumbs/question-mark-icon/black-question-mark-icon-clip-art-10.png";
}

export function getRuneStyleImageUrl(styleId) {
  if (styleId in runeStyleIdMap) {
    return runeStyleIdMap[styleId].icon;
  } else return "https://www.freeiconspng.com/thumbs/question-mark-icon/black-question-mark-icon-clip-art-10.png";
}

export async function fetchRuneReforged() {
  const newestPatch = await fetchCurrentLeaguePatch();
  const url = `https://ddragon.leagueoflegends.com/cdn/${newestPatch}/data/en_US/runesReforged.json`;
  const res = await axios.get(url);
  return res.data;
}


export async function fetchCurrentLeaguePatch() {
  const apiUrl = "https://ddragon.leagueoflegends.com/api/versions.json";
  const response = await axios.get(apiUrl);
  return response.data[0];
}