export default function Logo({size = "small"}) {
  let bigTextSizeClassName = "text-2xl";
  let smallTextSizeClassName = "text-sm";

  if(size === "medium") {
    bigTextSizeClassName = "text-4xl";
    smallTextSizeClassName = "text-lg";
  }
  if(size === "big") {
    bigTextSizeClassName = "text-5xl";
    smallTextSizeClassName = "text-xl";
  }

  return (
    <div className={"flex gap-[2px] select-none"}>
      <div className={`${bigTextSizeClassName} font-[500]`}>CHALLENGER</div>
      <div className={`${smallTextSizeClassName} text-main font-[500]`}>.GG</div>
    </div>
  );
}