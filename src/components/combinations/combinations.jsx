import "./combinations.scss";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import CordsTable from "../cordsTable/cordsTable";
import { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import { route } from "preact-router";

export default function Combinations() {
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(1);
  const [validTitle, setValidTitle] = useState(false);
  const [disabled, setDisabled] = useState([]);
  const actualStep = useRef(step);
  const cordsTableRefs = useRef([]);
  const lastCombinationRef = useRef([]);
  const copyPendingRef = useRef(false);

  socket.emit("registers_reset");

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

  const confirmStep = (save = false) => {
    if (validTitle && cordsTableRefs.current) {
      const currentIndex = actualStep.current - 1;
      const combination =
        cordsTableRefs.current[currentIndex]?.getCombination() ?? [];

      lastCombinationRef.current = combination;

      socket.emit("combination", {
        active_cords: combination,
        track_name: title,
        owner: localStorage.getItem("username"),
      });

      if (save) {
        copyPendingRef.current = true;
      }
    }
  };

  const handleNextStepButton = () => {
    confirmStep(true); // bez obiektu {save:true}, bo confirmStep przyjmuje bool
    setStep((prev) => prev + 1);
    toggleTable(actualStep.current); // użyj aktualnego ref
  };

  const confirmTrack = () => {
    sessionStorage.setItem("title", title);
    confirmStep();
    socket.emit("select_track", { track_name: title });
  };

  useEffect(() => {
    const handleValidTitle = (data) => {
      if (data.success) {
        setValidTitle(true);
      }
    };

    socket.on("creating_track_info", handleValidTitle);
    socket.on("save_step", handleNextStepButton);

    return () => {
      socket.off("creating_track_info", handleValidTitle);
      socket.off("save_step", handleNextStepButton);
    };
  }, []);
  useEffect(() => {
    actualStep.current = step;
  }, [step]);

  useEffect(() => {
    if (!copyPendingRef.current) return;
    // poczekaj na render nowego kroku
    const id = requestAnimationFrame(() => {
      const nextIndex = step - 1; // nowy krok ma index step-1
      cordsTableRefs.current[nextIndex]?.setCombination(
        lastCombinationRef.current
      );
      copyPendingRef.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [step]);

  return (
    <div className="combinations">
      <ControlPanelHeader />
      {!validTitle && (
        <>
          <h1>Podaj tytuł nowej kompozycji</h1>
          <form onSubmit={titleSubmit}>
            <input
              type="text"
              className="title"
              placeholder="Nazwa utworu"
              data-osk
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Potwierdź</button>
          </form>
        </>
      )}

      {validTitle && (
        <>
          <h2>{title}</h2>
          <div className="steps">
            {Array.from({ length: step }, (_, index) => (
              <div key={index} className={`step${index + 1}`}>
                <h3
                  onClick={() => {
                    toggleTable(index + 1);
                    cordsTableRefs.current[index]?.edit();
                  }}
                >
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
                    creating={true}
                    ref={(ref) => (cordsTableRefs.current[index] = ref)}
                    step={index + 1}
                    toggleTable={toggleTable}
                    title={title}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="buttons">
            <button
              onClick={() => {
                handleNextStepButton();
              }}
            >
              + kolejny krok
            </button>
            <button
              onClick={() => {
                confirmTrack();
                route("/controlPanel/gameMode");
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
