import Avatar from "../assets/avtar.jpg";

const Navbar = ({ receivername }) => {
  return (
    <header className=" header">
      <div className="header-nav">
        <>
          <div className="contact-img">
            <img src={Avatar} height={50} width={50} />
          </div>
          <div>
            <h6 className="time-name">{receivername}</h6>
          </div>
        </>
      </div>
    </header>
  );
};

export default Navbar;
