export default function LoadingSpinner({marginTop = true}) {
  return (
    <div className={`flex justify-center ${marginTop && "mt-8"}`}>
      <div className={"w-4 h-4 bg-main animate-spin"}/>
    </div>
  )
}