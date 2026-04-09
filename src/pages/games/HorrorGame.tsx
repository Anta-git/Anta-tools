import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
  type FC,
  type MouseEvent,
} from "react";

interface Room {
  name: string;
  discovered: boolean;
  lit: boolean;
  x: number;
  y: number;
  connections: string[];
  description: string;
}

//TODO: Placeholders, ignore the error codes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Resources {
  power: number;
  light: number;
  sanity: number;
  salvage: number;
  signal: number;
}

interface Log {
  time: string;
  text: string;
  type: "info" | "warning" | "danger" | "system" | "presence";
}

const ROOMS: Record<string, Room> = {
  entrance: {
    name: "Main Hall",
    discovered: true,
    lit: true,
    x: 50,
    y: 70,
    connections: ["corridor_a", "office"],
    description:
      "The entrance. Emergency lights flicker overhead. The front door is sealed shut.",
  },
  corridor_a: {
    name: "East Corridor",
    discovered: true,
    lit: true,
    x: 75,
    y: 55,
    connections: ["entrance", "generator", "ward_a"],
    description:
      "Long hallway. Waterlogged floor. Something scratched the walls.",
  },
  office: {
    name: "Admin Office",
    discovered: true,
    lit: true,
    x: 25,
    y: 55,
    connections: ["entrance", "storage"],
    description:
      "Desks overturned. Filing cabinets gutted. A radio hums on the desk.",
  },
  generator: {
    name: "Generator Room",
    discovered: true,
    lit: false,
    x: 85,
    y: 35,
    connections: ["corridor_a"],
    description:
      "The main power source. Diesel fumes. The generator coughs and sputters.",
  },
  ward_a: {
    name: "Ward A",
    discovered: false,
    lit: false,
    x: 60,
    y: 30,
    connections: ["corridor_a", "lab"],
    description: "???",
  },
  storage: {
    name: "Supply Room",
    discovered: true,
    lit: false,
    x: 15,
    y: 35,
    connections: ["office"],
    description: "Shelves of salvage. Most of it rusted. Some of it... isn't.",
  },
  lab: {
    name: "Research Lab",
    discovered: false,
    lit: false,
    x: 45,
    y: 15,
    connections: ["ward_a"],
    description: "???",
  },
};

const TABS = ["explore", "systems", "logs", "map"] as const;

interface GlitchTextProps {
  text: string;
  intensity?: number;
}

// Glitch text effect
const GlitchText: FC<GlitchTextProps> = ({ text, intensity = 0.03 }) => {
  const [display, setDisplay] = useState(text);
  const glitchChars = "█▓▒░╔╗╚╝║═╬┼├┤┬┴";

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < intensity) {
        const arr = text.split("");
        const idx = Math.floor(Math.random() * arr.length);
        arr[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        setDisplay(arr.join(""));
        setTimeout(
          () => {
            setDisplay(text);
          },
          80 + Math.random() * 120,
        );
      }
    }, 200);
    return () => {
      clearInterval(interval);
    };
  }, [text, intensity]);

  return <span>{display}</span>;
};

interface FlickerProps {
  children: ReactNode;
  rate?: number;
}

// Flickering element
const Flicker: FC<FlickerProps> = ({ children, rate = 0.015 }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < rate) {
        setVisible(false);
        setTimeout(
          () => {
            setVisible(true);
          },
          40 + Math.random() * 80,
        );
      }
    }, 100);
    return () => { clearInterval(interval); };
  }, [rate]);
  return <span style={{ opacity: visible ? 1 : 0.15 }}>{children}</span>;
};

// Scanline overlay
const Scanlines: FC = () => {
  return (
    <div
      style={
        {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          pointerEvents: "none",
          zIndex: 9999,
        } as CSSProperties
      }
    />
  );
};

// CRT vignette
const CRTOverlay: FC = () => {
  return (
    <div
      style={
        {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
          zIndex: 9998,
        } as CSSProperties
      }
    />
  );
};

interface ResourceBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
  warningThreshold?: number;
}

