import "./userProfile.scss";
import socket from "../../socket";
import { useState, useEffect } from "react";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";

export default function UserProfile() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [mode, setMode] = useState("Zaloguj się");

  function login(event) {
    event.preventDefault();

    if (username != "" && password != "") {
      setMessage("");
      setMode("");
      const userData = {
        name: username,
        password: password,
      };
      localStorage.setItem("username", username);
      window.dispatchEvent(new Event("usernameChange"));
      socket.emit("login", userData);
    } else {
      setMessage("Uzupełnij dwa pola");
    }
  }

  function createUser(event) {
    event.preventDefault();
    if (username != "" && password != "" && passwordRep != "") {
      if (password == passwordRep) {
        setMessage("");
        const userData = {
          name: username,
          password: password,
        };
        socket.emit("create_user", userData);
      } else {
        setMessage("Hasła nie są takie same");
      }
    } else {
      setMessage("Uzupełnij wszystkie pola");
    }
  }

  function logout() {
    localStorage.setItem("username", "Tryb gościa");
    window.dispatchEvent(new Event("usernameChange"));
    localStorage.removeItem("isLogged");
    setUsername("");
    setPassword("");
    setMessage("");
    setIsLogged(false);
    setMode("Zaloguj się");
  }

  useEffect(() => {
    const handleUserCreated = (data) => {
      setMessage(data.message);
      if (data.success) {
        setCreatingUser(false);
        setUsername("");
        setPassword("");
      }
    };

    socket.on("user_created", handleUserCreated);

    return () => {
      socket.off("user_created", handleUserCreated);
    };
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLogged");
    if (loggedIn === "true") {
      setIsLogged(true);
      setUsername(localStorage.getItem("username"));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleLoginStatus = (data) => {
      if (data.success === true) {
        setIsLogged(true);
        localStorage.setItem("isLogged", "true");
      } else {
        setIsLogged(false);
        setMessage(data.message);
        localStorage.removeItem("isLogged");
        localStorage.removeItem("username");
      }
    };

    socket.on("login_status", handleLoginStatus);

    return () => {
      socket.off("login_status", handleLoginStatus);
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="userProfile">
      <ControlPanelHeader />
      {!isLogged && <h3 className="mode">{mode}</h3>}
      {!isLogged && !creatingUser && (
        <form onSubmit={login}>
          <input
            type="text"
            name="username"
            data-osk
            placeholder="Nazwa użytkownika"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            data-osk
            data-osk-layout="numeric"
            placeholder="PIN"
            onChange={(e) => setPassword(e.target.value)}
          />
          {message && <p className="message">{message}</p>}
          <div className="buttons">
            <button type="submit">Zaloguj</button>
            <button
              type="button"
              onClick={() => {
                setCreatingUser(true);
                setMode("Tworzenie konta");
              }}
            >
              Utwórz konto
            </button>
          </div>
        </form>
      )}
      {!isLogged && creatingUser && (
        <form onSubmit={createUser}>
          <input
            type="text"
            name="username"
            data-osk
            placeholder="Nazwa użytkownika"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            data-osk
            data-osk-layout="numeric"
            placeholder="PIN"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            name="password"
            data-osk
            data-osk-layout="numeric"
            placeholder="PIN"
            onChange={(e) => setPasswordRep(e.target.value)}
          />
          {message && <p className="message">{message}</p>}
          <div className="buttons">
            <button
              type="submit"
              onClick={() => {
                setCreatingUser(false);
                setMessage("");
                setMode("Zaloguj się");
              }}
            >
              Dodaj użytkownika
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatingUser(false);
                setMessage("");
                setMode("Zaloguj się");
              }}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}
      {isLogged && <p>Witaj! {username}</p>}
      {isLogged && <button onClick={logout}>Wyloguj</button>}
    </div>
  );
}
