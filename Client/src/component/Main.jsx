import { LuSendHorizonal } from "react-icons/lu";
import Navbar from "./Navbar";

const Main = ({ messages, receivername, entermessage, sendmessage,id }) => {
  return (
    <>
      <Navbar receivername={receivername}></Navbar>
      <div className="main">
        <div className="main-content">
          <div className="m-message">
            {messages?.message?.length > 0 ? (
              messages.message.map(({ message, user }) => {
                if (id === user.id) {
                  return <div className="main-send">{message}</div>;
                } else {
                  return <div className="main-receive">{message}</div>;
                }
              })
            ) : (
              <div className="main-message">
                <p>No messages</p>
              </div>
            )}
          </div>
        </div>
        <center>
          <div className="main-button ">
            <div>
              <input
                type="text"
                className=" input-color"
                id="input"
                ref={entermessage}
                placeholder="Type a Message..."
              />
            </div>
            <LuSendHorizonal
              className="submit-button"
              onClick={() => sendmessage()}
            />
          </div>
        </center>
      </div>
    </>
  );
};

export default Main;
