import { Tooltip } from 'react-tooltip'
import TextTooltip from "./TextTooltip.jsx";

export default function KbScoreDisplay({score}) {
  let bgColorClassName = "";
  if(score < 50) {
    bgColorClassName = "bg-lose";
  }
  else if(score < 75) {
    bgColorClassName = "bg-rate3";
  }
  else if(score < 90) {
    bgColorClassName = "bg-main";
  }
  else {
    bgColorClassName = "bg-gradient-to-r from-purple-500 to-win";
  }

  return (
  <div  className={`py-[2px] w-10 hover:scale-110 transition-transform duration-100 ${bgColorClassName} rounded-md text-lg text-white font-[400] flex justify-center items-center select-none`}>
    {score < 1 ? 1 : score}
  </div>
  )
}