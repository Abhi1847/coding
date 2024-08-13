import Avatar from "../assets/avtar.jpg";

const Sidebar = ({ fetchmessages, user, conversations }) => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 sidebar-container"
      style={{ width: "280px", height: "729px" }}
    >
      <div className="avatar">
        <div className="avatar-img">
          <img src={Avatar} height={75} width={75} />
        </div>
        <div className="avatar-name">
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
      </div>
      <hr className="line" />

      <div className="contact-container">
        <div className="contact">
          {conversations.length > 0 ? (
            conversations.map(({ conversationId, user }) => {
              return (
                <div
                  className="info"
                  onClick={() => fetchmessages(conversationId, user)}
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
  );
};

export default Sidebar;
