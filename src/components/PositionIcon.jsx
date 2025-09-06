export default function PositionIcon({position, size = 16, active = true}) {
  let src = `/${position}.png`
  return (
    <img
      alt={position}
      src={src}
      width={position === "SPT" ? size + 2 : size}
      height={position === "SPT" ? size + 2 : size}
      className={`${!active && "grayscale opacity-40"}`}
    />
  )
}