export const regionCodeMap = {
  "VN": "VN2",
  "KR": "KR",
  "NA": "NA1",
  "EUW": "EUW1",
  "EUN": "EUN1"
}

export const positionTextFormatMap = {
  TOP: "Top",
  JGL: "Jungle",
  MID: "Mid",
  ADC: "ADC",
  SPT: "Support",
  UNK: "Unknown",
};

export const queueEnumToTextMap = {
  SOLO: "Ranked Solo/Duo",
  FLEX: "Ranked Flex 5v5",
  ARAM: "ARAM",
  NORMAL: "Normal",
};

export const queueEnumToShortTextMap = {
  SOLO: "Ranked Solo",
  FLEX: "Ranked Flex",
  ARAM: "ARAM",
  NORMAL: "Normal",
};

export const spellIdMap = {
  4: "SummonerFlash",
  7: "SummonerHeal",
  11: "SummonerSmite",
  3: "SummonerExhaust",
  12: "SummonerTeleport",
  21: "SummonerBarrier",
  14: "SummonerDot", // Ignite
  6: "SummonerHaste", // Ghost
  1: "SummonerBoost", // Cleanse
  32: "SummonerSnowball", // ARAM Snowball
  13: "SummonerMana", // Clarity (only available in special modes)
};

export const runeBoardMainMap = {
  "8000": ["8005", "8008", "8021", "8010"],
  "8100": ["8112", "8128", "9923"],
  "8200": ["8214", "8229", "8230"],
  "8300": ["8351", "8360", "8369"],
  "8400": ["8437", "8439", "8465"]
}

export const runeBoardSubMap = {
  "8000": ["9101", "9111", "8009", "9104", "9105", "9103", "8014", "8017", "8299"],
  "8100": ["8126", "8139", "8143", "8137", "8140", "8141", "8135", "8105", "8106"],
  "8200": ["8224", "8226", "8275", "8210", "8234", "8233", "8237", "8232", "8236"],
  "8300": ["8306", "8304", "8321", "8313", "8352", "8345", "8347", "8410", "8316"],
  "8400": ["8446", "8463", "8401", "8429", "8444", "8473", "8451", "8453", "8242"]
}

export const runeIdMap = {
  '8005': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png',
  '8008': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png',
  '8009': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png',
  '8010': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Conqueror/Conqueror.png',
  '8014': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png',
  '8017': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/CutDown/CutDown.png',
  '8021': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png',
  '8105': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png',
  '8106': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png',
  '8112': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png',
  '8126': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/CheapShot/CheapShot.png',
  '8128': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png',
  '8135': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png',
  '8137': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/SixthSense/SixthSense.png',
  '8139': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png',
  '8140': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/GrislyMementos/GrislyMementos.png',
  '8141': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/DeepWard/DeepWard.png',
  '8143': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png',
  '8210': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Transcendence/Transcendence.png',
  '8214': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png',
  '8224': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NullifyingOrb/Axiom_Arcanist.png',
  '8226': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png',
  '8229': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png',
  '8230': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png',
  '8232': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png',
  '8233': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png',
  '8234': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Celerity/CelerityTemp.png',
  '8236': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png',
  '8237': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Scorch/Scorch.png',
  '8242': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/Unflinching/Unflinching.png',
  '8275': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/NimbusCloak/6361.png',
  '8299': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/LastStand/LastStand.png',
  '8304': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png',
  '8306': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png',
  '8313': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/PerfectTiming/AlchemistCabinet.png',
  '8316': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/JackOfAllTrades/JackofAllTrades2.png',
  '8321': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/CashBack/CashBack2.png',
  '8345': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png',
  '8347': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png',
  '8351': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png',
  '8352': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png',
  '8360': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png',
  '8369': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png',
  '8401': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/MirrorShell/MirrorShell.png',
  '8410': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png',
  '8429': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Conditioning/Conditioning.png',
  '8437': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png',
  '8439': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png',
  '8444': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/SecondWind/SecondWind.png',
  '8446': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Demolish/Demolish.png',
  '8451': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png',
  '8453': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Revitalize/Revitalize.png',
  '8463': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/FontOfLife/FontOfLife.png',
  '8465': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/Guardian/Guardian.png',
  '8473': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Resolve/BonePlating/BonePlating.png',
  '9101': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/AbsorbLife/AbsorbLife.png',
  '9103': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png',
  '9104': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png',
  '9105': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/LegendHaste/LegendHaste.png',
  '9111': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/Triumph.png',
  '9923': 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png',
};

export const runeStyleIdMap = {
  8000: {
    name: "Precision",
    icon: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png",
  },
  8100: {
    name: "Domination",
    icon: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png",
  },
  8200: {
    name: "Sorcery",
    icon: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7202_Sorcery.png",
  },
  8300: {
    name: "Inspiration",
    icon: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png",
  },
  8400: {
    name: "Resolve",
    icon: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7204_Resolve.png",
  },
};

export const rankImgMap = {
  CHALLENGER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/challenger.png",
  GRANDMASTER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/grandmaster.png",
  MASTER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/master.png",
  DIAMOND:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/diamond.png",
  EMERALD:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/emerald.png",
  PLATINUM:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/platinum.png",
  GOLD: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/gold.png",
  SILVER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/silver.png",
  BRONZE:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/bronze.png",
  IRON: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/iron.png",
  UNRANKED:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/unranked.png",
};