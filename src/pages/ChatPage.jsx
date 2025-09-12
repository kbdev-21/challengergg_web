import {useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import {useQuery} from "@tanstack/react-query";
import {fetchMessagesByRoom} from "../services/challengerggApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import {Send} from "lucide-react";
import {getTimeSinceTimestamp} from "../common/stringUtils.js";
import {Link, useParams} from "react-router-dom";
import {CHALLENGERGG_WEBSOCKET_BASE_URL} from "../common/config.js";

export default function ChatPage() {
  const wsBaseUrl = CHALLENGERGG_WEBSOCKET_BASE_URL;

  const {room} = useParams();
  const regionRoom = room ? room : "vn";

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [senderInfo, setSenderInfo] = useState({
    senderId: null,
    senderName: null,
  });
  const [isSendButtonCooldown, setIsSendButtonCooldown] = useState(false);

  const {
    data: roomMessages,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["roomMessages", regionRoom],
    queryFn: () => fetchMessagesByRoom(regionRoom),

  })

  useEffect(() => {
    if (!isLoading && !isError && roomMessages) {
      setMessages(roomMessages);
    }
  }, [roomMessages, isLoading, isError]);

  useEffect(() => {
    setUpSenderInfo();

    const socket = new SockJS(wsBaseUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/chat", (msg) => {
        const message = JSON.parse(msg.body);
        setMessages(prev => [...prev, message]);
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const randomNames1 = [
    "Yasuo", "Yone", "Darius", "Garen", "Zed",
    "Talon", "Lucian", "Thresh", "Blitzcrank", "Jax",
    "Lee Sin", "Viktor", "Malphite", "Ornn", "Draven"
  ];
  const randomNames2 = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond"];

  function setUpSenderInfo() {
    const existedSenderId = localStorage.getItem("senderId");
    const existedSenderName = localStorage.getItem("senderName");
    if (existedSenderId) {
      setSenderInfo({
        senderId: existedSenderId,
        senderName: existedSenderName,
      });
    } else {
      const newSenderId = crypto.randomUUID();
      const randomName1 = randomNames1[Math.floor(Math.random() * randomNames1.length)];
      const randomName2 = randomNames2[Math.floor(Math.random() * randomNames2.length)];
      const newSenderName = randomName2 + " " + randomName1;

      setSenderInfo({
        senderId: newSenderId,
        senderName: newSenderName
      });

      localStorage.setItem("senderId", newSenderId);
      localStorage.setItem("senderName", newSenderName);
    }
  }

  function sendMessage() {
    if(text === "" || text.length > 199 || isSendButtonCooldown){
      return;
    }
    if (client && client.connected) {
      client.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify({
          senderId: senderInfo.senderId,
          senderName: senderInfo.senderName,
          content: text,
          room: regionRoom.toUpperCase()
        }),
      });
    }
    setText("");
    setIsSendButtonCooldown(true);
    setTimeout(() => setIsSendButtonCooldown(false), 10000);
  }

  if (isLoading) return <LoadingSpinner/>;
  if (isError) return <ErrorAlert/>;


  return (
    <div className="flex flex-col md:flex-row w-full h-[80vh] gap-2">
      {/* Server selector */}
      <div className={"w-full md:w-[260px] h-fit md:h-full shrink-0 flex flex-col bg-bg2 border border-bg3 rounded-md"}>
        <div className={"p-4 text-text2 text-xs font-[500]"}>Servers</div>
        <div className={"h-[100px] overflow-y-auto md:h-full flex flex-col"}>
          <Link to={`/chat/vn`} replace={true} className={`cursor-pointer w-full p-4 text-sm ${regionRoom === "vn" ? "bg-bg4 text1 font-[500]" : "bg-bg2 text-text2 font[400]"}`}>VN Server</Link>
          <Link to={`/chat/kr`} replace={true} className={`cursor-pointer w-full p-4 text-sm ${regionRoom === "kr" ? "bg-bg4 text1 font-[500]" : "bg-bg2 text-text2 font[400]"}`}>KR Server</Link>
          <Link to={`/chat/euw`} replace={true} className={`cursor-pointer w-full p-4 text-sm ${regionRoom === "euw" ? "bg-bg4 text1 font-[500]" : "bg-bg2 text-text2 font[400]"}`}>EUW Server</Link>
          <Link to={`/chat/eun`} replace={true} className={`cursor-pointer w-full p-4 text-sm ${regionRoom === "eun" ? "bg-bg4 text1 font-[500]" : "bg-bg2 text-text2 font[400]"}`}>EUN Server</Link>
          <Link to={`/chat/na`} replace={true} className={`cursor-pointer w-full p-4 text-sm ${regionRoom === "na" ? "bg-bg4 text1 font-[500]" : "bg-bg2 text-text2 font[400]"}`}>NA Server</Link>
          <Link to={`/chat/br`} replace={true} className={`cursor-pointer w-full p-4 text-sm ${regionRoom === "br" ? "bg-bg4 text1 font-[500]" : "bg-bg2 text-text2 font[400]"}`}>BR Server</Link>
        </div>
      </div>

      {/* Chat section */}
      <ChatSection room={regionRoom} isCooldown={isSendButtonCooldown} sendMessage={sendMessage} text={text} setText={setText} messages={messages} senderInfo={senderInfo} />
    </div>
  );
}

function ChatSection({messages, senderInfo, text, setText, sendMessage, room, isCooldown}) {
  const messagesEndRef = useRef(null);
  const scrollableRef = useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col bg-bg2 rounded-md border border-bg3">
      <div className="text-sm font-[500] py-4 px-4 border-b border-bg3 text-main">{room.toUpperCase()} Chat Room</div>
      <div className="flex flex-col h-full overflow-y-auto gap-3 py-2 px-2" ref={scrollableRef}>
        {messages.map((message) => (
          <ChatBubble message={message} senderId={senderInfo.senderId} key={message.id}/>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex gap-2 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex w-full h-12 bg-bg3 rounded-full px-4 items-center"
        >
          <input
            className="w-full focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Example: Type your GameName#tag and rank"}
          />
          <button type="submit" className={`${isCooldown ? "pointer-events-none" : "cursor-pointer"}`}>
            <Send className={`${isCooldown ? "text-main/30 " : "text-main "}`}/>
          </button>
        </form>
      </div>
    </div>
  );
}


function ChatBubble({message, senderId}) {
  const isSenderMessage = senderId === message.senderId;
  const timestamp = Math.floor(new Date(message.sentAt).getTime());

  return (
    <div className={`flex flex-col gap-1 w-full ${isSenderMessage ? "items-end" : ""}`}>
      <div className={`flex gap-2 items-center pl-1 ${isSenderMessage ? "hidden" : ""}`}>
        <div className={`text-xs text-text2 font-[500]`}>{message.senderName}</div>
        <div className={`text-[11px] text-text2 tracking-tight`}>
          {getTimeSinceTimestamp(timestamp).split(" ").slice(0, 2).join(" ")}
        </div>
      </div>
      <div className={`px-4 py-2.5 rounded-xl  w-fit bg-bg4 max-w-[300px]`}>
        <div>
          {message.content}
        </div>
      </div>
    </div>

  )
}