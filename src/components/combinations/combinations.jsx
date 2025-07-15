import "./combinations.scss";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import CordsTable from "../cordsTable/cordsTable";
import { useEffect, useState, useRef } from "react";
import socket from "../../socket";

export default function Combinations() {
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(1);
  const [validTitle, setValidTitle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [disabled, setDisabled] = useState([]);
  const actualStep = useRef(step);
  const cordsTableRefs = useRef([]);

  const titleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() != "") {
      setTitle(title.trim());
      socket.emit("create_track", { track_name: title.trim() });
    }
  };

  const toggleTable = (id) => {
    setDisabled((prev) => {
      const tableSet = new Set(prev);
      if (tableSet.has(id)) {
        tableSet.delete(id);
      } else {
        tableSet.add(id);
      }
      return Array.from(tableSet);
    });
  };

  const confirmStep = () => {
    if (validTitle && cordsTableRefs.current) {
      const combination =
        cordsTableRefs.current[step - 1]?.getCombination() ?? [];
      cordsTableRefs.current[step - 1]?.resetCombination();

      if (isEditing) {
        socket.emit("editing_combination", {
          active_cords: combination,
          track_name: title,
          step: actualStep.current,
          owner: localStorage.getItem("username"),
        });
        return;
      }

      socket.emit("combination", {
        active_cords: combination,
        track_name: title,
        owner: localStorage.getItem("username"),
      });
    }
  };

  const confirmTrack = () => {
    sessionStorage.setItem("title", title);
  };

  const editPrevioustStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    actualStep.current = newStep;
    setIsEditing(true);
    cordsTableRefs.current[newStep - 1]?.edit();

    socket.emit("previoust_step", {
      track_name: title,
      step_to_edit: newStep,
    });
  };

  useEffect(() => {
    const handleValidTitle = (data) => {
      if (data.success) {
        setValidTitle(true);
      }
    };

    socket.on("creating_track_info", handleValidTitle);

    return () => {
      socket.off("creating_track_info", handleValidTitle);
    };
  }, []);
  useEffect(() => {
    actualStep.current = step;
  }, [step]);

  return (
    <div className="combinations">
      <ControlPanelHeader />
      {!validTitle && (
        <>
          <form onSubmit={titleSubmit}>
            <input
              type="text"
              className="title"
              placeholder="Nazwa utworu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Potwierdź</button>
          </form>
        </>
      )}

      {!validTitle && <h1>Podaj tytuł nowej kompozycji</h1>}
      {validTitle && (
        <>
          <h2>{title}</h2>
          <div className="steps">
            {Array.from({ length: step }, (_, index) => (
              <div key={index} className={`step${index + 1}`}>
                <h3 onClick={() => toggleTable(index + 1)}>
                  Krok {index + 1}{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ff5e00"
                  >
                    {disabled.includes(index + 1) ? (
                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    ) : (
                      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                    )}
                  </svg>
                </h3>
                <div
                  id={index + 1}
                  className={`cordTable ${
                    disabled.includes(index + 1) ? "disable" : ""
                  }`}
                >
                  <CordsTable
                    creating={index + 1 === step && !isEditing}
                    ref={(ref) => (cordsTableRefs.current[index] = ref)}
                    step={index + 1}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="buttons">
            <button
              onClick={() => {
                if (step > 1) {
                  editPrevioustStep();
                  toggleTable(step - 1);
                }
              }}
            >
              Edytuj poprzedni
            </button>
            <button
              onClick={() => {
                setStep(step + 1);
                confirmStep();
                setIsEditing(false);
                toggleTable(step);
              }}
            >
              + kolejny krok
            </button>
            <button
              onClick={() => {
                confirmTrack();
              }}
            >
              Gotowe
            </button>
          </div>
        </>
      )}
    </div>
  );
}
