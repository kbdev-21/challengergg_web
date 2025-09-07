import {Tooltip} from "react-tooltip";

export default function TextTooltip({text = "Challengergg", children}) {
  return (
    <div data-tooltip-id="text-tooltip" data-tooltip-content={text}>
      {children}
    </div>
  )
}