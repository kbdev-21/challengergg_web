import {Banana, CodeXml} from "lucide-react";

export default function ComingSoon({marginTop = true}) {
  return (
    <div className={`flex flex-col gap-4 items-center ${marginTop && "mt-8"}`}>
      <CodeXml size={30} className={"text-main"}/>
      <div className={"text-base font-[500] text-text2"}>In development - coming soon!</div>
    </div>
  )
}