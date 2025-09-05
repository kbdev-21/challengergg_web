import Logo from "../components/Logo.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function HomePage() {
  return (
    <div className={"flex flex-col items-center pt-[10vh]"}>
      <div className={"hidden xs:block"}>
        <Logo size={"big"}/>
      </div>
      <div className={"block xs:hidden"}>
        <Logo size={"medium"}/>
      </div>
      <div className={"w-full max-w-xl mt-12 px-4"}>
        <SearchBar/>
      </div>
    </div>
  );
}