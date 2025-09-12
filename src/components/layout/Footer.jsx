export default function Footer(){
  const establishYear = 2025;
  const currentYear = new Date().getFullYear();

  return (
    <div className={"py-16 flex flex-col items-center justify-center gap-6 border-t border-bg3 px-6"}>
      <div className={"text-center max-w-[700px] text-xs text-text2"}>
        Challengergg is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
      </div>
      <div className={"flex gap-1 text-xs font-[500]"}>
        <div>Copyright © {establishYear === currentYear ? currentYear : `${establishYear}-${currentYear}`} by</div>
        <a
          href={"https://github.com/kbdev-21"}
          target={"_blank"}
          rel="noopener noreferrer"
          className={"hover:underline"}
        >kbdev_21</a>
      </div>

    </div>
  )
}