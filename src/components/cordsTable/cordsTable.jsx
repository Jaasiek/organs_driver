import "./cordsTable.scss";
import socket from "../../socket";
import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

const CordsTable = forwardRef(function CordsTable(
  { creating, step, toggleTable },
  ref
) {
  const [activeCords, setActiveCords] = useState([]);
  const [creatingCords, setCreatingCords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const creatingCordsRef = useRef();

  useImperativeHandle(ref, () => ({
    getCombination: () => creatingCordsRef.current,
    resetCombination: () => {
      setCreatingCords([]);
      setActiveCords([]);
    },
    edit: () => {
      // setCreatingCords(activeCords);
      setIsEditing(true);
      console.log("chuj");
    },
  }));

  const toggleCord = (id) => {
    if (!creating) return;

    setCreatingCords((prev) => {
      const cordsSet = new Set(prev);
      if (cordsSet.has(id)) {
        cordsSet.delete(id);
      } else {
        cordsSet.add(id);
      }
      return Array.from(cordsSet);
    });
  };

  useEffect(() => {
    const handleCordsActivation = (data) => {
      if (data.success === true) {
        setActiveCords(data.combination);
      }
    };

    const handleCreatedCombination = (data) => {
      if (data.success) {
        socket.emit("combination", { active_cords: creatingCordsRef.current });
      }
    };

    socket.on("play", handleCordsActivation);
    socket.on("next_step_info", handleCordsActivation);
    socket.on("previoust_step_info", handleCordsActivation);
    socket.on("get_combination", handleCreatedCombination);
    socket.on("previoust_step_edit", handleCordsActivation);

    return () => {
      socket.off("play", handleCordsActivation);
      socket.off("next_step_info", handleCordsActivation);
      socket.off("previoust_step_info", handleCordsActivation);
      socket.off("get_combination", handleCreatedCombination);
      socket.off("previoust_step_edit", handleCordsActivation);
    };
  }, []);

  useEffect(() => {
    creatingCordsRef.current = creatingCords;
  }, [creatingCords]);

  return (
    <div className="cordsTable">
      <div className="vocals">
        <div className="cords" id="pedal">
          <h2>Pedał</h2>
          <div
            className={`cord ${
              activeCords.includes(1) || creatingCords.includes(1)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(1)}
            id="1"
          >
            Prinzipal-bass 16'
          </div>
          <div
            className={`cord ${
              activeCords.includes(2) || creatingCords.includes(2)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(2)}
            id="2"
          >
            Subbass 16'
          </div>
          <div
            className={`cord ${
              activeCords.includes(3) || creatingCords.includes(3)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(3)}
            id="3"
          >
            Oktavbass 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(4) || creatingCords.includes(4)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(4)}
            id="4"
          >
            Fletbas 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(5) || creatingCords.includes(5)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(5)}
            id="5"
          >
            Choralbass 4'
          </div>
        </div>
        <div className="cords" id="manualST">
          <h2>Manuał I</h2>
          <div
            className={`cord ${
              activeCords.includes(6) || creatingCords.includes(6)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(6)}
            id="6"
          >
            Prinzipal 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(7) || creatingCords.includes(7)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(7)}
            id="7"
          >
            Gamba 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(8) || creatingCords.includes(8)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(8)}
            id="8"
          >
            Oktave 4'
          </div>
          <div
            className={`cord ${
              activeCords.includes(9) || creatingCords.includes(9)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(9)}
            id="9"
          >
            Nasard 2 2/3'
          </div>
          <div
            className={`cord ${
              activeCords.includes(10) || creatingCords.includes(10)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(10)}
            id="10"
          >
            Mixtur 4f.
          </div>
        </div>
        <div className="cords" id="manualND">
          <h2>Manuał II</h2>
          <div
            className={`cord ${
              activeCords.includes(11) || creatingCords.includes(11)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(11)}
            id="11"
          >
            Rohrgedeckt 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(12) || creatingCords.includes(12)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(12)}
            id="12"
          >
            Gedackt 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(13) || creatingCords.includes(13)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(13)}
            id="13"
          >
            Prestant 4'
          </div>
          <div
            className={`cord ${
              activeCords.includes(14) || creatingCords.includes(14)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(14)}
            id="14"
          >
            Gedacktflote 4'
          </div>
          <div
            className={`cord ${
              activeCords.includes(15) || creatingCords.includes(15)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(15)}
            id="15"
          >
            Klein-prinzipal 2'
          </div>
          <div
            className={`cord ${
              activeCords.includes(16) || creatingCords.includes(16)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(16)}
            id="16"
          >
            Spitzquinte 1 1/3'
          </div>
          <div
            className={`cord ${
              activeCords.includes(17) || creatingCords.includes(17)
                ? "active"
                : ""
            }`}
            onClick={() => toggleCord(17)}
            id="17"
          >
            Zimbel 3f.
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="editing">
          <button>Zapisz</button>
          <button
            onClick={() => {
              setIsEditing(false);
              toggleTable(step);
            }}
          >
            Anuluj
          </button>
        </div>
      )}
    </div>
  );
});

export default CordsTable;
