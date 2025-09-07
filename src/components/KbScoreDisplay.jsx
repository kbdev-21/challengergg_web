import { Tooltip } from 'react-tooltip'
import TextTooltip from "./TextTooltip.jsx";

export default function KbScoreDisplay({score}) {
  let bgColorClassName = "";
  let tooltipText = ""
  if(score < 50) {
    bgColorClassName = "bg-lose";
    tooltipText = "Struggle with deaths and/or has lack impact to the game";
  }
  else if(score < 75) {
    bgColorClassName = "bg-rate3";
    tooltipText = "Performing well and positively contribute to the team";
  }
  else if(score < 90) {
    bgColorClassName = "bg-main";
    tooltipText = "Excellent gameplay, carrying the team with clever decisions";
  }
  else {
    bgColorClassName = "bg-gradient-to-r from-purple-500 to-win";
    tooltipText = "Phenomenal performance, totally dominating the whole match!";
  }

  return (
<TextTooltip text={tooltipText}>
  <div  className={`py-[2px] w-10 ${bgColorClassName} rounded-md text-lg text-white font-[400] flex justify-center items-center select-none`}>
    {score < 1 ? 1 : score}
  </div>
</TextTooltip>


  )
}