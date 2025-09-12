import {Blend, Dice5, Dices, Dribbble, Hourglass, Loader, LoaderPinwheel} from "lucide-react";

export default function LoadingSpinner({marginTop = true}) {
  return (
    <div className={`flex justify-center ${marginTop && "mt-8"} animate-bounce`}>
      {/*<div className={"w-4 h-4 bg-main animate-spin"}/>*/}
      <Hourglass strokeWidth={2.75} size={24} className={"text-main animate-spin"}/>
      {/*<Blend className={"text-main animate-spin"}/>*/}
    </div>
  )
}