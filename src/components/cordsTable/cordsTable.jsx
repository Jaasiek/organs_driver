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
  { creating, step, toggleTable, title, playing },
  ref
) {
  const [activeCords, setActiveCords] = useState([]);
  const [creatingCords, setCreatingCords] = useState([]);
  const [cordsBackUP, setCordsBackUP] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const creatingCordsRef = useRef();

  useImperativeHandle(ref, () => ({
    getCombination: () => creatingCordsRef.current,
    edit: () => {
      setIsEditing(true);
      setCordsBackUP(creatingCordsRef.current);
    },
    setCombination: (givenCombination) => {
      setCreatingCords(givenCombination);
    },
  }));

  const toggleCord = (id) => {
    if (creating) {
      setCreatingCords((prev) => {
        const cordsSet = new Set(prev);
        if (cordsSet.has(id)) {
          cordsSet.delete(id);
        } else {
          cordsSet.add(id);
        }
        return Array.from(cordsSet);
      });
    }
    if (playing) {
      setActiveCords((prev) => {
        const cordsSet = new Set(prev);
        if (cordsSet.has(id)) {
          cordsSet.delete(id);
        } else {
          cordsSet.add(id);
        }
        return Array.from(cordsSet);
      });
    }
  };

  const saveCombination = () => {
    socket.emit("editing_combination", {
      active_cords: creatingCordsRef.current,
      track_name: title,
      step: step,
      owner: localStorage.getItem("username"),
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

    const handleRegisters = (data) => {
      toggleCord(data.number);
    };

    const handleTUTTI = () => {
      setActiveCords([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 100, 101, 102,
      ]);
    };

    const handleCancel = () => {
      setActiveCords([]);
    };

    socket.on("play", handleCordsActivation);
    socket.on("next_step_info", handleCordsActivation);
    socket.on("previoust_step_info", handleCordsActivation);
    socket.on("get_combination", handleCreatedCombination);
    socket.on("previoust_step_edit", handleCordsActivation);
    socket.on("registers", handleRegisters);
    socket.on("TUTTI", handleTUTTI);
    socket.on("clear", handleCancel);

    return () => {
      socket.off("play", handleCordsActivation);
      socket.off("next_step_info", handleCordsActivation);
      socket.off("previoust_step_info", handleCordsActivation);
      socket.off("get_combination", handleCreatedCombination);
      socket.off("previoust_step_edit", handleCordsActivation);
      socket.off("registers", handleRegisters);
      socket.off("TUTTI", handleTUTTI);
      socket.off("clear", handleCancel);
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
          >
            Subbass 16'
          </div>
          <div
            className={`cord ${
              activeCords.includes(2) || creatingCords.includes(2)
                ? "active"
                : ""
            }`}
          >
            Oktavbass 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(3) || creatingCords.includes(3)
                ? "active"
                : ""
            }`}
          >
            Gemshorn 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(4) || creatingCords.includes(4)
                ? "active"
                : ""
            }`}
          >
            Choralbass 4'
          </div>
          <div
            className={`cord ${
              activeCords.includes(100) || creatingCords.includes(100)
                ? "active"
                : ""
            }`}
          >
            P - I
          </div>
          <div
            className={`cord ${
              activeCords.includes(101) || creatingCords.includes(101)
                ? "active"
                : ""
            }`}
          >
            P - II
          </div>
        </div>

        <div className="cords" id="manualST">
          <h2>Manuał I</h2>
          <div
            className={`cord ${
              activeCords.includes(5) || creatingCords.includes(5)
                ? "active"
                : ""
            }`}
          >
            Prinzipal 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(6) || creatingCords.includes(6)
                ? "active"
                : ""
            }`}
          >
            Gamba 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(7) || creatingCords.includes(7)
                ? "active"
                : ""
            }`}
          >
            Prestant 4'
          </div>
          <div
            className={`cord ${
              activeCords.includes(8) || creatingCords.includes(8)
                ? "active"
                : ""
            }`}
          >
            Nasard 2 2/3'
          </div>
          <div
            className={`cord ${
              activeCords.includes(9) || creatingCords.includes(9)
                ? "active"
                : ""
            }`}
          >
            Mixtur 4f.
          </div>
          <div
            className={`cord ${
              activeCords.includes(102) || creatingCords.includes(102)
                ? "active"
                : ""
            }`}
          >
            I - II
          </div>
        </div>

        <div className="cords" id="manualND">
          <h2>Manuał II</h2>
          <div
            className={`cord ${
              activeCords.includes(10) || creatingCords.includes(10)
                ? "active"
                : ""
            }`}
          >
            Rohrgedeckt 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(11) || creatingCords.includes(11)
                ? "active"
                : ""
            }`}
          >
            Gedackt 8'
          </div>
          <div
            className={`cord ${
              activeCords.includes(12) || creatingCords.includes(12)
                ? "active"
                : ""
            }`}
          >
            Oktave 4'
          </div>
          <div
            className={`cord ${
              activeCords.includes(13) || creatingCords.includes(13)
                ? "active"
                : ""
            }`}
          >
            Gedacktflote 4'
          </div>
          <div
            className={`cord ${
              activeCords.includes(14) || creatingCords.includes(14)
                ? "active"
                : ""
            }`}
          >
            Klein-prinzipal 2'
          </div>
          <div
            className={`cord ${
              activeCords.includes(15) || creatingCords.includes(15)
                ? "active"
                : ""
            }`}
          >
            Spitzquinte 1 1/3'
          </div>
          <div
            className={`cord ${
              activeCords.includes(16) || creatingCords.includes(16)
                ? "active"
                : ""
            }`}
          >
            Zimbel 3f.
          </div>
          <div
            className={`cord ${
              activeCords.includes(17) || creatingCords.includes(17)
                ? "active"
                : ""
            }`}
          >
            Tremolo
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="editing">
          <button
            onClick={() => {
              setIsEditing(false);
              toggleTable(step);
              saveCombination();
            }}
          >
            Zapisz
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setCreatingCords(cordsBackUP);
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