// Resource bar component
const ResourceBar: FC<ResourceBarProps> = ({
  label,
  value,
  max,
  color,
  icon,
  warningThreshold = 0.25,
}) => {
  const pct = Math.min(value / max, 1);
  const isLow = pct < warningThreshold;

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
        }}
      >
        <span
          style={{
            color: isLow ? "#c0392b" : color,
            textTransform: "uppercase",
          }}
        >
          {isLow ? (
            <Flicker rate={0.06}>
              {icon} {label}
            </Flicker>
          ) : (
            <>
              {icon} {label}
            </>
          )}
        </span>
        <span style={{ color: isLow ? "#c0392b" : "rgba(180,180,160,0.7)" }}>
          {Math.floor(value)}/{max}
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "rgba(40,40,35,0.8)",
          borderRadius: 1,
          border: `1px solid ${isLow ? "rgba(192,57,43,0.4)" : "rgba(100,100,80,0.3)"}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${String(pct * 100)}%`,
            background: isLow
              ? "linear-gradient(90deg, #c0392b, #e74c3c)"
              : `linear-gradient(90deg, ${color}88, ${color})`,
            transition: "width 0.8s ease",
            boxShadow: isLow
              ? "0 0 8px rgba(192,57,43,0.5)"
              : `0 0 6px ${color}33`,
          }}
        />
      </div>
    </div>
  );
};

interface MapNodeProps {
  room: Room;
  id: string;
  isActive: boolean;
  onClick: () => void;
  presenceNear: boolean;
}

// Map node
const MapNode: FC<MapNodeProps> = ({
  room,
  isActive,
  onClick,
  presenceNear,
}) => {
  if (!room.discovered) {
    return (
      <div
        onClick={onClick}
        style={
          {
            position: "absolute",
            left: `${String(room.x)}%`,
            top: `${String(room.y)}%`,
            transform: "translate(-50%,-50%)",
            width: 14,
            height: 14,
            borderRadius: 2,
            border: "1px dashed rgba(100,100,80,0.3)",
            background: "rgba(20,20,18,0.5)",
            cursor: "pointer",
          } as CSSProperties
        }
      >
        <div
          style={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            color: "rgba(100,100,80,0.4)",
            whiteSpace: "nowrap",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          ???
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={
        {
          position: "absolute",
          left: `${String(room.x)}%`,
          top: `${String(room.y)}%`,
          transform: "translate(-50%,-50%)",
          width: 16,
          height: 16,
          borderRadius: 2,
          cursor: "pointer",
          border: isActive
            ? "2px solid #d4a843"
            : `1px solid ${room.lit ? "rgba(160,155,130,0.5)" : "rgba(80,80,70,0.4)"}`,
          background: isActive
            ? "rgba(212,168,67,0.15)"
            : room.lit
              ? "rgba(160,155,130,0.1)"
              : "rgba(40,40,35,0.6)",
          boxShadow: isActive
            ? "0 0 12px rgba(212,168,67,0.3)"
            : presenceNear
              ? "0 0 10px rgba(120,20,20,0.4)"
              : "none",
          transition: "all 0.3s ease",
        } as CSSProperties
      }
    >
      {!room.lit && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "rgba(180,170,140,0.5)",
          }}
        >
          ◌
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 9,
          color: isActive ? "#d4a843" : "rgba(160,155,130,0.6)",
          whiteSpace: "nowrap",
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: "0.04em",
        }}
      >
        {room.name}
      </div>
    </div>
  );
};

interface LogEntryProps {
  time: string;
  text: string;
  type: "info" | "warning" | "danger" | "system" | "presence";
}

// Log entry component
const LogEntry: FC<LogEntryProps> = ({ time, text, type }) => {
  const colors: Record<string, string> = {
    info: "rgba(160,155,130,0.7)",
    warning: "#d4a843",
    danger: "#c0392b",
    system: "#5a8a6a",
    presence: "#8a3a5a",
  };
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        lineHeight: 1.6,
        color: colors[type] || colors.info,
        marginBottom: 4,
        paddingLeft: 12,
        borderLeft: `2px solid ${colors[type]}33`,
      }}
    >
      <span style={{ opacity: 0.5 }}>[{time}]</span> {text}
    </div>
  );
};

