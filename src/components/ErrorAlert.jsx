import {Banana} from "lucide-react";

export default function ErrorAlert({marginTop = true}) {
  return (
    <div className={`flex flex-col gap-4 items-center ${marginTop && "mt-8"}`}>
      <Banana size={30} className={"text-main"}/>
      <div className={"text-base font-[500] text-text2"}>404 - Something went wrong</div>
    </div>
  )
}