import {SearchX} from "lucide-react";

export default function NoDataAlert({marginTop = true}) {
  return (
    <div className={`flex flex-col gap-4 items-center ${marginTop && "mt-8"}`}>
      <SearchX size={30} className={"text-main"}/>
      <div className={"text-base font-[500] text-text2"}>No data available</div>
    </div>
  )
}