interface PuzzleSlotProps {
  filled: boolean;
  symbol: string;
  onClick: () => void;
  glowing: boolean;
}

// Puzzle slot component
const PuzzleSlot: FC<PuzzleSlotProps> = ({
  filled,
  symbol,
  onClick,
  glowing,
}) => {
  return (
    <div
      onClick={onClick}
      style={
        {
          width: 48,
          height: 48,
          border: `1px solid ${glowing ? "#d4a843" : "rgba(100,100,80,0.4)"}`,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: filled ? "rgba(90,138,106,0.1)" : "rgba(20,20,18,0.6)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: glowing ? "0 0 12px rgba(212,168,67,0.2)" : "none",
          fontFamily: "'Crimson Pro', serif",
          fontSize: 20,
          color: filled ? "#5a8a6a" : "rgba(100,100,80,0.3)",
        } as CSSProperties
      }
    >
      {filled ? symbol : "·"}
    </div>
  );
};

export default function HorrorGame() {
  const [activeTab, setActiveTab] = useState<
    "explore" | "systems" | "logs" | "map"
  >("explore");
  const [currentRoom, setCurrentRoom] = useState("entrance");
  const [resources, setResources] = useState({
    power: 67,
    light: 45,
    sanity: 82,
    salvage: 23,
    signal: 12,
  });
  const [tick, setTick] = useState(0);
  //TODO: Placeholder, ignore the error codes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logs, setLogs] = useState<Log[]>([
    {
      time: "00:04:12",
      text: "Generator output nominal. Fuel at 34%.",
      type: "system",
    },
    {
      time: "00:03:58",
      text: "Motion detected — East Corridor. Source: unknown.",
      type: "presence",
    },
    {
      time: "00:03:41",
      text: "Radio signal intercepted. Frequency: 97.3 MHz. Decoding...",
      type: "info",
    },
    {
      time: "00:02:15",
      text: "WARNING: Light failure in Storage Room.",
      type: "warning",
    },
    {
      time: "00:01:30",
      text: "Salvage drone returned. Yield: 3 units (anomalous composition).",
      type: "warning",
    },
    {
      time: "00:00:47",
      text: "Sanity check: STABLE. Marginal drift detected.",
      type: "system",
    },
  ]);
  const [puzzleSlots, setPuzzleSlots] = useState([
    true,
    true,
    false,
    false,
    false,
    false,
  ]);
  const [showScratchedText, setShowScratchedText] = useState(false);
  //TODO: Placeholders, ignore the error codes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoverRoom, setHoverRoom] = useState(null);
  const logRef = useRef(null);

  // Idle tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      setResources((r) => ({
        power: Math.max(
          0,
          Math.min(100, r.power + (Math.random() > 0.6 ? -1 : 0.5)),
        ),
        light: Math.max(0, Math.min(80, r.light + (r.power > 30 ? 0.3 : -0.8))),
        sanity: Math.max(
          0,
          Math.min(100, r.sanity + (r.light > 20 ? 0.1 : -0.5)),
        ),
        salvage: Math.min(50, r.salvage + 0.15),
        signal: Math.min(30, r.signal + (r.power > 50 ? 0.08 : 0)),
      }));
    }, 2000);
    return () => { clearInterval(interval); };
  }, []);

  const room = ROOMS[currentRoom];

  // --- Styles ---
  const containerStyle: CSSProperties = {
    width: "100%",
    maxWidth: 900,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#0e0e0c",
    fontFamily: "'Crimson Pro', serif",
    color: "rgba(180,175,155,0.9)",
    position: "relative",
    overflow: "hidden",
  };

  const headerStyle: CSSProperties = {
    padding: "16px 20px 12px",
    borderBottom: "1px solid rgba(100,100,80,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyle: CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#d4a843",
    textShadow: "0 0 20px rgba(212,168,67,0.2)",
  };

  const tabBarStyle: CSSProperties = {
    display: "flex",
    gap: 0,
    borderBottom: "1px solid rgba(100,100,80,0.15)",
    background: "rgba(18,18,16,0.8)",
  };

  const tabStyle = (isActive: boolean): CSSProperties => ({
    padding: "10px 20px",
    cursor: "pointer",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: isActive ? "#d4a843" : "rgba(130,125,110,0.6)",
    background: isActive ? "rgba(212,168,67,0.06)" : "transparent",
    borderBottom: isActive ? "2px solid #d4a843" : "2px solid transparent",
    transition: "all 0.2s ease",
  });

  const panelStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: 500,
  };

  const sidebarStyle: CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(100,100,80,0.12)",
    background: "rgba(14,14,12,0.9)",
  };

  const mainContentStyle: CSSProperties = {
    flex: 1,
    padding: "20px",
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(20,20,18,0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(100,100,80,0.3); border-radius: 2px; }
        @keyframes pulse-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes drift { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes flicker-anim { 0%,95%,100% { opacity: 1; } 96% { opacity: 0.2; } 97% { opacity: 0.9; } 98% { opacity: 0.15; } }
      `}</style>

      <Scanlines />
      <CRTOverlay />

      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>
          <GlitchText text="The Containment" intensity={0.02} />
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: "rgba(130,125,110,0.5)",
            textAlign: "right",
            lineHeight: 1.6,
          }}
        >
          <div>NIGHT 01 — HOUR 04</div>
          <div
            style={{
              color: resources.sanity < 30 ? "#c0392b" : "rgba(90,138,106,0.7)",
            }}
          >
            STATUS:{" "}
            {resources.sanity < 30
              ? "UNSTABLE"
              : resources.sanity < 60
                ? "STRESSED"
                : "COHERENT"}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={tabBarStyle}>
        {TABS.map((tab) => (
          <div
            key={tab}
            style={tabStyle(activeTab === tab)}
            onClick={() => { setActiveTab(tab); }}
          >
            {tab === "explore"
              ? "◈ Explore"
              : tab === "systems"
                ? "⚡ Systems"
                : tab === "logs"
                  ? "◫ Logs"
                  : "◰ Map"}
          </div>
        ))}
      </div>

      {/* Resources - always visible */}
      <div style={sidebarStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px 20px",
          }}
        >
          <ResourceBar
            label="Power"
            value={resources.power}
            max={100}
            color="#d4a843"
            icon="⚡"
          />
          <ResourceBar
            label="Light"
            value={resources.light}
            max={80}
            color="#a0986a"
            icon="◐"
          />
          <ResourceBar
            label="Sanity"
            value={resources.sanity}
            max={100}
            color="#5a8a6a"
            icon="◉"
            warningThreshold={0.3}
          />
          <ResourceBar
            label="Salvage"
            value={resources.salvage}
            max={50}
            color="#8a7a5a"
            icon="⬡"
          />
          <ResourceBar
            label="Signal"
            value={resources.signal}
            max={30}
            color="#5a7a8a"
            icon="∿"
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: tick % 5 < 2 ? "#c0392b" : "rgba(80,20,20,0.4)",
                boxShadow:
                  tick % 5 < 2 ? "0 0 8px rgba(192,57,43,0.6)" : "none",
                transition: "all 0.3s ease",
              }}
            />
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "rgba(192,57,43,0.6)",
                letterSpacing: "0.08em",
              }}
            >
              PRESENCE: NEAR
            </span>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div style={panelStyle}>
        <div style={mainContentStyle}>
          {/* EXPLORE TAB */}
          {activeTab === "explore" && (
            <div>
              <div
                style={{
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(100,100,80,0.12)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: room.lit
                      ? "rgba(212,168,67,0.9)"
                      : "rgba(130,125,110,0.5)",
                    marginBottom: 6,
                    letterSpacing: "0.06em",
                  }}
                >
                  {room.lit ? (
                    room.name
                  ) : (
                    <Flicker rate={0.08}>{room.name}</Flicker>
                  )}
                </h2>
                <p
                  style={{
                    fontFamily: "'Crimson Pro', serif",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(160,155,140,0.75)",
                    fontStyle: "italic",
                    maxWidth: 600,
                  }}
                >
                  {room.description}
                </p>
              </div>

              {/* Room interactions */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: "rgba(130,125,110,0.4)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Actions
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    "Search room",
                    "Check equipment",
                    ...(currentRoom === "office" ? ["Tune radio"] : []),
                    ...(!room.lit ? ["Use flashlight"] : []),
                    ...(currentRoom === "generator"
                      ? ["Repair generator"]
                      : []),
                  ].map((action) => (
                    <button
                      key={action}
                      style={
                        {
                          padding: "8px 16px",
                          background: "rgba(30,30,26,0.8)",
                          border: "1px solid rgba(100,100,80,0.3)",
                          borderRadius: 2,
                          color: "rgba(180,175,155,0.8)",
                          fontFamily: "'Crimson Pro', serif",
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        } as CSSProperties
                      }
                      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.borderColor = "#d4a843";
                        e.currentTarget.style.color = "#d4a843";
                      }}
                      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                        e.currentTarget.style.borderColor =
                          "rgba(100,100,80,0.3)";
                        e.currentTarget.style.color = "rgba(180,175,155,0.8)";
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: "rgba(130,125,110,0.4)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Move to
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {room.connections.map((id: string) => {
                    const target = ROOMS[id];
                    return (
                      <button
                        key={id}
                        onClick={() => { setCurrentRoom(id); }}
                        style={
                          {
                            padding: "8px 16px",
                            background: target.discovered
                              ? "rgba(30,30,26,0.8)"
                              : "rgba(20,20,18,0.6)",
                            border: `1px solid ${target.discovered ? "rgba(100,100,80,0.3)" : "rgba(80,80,70,0.2)"}`,
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            color: target.discovered
                              ? "rgba(180,175,155,0.8)"
                              : "rgba(100,100,80,0.4)",
                            fontFamily: "'Crimson Pro', serif",
                            fontSize: 13,
                          } as CSSProperties
                        }
                        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.borderColor = target.discovered
                            ? "#d4a843"
                            : "rgba(130,125,110,0.3)";
                        }}
                        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.borderColor = target.discovered
                            ? "rgba(100,100,80,0.3)"
                            : "rgba(80,80,70,0.2)";
                        }}
                      >
                        {target.discovered ? `→ ${target.name}` : "→ ???"}
                        {!target.lit && target.discovered && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: 10,
                              opacity: 0.5,
                            }}
                          >
                            ◌ dark
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Environmental detail */}
              {currentRoom === "entrance" && (
                <div
                  style={{
                    marginTop: 32,
                    padding: "16px 20px",
                    background: "rgba(20,20,18,0.6)",
                    border: "1px solid rgba(100,100,80,0.15)",
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      color: "rgba(212,168,67,0.5)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Found Object
                  </div>
                  <div
                    style={{
                      fontFamily: "'Crimson Pro', serif",
                      fontSize: 14,
                      lineHeight: 1.8,
                      color: "rgba(160,155,140,0.7)",
                      fontStyle: "italic",
                    }}
                  >
                    A note, water-damaged, pinned to the reception desk. The
                    handwriting deteriorates line by line.
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      padding: "12px 16px",
                      background: "rgba(10,10,8,0.6)",
                      borderLeft: "2px solid rgba(212,168,67,0.3)",
                      fontFamily: "'Crimson Pro', italic",
                      fontSize: 13,
                      lineHeight: 1.8,
                      color: "rgba(140,135,120,0.6)",
                    }}
                  >
                    "If you're reading this, don't go below B2. Don't listen to
                    the radio after midnight. And whatever you find in the
                    chapel —{" "}
                    <span
                      style={{
                        cursor: "pointer",
                        borderBottom: "1px dashed rgba(212,168,67,0.3)",
                      }}
                      onClick={() => { setShowScratchedText(!showScratchedText); }}
                    >
                      {showScratchedText ? (
                        <span style={{ color: "#c0392b" }}>
                          don't use it. It's not a gift. It's a mouth.
                        </span>
                      ) : (
                        <span style={{ color: "rgba(100,100,80,0.4)" }}>
                          [scratched out — click to examine]
                        </span>
                      )}
                    </span>
                    "
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SYSTEMS TAB */}
          {activeTab === "systems" && (
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "rgba(130,125,110,0.4)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Automated Systems
              </div>

              {[
                {
                  name: "Primary Generator",
                  status: "RUNNING",
                  output: "+1.2 power/s",
                  health: 72,
                  note: "Fuel consumption increasing. Exhaust smells wrong.",
                },
                {
                  name: "Emergency Lighting",
                  status: "PARTIAL",
                  output: "4/7 zones lit",
                  health: 45,
                  note: "Bulbs in Ward A unresponsive. Filaments intact — cause unknown.",
                },
                {
                  name: "Salvage Drone",
                  status: "ACTIVE",
                  output: "+0.3 salvage/s",
                  health: 88,
                  note: "Last payload contained organic material. Reclassified as anomalous.",
                },
                {
                  name: "Radio Decoder",
                  status: "SCANNING",
                  output: "+0.1 signal/s",
                  health: 60,
                  note: "Intercepting repeating broadcast. Language: unidentified.",
                },
              ].map((sys, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 18px",
                    marginBottom: 10,
                    background: "rgba(20,20,18,0.6)",
                    border: "1px solid rgba(100,100,80,0.12)",
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 14,
                        color: "rgba(180,175,155,0.9)",
                      }}
                    >
                      {sys.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 2,
                        background:
                          sys.status === "RUNNING"
                            ? "rgba(90,138,106,0.15)"
                            : sys.status === "PARTIAL"
                              ? "rgba(212,168,67,0.15)"
                              : "rgba(90,122,138,0.15)",
                        color:
                          sys.status === "RUNNING"
                            ? "#5a8a6a"
                            : sys.status === "PARTIAL"
                              ? "#d4a843"
                              : "#5a7a8a",
                      }}
                    >
                      {sys.status}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        color: "rgba(130,125,110,0.6)",
                      }}
                    >
                      Output: {sys.output}
                    </span>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        color: "rgba(130,125,110,0.6)",
                      }}
                    >
                      Integrity: {sys.health}%
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Crimson Pro', italic",
                      fontSize: 12,
                      color: "rgba(140,135,120,0.5)",
                      fontStyle: "italic",
                    }}
                  >
                    {sys.note}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button
                      style={{
                        padding: "5px 12px",
                        background: "rgba(30,30,26,0.8)",
                        border: "1px solid rgba(100,100,80,0.3)",
                        borderRadius: 2,
                        color: "rgba(180,175,155,0.7)",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10,
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                    >
                      REPAIR
                    </button>
                    <button
                      style={{
                        padding: "5px 12px",
                        background: "rgba(30,30,26,0.8)",
                        border: "1px solid rgba(100,100,80,0.3)",
                        borderRadius: 2,
                        color: "rgba(180,175,155,0.7)",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10,
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                    >
                      UPGRADE
                    </button>
                    <button
                      style={{
                        padding: "5px 12px",
                        background: "rgba(30,30,26,0.8)",
                        border: "1px solid rgba(192,57,43,0.3)",
                        borderRadius: 2,
                        color: "rgba(192,57,43,0.7)",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10,
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                    >
                      SHUTDOWN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === "logs" && (
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "rgba(130,125,110,0.4)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                System Log — Newest First
              </div>
              <div ref={logRef} style={{ maxHeight: 400, overflowY: "auto" }}>
                {logs.map((log, i) => (
                  <LogEntry key={i} {...log} />
                ))}
              </div>

              {/* Puzzle section in logs */}
              <div
                style={{
                  marginTop: 24,
                  padding: "16px 20px",
                  background: "rgba(20,20,18,0.6)",
                  border: "1px solid rgba(90,122,138,0.2)",
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: "rgba(90,122,138,0.6)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Decoded Signal — Fragment Assembly
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {puzzleSlots.map((filled, i) => (
                    <PuzzleSlot
                      key={i}
                      filled={filled}
                      symbol={["◬", "◭", "◮", "◯", "◈", "◇"][i]}
                      glowing={i === 2}
                      onClick={() => {
                        if (!filled) {
                          const next = [...puzzleSlots];
                          next[i] = true;
                          setPuzzleSlots(next);
                        }
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "'Crimson Pro', italic",
                    fontSize: 12,
                    color: "rgba(140,135,120,0.5)",
                  }}
                >
                  2 of 6 fragments decoded. Signal source: Sub-basement B3.
                  Content: containment protocol...
                </div>
              </div>
            </div>
          )}

          {/* MAP TAB */}
          {activeTab === "map" && (
            <div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "rgba(130,125,110,0.4)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Facility Map — Floor 1
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "60%",
                  background: "rgba(18,18,16,0.8)",
                  border: "1px solid rgba(100,100,80,0.15)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {/* Grid lines */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.08,
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <line
                      key={`h${String(i)}`}
                      x1="0"
                      y1={`${String(i * 5)}%`}
                      x2="100%"
                      y2={`${String(i * 5)}%`}
                      stroke="rgba(160,155,130,1)"
                      strokeWidth="0.5"
                    />
                  ))}
                  {Array.from({ length: 20 }, (_, i) => (
                    <line
                      key={`v${String(i)}`}
                      x1={`${String(i * 5)}%`}
                      y1="0"
                      x2={`${String(i * 5)}%`}
                      y2="100%"
                      stroke="rgba(160,155,130,1)"
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>

                {/* Connection lines */}
                <svg
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {Object.entries(ROOMS).map(([id, r]) =>
                    r.connections.map((cid: string) => {
                      const target = ROOMS[cid];
                      if (!r.discovered || !target.discovered) return null;
                      return (
                        <line
                          key={`${id}-${cid}`}
                          x1={`${String(r.x)}%`}
                          y1={`${String(r.y)}%`}
                          x2={`${String(target.x)}%`}
                          y2={`${String(target.y)}%`}
                          stroke="rgba(100,100,80,0.2)"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      );
                    }),
                  )}
                </svg>

                {/* Room nodes */}
                {Object.entries(ROOMS).map(([id, r]) => (
                  <MapNode
                    key={id}
                    room={r}
                    id={id}
                    isActive={currentRoom === id}
                    presenceNear={id === "corridor_a" && tick % 6 < 3}
                    onClick={() => {
                      if (r.discovered) {
                        setCurrentRoom(id);
                        setActiveTab("explore");
                      }
                    }}
                  />
                ))}

                {/* Presence indicator */}
                <div
                  style={{
                    position: "absolute",
                    left: `${String(ROOMS.corridor_a.x + Math.sin(tick * 0.5) * 3)}%`,
                    top: `${String(ROOMS.corridor_a.y + Math.cos(tick * 0.7) * 2)}%`,
                    transform: "translate(-50%,-50%)",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(120,20,20,0.3), transparent)",
                    animation: "pulse-glow 3s ease infinite",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Map legend */}
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(100,100,80,0.1)",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "rgba(130,125,110,0.4)",
                }}
              >
                <span>◼ Lit room</span>
                <span>◌ Dark room</span>
                <span style={{ color: "#d4a843" }}>◼ Current</span>
                <span style={{ color: "rgba(120,20,20,0.7)" }}>● Presence</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        style={{
          padding: "8px 20px",
          borderTop: "1px solid rgba(100,100,80,0.12)",
          background: "rgba(14,14,12,0.95)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          color: "rgba(100,100,80,0.4)",
          letterSpacing: "0.06em",
        }}
      >
        <span>
          <Flicker rate={0.01}>▸ IDLE SYSTEMS ACTIVE</Flicker>
        </span>
        <span>DEPTH: FLOOR 1 · ROOMS: 5/12 · LOCKS: 7</span>
        <span style={{ color: "rgba(192,57,43,0.4)" }}>
          <GlitchText text="◁ SOMETHING IS LISTENING ▷" intensity={0.04} />
        </span>
      </div>
    </div>
  );
}
