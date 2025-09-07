import {runeBoardMainMap, runeBoardSubMap} from "../common/constants.js";
import {getRuneImageUrl} from "../services/ddragonApi.js";

export default function FullRuneBoard({runeDto}) {
  const imgSizeClassName = "h-7.5 w-7.5 xs:h-8 xs:w-8 md:h-9 md:w-9"

  return (
    <div className={"grid grid-cols-2 w-full"}>
      <div className={"flex flex-col gap-4 xs:gap-6 px-5 border-r border-bg3"}>
        <MainRunes style={runeDto.mainStyle}/>
        <NineSubRunes style={runeDto.mainStyle}/>
      </div>
      <div className={"flex flex-col justify-end px-5"}>
        <NineSubRunes style={runeDto.subStyle}/>
      </div>

    </div>
  )

  function MainRunes({style = 8000}) {
    const mainRunes = runeBoardMainMap[style];
    return (
      <div className={`flex justify-between w-full`}>
        {mainRunes.map(runeId => (
          <div key={runeId} className={`${imgSizeClassName} ${!runeDto.selections.includes(Number(runeId)) && "grayscale opacity-40"} bg-bg1 rounded-[100%] p-[1px]`}>
            <img alt={"rune-img"} src={getRuneImageUrl(runeId)} />
          </div>
        ))}
      </div>
    );
  }

  function NineSubRunes({style = 8000}) {
    const nineRunes = runeBoardSubMap[style];
    return (
      <div className={"w-full flex flex-col gap-4 xs:gap-6"}>
        <div className={"flex justify-between w-full "}>
          {nineRunes.slice(0,3).map(runeId => (
            <img key={runeId} alt={"rune-img"} src={getRuneImageUrl(runeId)} className={`${imgSizeClassName} ${!runeDto.selections.includes(Number(runeId)) && "grayscale opacity-40"}`}/>
          ))}
        </div>
        <div className={"flex justify-between w-full "}>
          {nineRunes.slice(3,6).map(runeId => (
            <img key={runeId} alt={"rune-img"} src={getRuneImageUrl(runeId)} className={`${imgSizeClassName} ${!runeDto.selections.includes(Number(runeId)) && "grayscale opacity-40"}`}/>
          ))}
        </div>
        <div className={"flex justify-between w-full "}>
          {nineRunes.slice(6,9).map(runeId => (
            <img key={runeId} alt={"rune-img"} src={getRuneImageUrl(runeId)} className={`${imgSizeClassName} ${!runeDto.selections.includes(Number(runeId)) && "grayscale opacity-40"}`}/>
          ))}
        </div>
      </div>
    )
  }
}