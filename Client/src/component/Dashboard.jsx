import { useEffect, useRef, useState } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";
import axios from "axios";
import People from "./People";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [messages, setmessages] = useState({});
  const [socket, setsocket] = useState(null);
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")));
  const [conversations, setconversations] = useState([]);
  const messageref = useRef(null)

  const loggeduser = JSON.parse(localStorage.getItem("user"));
  const id = loggeduser.id;

  console.log("message:", messages);
  useEffect(() => {
    setsocket(io("http://localhost:5000"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log("Active User are:", users);
    });
    socket?.on("getMessage", (data) => {
      console.log("data is:", data);
      setmessages((prev) => ({
        ...prev,
        message: [...prev.message, { user:data.user, message: data.message }],
      }));
    });
  }, [socket]);

  const fetchmessages = async (conversationId, user) => {
    const receiverid = user.id;
    const senderid = id;

    const response = await axios.get(
      `http://localhost:3000/messages/${conversationId}?senderid=${senderid}&&receiverid=${receiverid}`
    );
    const resdata = response.data;

    setmessages({ message: resdata, user, conversationId });
  };

  const receiverid = messages.user?.id;

  const getname = () => {
    if (id !== receiverid) {
      return messages.user?.name;
    }
    return;
  };
  const receivername = getname();

  const entermessage = useRef("");

  const sendmessage = async () => {
    const currentmessage = entermessage.current.value;
    socket?.emit("sendMessage", {
      conversationId: messages.conversationId,
      senderId: id,
      message: currentmessage,
      receiverId: receiverid,
    });

    const data = {
      conversationId: messages.conversationId,
      senderId: id,
      message: currentmessage,
      receiverId: receiverid,
    };
    console.log("data is:", data);
    const response = await axios.post("http://localhost:3000/messages", data);
    entermessage.current.value = "";
  };

  useEffect(() => {
    const loggeduser = JSON.parse(localStorage.getItem("user"));
    const fetchconversation = async () => {
      const response = await axios.get(
        `http://localhost:3000/conversation/${loggeduser.id}`
      );
      setconversations(response.data);
    };
    fetchconversation();
  }, []);

  

  return (
    <div className="app-container">
      <div className="display">
        <Sidebar
          fetchmessages={fetchmessages}
          user={user}
          conversations={conversations}
        ></Sidebar>
        <div className="maindisplay">
          <Main
            messages={messages}
            id={id}
            receivername={receivername}
            socket={socket}
            entermessage={entermessage}
            sendmessage={sendmessage}
          ></Main>
        </div>
        <People fetchmessages={fetchmessages}></People>
      </div>
    </div>
  );
};

export default Dashboard;
