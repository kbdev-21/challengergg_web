export default function PositionIcon({position, size = 16}) {
  let src = `/${position}.png`
  return (
    <img alt={position} src={src} width={size}/>
  )
}