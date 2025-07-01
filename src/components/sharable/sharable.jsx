import "./sharable.scss";
import socket from "../../socket";
import { useState, useEffect } from "react";
import shareLogo from "../../assets/shareLogo.svg";

export default function Sharable({ trackName, onClose }) {
  const [users, setUsers] = useState([]);
  const username = localStorage.getItem("username");
  const trackData = {
    track_name: trackName,
    user: "",
  };

  useEffect(() => {
    socket.emit("get_sharable", username);
  }, []);

  useEffect(() => {
    const handleSharable = (data) => {
      setUsers(data);
    };

    socket.on("sharable", handleSharable);

    return () => {
      socket.off("sharable", handleSharable);
    };
  }, []);

  function share(user) {
    trackData.user = user;
    socket.emit("share", trackData);
  }

  return (
    <div className="sharable">
      <header
        onClick={() => {
          onClose();
        }}
      >
        Zamknij
      </header>
      {users.map((user, index) => (
        <div key={index} id={user} className="share">
          <p>{user}</p>
          <div
            onClick={() => {
              share(user);

              onClose();
            }}
          >
            <img src={shareLogo} alt="share" className="shareIMG" />
          </div>
        </div>
      ))}
    </div>
  );
}
