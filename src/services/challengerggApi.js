import axios from "axios";

const baseUrl = 'http://localhost:666';

export async function fetchPlayerDataByGameNameAndTagLine(gameName, tagLine, region) {
  const url = `${baseUrl}/api/v1/players/${region}/by-riotid/${gameName}/${tagLine}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchMatchesByPuuid(puuid, start, count, region) {
  const url = `${baseUrl}/api/v1/matches/${region}/by-puuid/${puuid}?start=${start}&count=${count}`;
  const response = await axios.get(url);
  return response.data;
}

export async function search(searchKey) {
  const url = `${baseUrl}/api/v1/search?key=${searchKey}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchAllChampionStats() {
  const url = `${baseUrl}/api/v1/analytics/champstats`;
  const response = await axios.get(url);
  return response.data;
}