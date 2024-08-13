import { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "../assets/avtar.jpg";

const People = ({ fetchmessages }) => {
  const [users, setusers] = useState([]);
  const loggeduser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchuser = async () => {
      const response = await axios.get(
        `http://localhost:3000/user/${loggeduser.id}`
      );
      const resdata = response.data;
      setusers(resdata);
    };
    fetchuser();
  }, []);
  return (
    <>
      <div
        className="d-flex flex-column flex-shrink-0 people-container"
        style={{ width: "335px", height: "729px" }}
      >
        <div className="people-heading">
          <p> Avaiable Peoples</p>
        </div>
        <hr className="line" />
        <div className="contact-container">
          <div className="contact">
            {users.length > 0 ? (
              users.map(({ userID, user }) => {
                return (
                  <div
                    className="info"
                    onClick={() => fetchmessages("new", user)}
                  >
                    <div className="contact-img">
                      <img src={Avatar} height={50} width={50} />
                    </div>
                    <div>
                      <div className="time">
                        <div>
                          <h6 className="time-name">{user.name}</h6>
                        </div>
                      </div>
                      <p>{user.email}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="chat">Their is No Chat</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default People;
