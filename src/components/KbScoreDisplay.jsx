export default function KbScoreDisplay({score}) {
  let bgColorClassName = "";
  if(score < 50) {
    bgColorClassName = "bg-lose";
  }
  else if(score < 75) {
    bgColorClassName = "bg-rate3";
  }
  else {
    bgColorClassName = "bg-main";
  }

  return (
    <div className={`py-[2px] w-10 ${bgColorClassName} rounded-md text-lg font-[400] flex justify-center items-center`}>
      {score < 1 ? 1 : score}
    </div>
  )
}