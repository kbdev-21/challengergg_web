export default function KbScoreDisplay({score}) {
  let bgColorClassName = "";
  let tooltipText = ""
  if(score < 50) {
    bgColorClassName = "bg-lose";
    tooltipText = "Bad performance qwefqwefq feqwjeiofqjwei fewjiejf fejwiow jfei fqjweoifj";
  }
  else if(score < 75) {
    bgColorClassName = "bg-rate3";
    tooltipText = "Bad performance";
  }
  else if(score < 90) {
    bgColorClassName = "bg-main";
    tooltipText = "Bad performance";
  }
  else {
    bgColorClassName = "bg-gradient-to-r from-purple-500 to-win";
    tooltipText = "Bad performance";
  }

  return (
      <div className={`py-[2px] w-10 ${bgColorClassName} rounded-md text-lg text-white font-[400] flex justify-center items-center select-none`}>
        {score < 1 ? 1 : score}
      </div>
  )
}