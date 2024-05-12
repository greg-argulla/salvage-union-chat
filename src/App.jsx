/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import OBR from "@owlbear-rodeo/sdk";
import "./App.css";

const chatLimit = 60;

const rollTable = [
  {
    name: "Core Mechanic",
    table: {
      20: {
        name: "Nailed It",
        description:
          "You have overcome the odds and managed an outstanding success. You may achieve an additional bonus of your choice to the action. When dealing damage, you can choose to double it or pick another appropriate bonus effect.",
      },
      11: {
        name: "Success",
        description:
          "You have achieved your goal without any compromises. When attacking, you hit the target and deal standard damage.",
      },
      6: {
        name: "Tough Choice",
        description:
          "You succeed in your action, but at a cost. The Mediator gives you a Tough Choice with some kind of Setback attached. When attacking, you hit, but must make a Tough Choice.",
      },
      2: {
        name: "Failure",
        description:
          "You have failed at what you were attempting to do. You face a Setback of the Mediator’s choice. When attacking, you miss the target.",
      },
      1: {
        name: "Cascade Failure",
        description:
          "Something has gone terribly wrong. You suffer a severe conse- quence of the Mediator’s choice. When attacking, you miss the target and suffer a Setback chosen by the Mediator.",
      },
    },
  },

  {
    name: "Group Initiative",
    table: {
      20: {
        name: "You Shot First",
        description:
          "Two Pilots chosen by the players act first. Play then passes to the NPC group and one NPC chosen by the Mediator acts next.",
      },
      11: {
        name: "Quickdraw",
        description:
          "One Pilot chosen by the players acts first. Play then passes to the NPC group and one NPC chosen by the Mediator acts.",
      },
      6: {
        name: "Wait and See",
        description:
          "One NPC chosen by the players acts first. Play then passes to the player group and one Pilot chosen by the players acts.",
      },
      2: {
        name: "Fumble",
        description:
          "One NPC chosen by the Mediator acts first. Play then passes to the player group and one Pilot chosen by the players acts.",
      },
      1: {
        name: "Ambush",
        description:
          "Two NPCs chosen by the Mediator act first. Play then passes to the player group and one Pilot is chosen by the players to act next.",
      },
    },
  },

  {
    name: "Critical Injury",
    table: {
      20: {
        name: "Miraculous Survival",
        description:
          "You survive against the odds. You have 1 HP, remain conscious and can act normally.",
      },
      11: {
        name: "Unconscious",
        description:
          "You are stable at 0 HP, but unconscious and cannot move or take actions until you gain at least 1 HP. You will regain consciousness naturally in 1 hour and get back up with 1 HP.",
      },
      6: {
        name: "Minor Injury",
        description:
          "You suffer a Minor Injury such as a sprain, burns, or minor concussion. Your Max HP is reduced by 1 until healed in a Tech 3 - 4 Med Bay. In addition, you are Unconscious. Apply the result of 11 - 19.",
      },
      2: {
        name: "Major Injury",
        description:
          "You suffer a Major Injury such as permanent scarring, broken ribs, or internal injuries. Your Max HP is reduced by 2 until healed in a Tech 5 - 6 Med Bay. In addition, you are Unconscious. Apply the result of 11-19.",
      },
      1: {
        name: "Fatal Injury",
        description: "Your Pilot suffers a fatal injury and dies.",
      },
    },
  },

  {
    name: "Critical Damage",
    table: {
      20: {
        name: "Miraculous Survival",
        description:
          "Your Mech is somehow Intact. It has 1 SP and is still fully operational. Your Pilot is unharmed.",
      },
      11: {
        name: "Core Damage",
        description:
          "Your Mech Chassis is damaged and inoperable until repaired. All mounted Systems and Modules remain Intact. Your Pilot is reduced to 0 HP unless they have some means to escape the Mech.",
      },
      6: {
        name: "Module Destruction",
        description:
          "A Module mounted on your Mech is destroyed. This is chosen by the Mediator or at random. Your Mech Chassis is damaged and inoperable until repaired. Your Pilot is unharmed.",
      },
      2: {
        name: "System Destruction",
        description:
          "A System mounted on your Mech is destroyed. This is chosen by the Mediator or at random. Your Mech Chassis is damaged and inoperable until repaired. Your Pilot is unharmed.",
      },
      1: {
        name: "Catastrophic Damage",
        description:
          "The Mech, as well as any mounted Systems and Modules as well as all Cargo, is destroyed. Your Pilot dies unless they have a means to escape the Mech.",
      },
    },
  },

  {
    name: "Push Your Mech",
    table: {
      20: {
        name: "Push Your Mech",
        description:
          "Gain 2 heat and check the roll. If you roll equal to or lower than your current heat, make a Reactor Overload check, else your reactor is safe, for now.",
      },
      11: {
        name: "Push Your Mech",
        description:
          "Gain 2 heat and check the roll. If you roll equal to or lower than your current heat, make a Reactor Overload check, else your reactor is safe, for now.",
      },
      6: {
        name: "Push Your Mech",
        description:
          "Gain 2 heat and check the roll. If you roll equal to or lower than your current heat, make a Reactor Overload check, else your reactor is safe, for now.",
      },
      2: {
        name: "Push Your Mech",
        description:
          "Gain 2 heat and check the roll. If you roll equal to or lower than your current heat, make a Reactor Overload check, else your reactor is safe, for now.",
      },
      1: {
        name: "Push Your Mech",
        description:
          "Gain 2 heat and check the roll. If you roll equal to or lower than your current heat, make a Reactor Overload check, else your reactor is safe, for now.",
      },
    },
  },

  {
    name: "Reactor Overload",
    table: {
      20: {
        name: "Reactor Overdrive",
        description:
          "Your Mech’s reactor goes into overdrive. Your Mech can take any additional action this turn or Push their next roll within 10 minutes for free.",
      },
      11: {
        name: "Reactor Overheat",
        description:
          "Your Mech’s reactor has overheated. Your Mech shuts down and gains the Vulnerable Trait. Your Mech will re-activate at the end of your next turn. In addition, your Mech takes an amount of SP damage equal to your current Heat.",
      },
      6: {
        name: "Module Overload",
        description:
          "One of your Mech’s Modules chosen at random or by the Mediator is destroyed.",
      },
      2: {
        name: "System Overload",
        description:
          "One of your Mech’s Systems chosen at random or by the Mediator is destroyed.",
      },
      1: {
        name: "Reactor Overload",
        description:
          "Your Mech’s reactor goes into full meltdown and explodes. Your Mech, as well as any mounted Systems, Modules, and all Cargo, is destroyed in the explosion. Everything in Close Range of your Mech takes SP damage equal to your Mech’s Maximum Heat Capacity. They may take any Turn Action or Reaction in response to try to avoid this. Your Pilot dies unless they have a means to escape. The area your Mech was in becomes Irradiated.",
      },
    },
  },

  {
    name: "Area Salvage",
    table: {
      20: {
        name: "Jackpot!",
        description:
          "You find a Mech Chassis, System, or Module at the Tech Level of the area. It is in the Damaged Condition. This can be randomised or chosen by the Mediator.",
      },
      11: {
        name: "Winning",
        description: "You find 3 Scrap of the Tech Level of the area.",
      },
      6: {
        name: "Not Bad",
        description: "You find 2 Scrap of the Tech Level of the area.",
      },
      2: {
        name: "Better than Nothing",
        description: "You find 1 Scrap of the Tech Level of the area.",
      },
      1: {
        name: "Nothing",
        description: "You find nothing in this area.",
      },
    },
  },

  {
    name: "Mech Salvage",
    table: {
      20: {
        name: "Lions Share",
        description:
          "You salvage the Mech Chassis, a System and a Module of your choice mounted on it. They both have the Damaged Condition. Anything else is considered destroyed.",
      },
      11: {
        name: "Meat and Potatoes",
        description:
          "You salvage the Mech Chassis or a System or Module of your choice mounted on it. It has the Damaged Condition. Anything else is considered destroyed.",
      },
      6: {
        name: "Bits and Pieces",
        description:
          "You salvage a System or Module of your choice mounted on the Mech. It has the Damaged Condition. Anything else is considered destroyed",
      },
      2: {
        name: "Nuts and Bolts",
        description:
          "You salvage half of the Salvage Value of the Mech Chassis in Scrap of its Tech Level, to a minimum of 1. Everything else is considered destroyed.",
      },
      1: {
        name: "Ashes and Dust",
        description:
          "The Mech is unsalvageable: its Chassis, Systems and Modules are all considered destroyed.",
      },
    },
  },

  {
    name: "NPC Reaction",
    table: {
      20: {
        name: "Actively Helpful and Friendly",
        description:
          "The NPCs are incredibly friendly and positive towards the group and will actively help them in any reasonable way they can.",
      },
      11: {
        name: "Friendly",
        description:
          "The NPCs are friendly and willing to talk, trade, and offer information to the group; however, they will still ask for their fair share in return.",
      },
      6: {
        name: "Unfriendly",
        description:
          "The NPCs react in an unfriendly manner to the group; they are difficult to talk or trade with and reluctant to offer any help to the Pilots.",
      },
      2: {
        name: "Hostile",
        description:
          "The NPCs are actively hostile to the group. They will defend their area, make motions to attack, gesture and threaten, and be unwilling to help in any way.",
      },
      1: {
        name: "Actively Hostile",
        description:
          "The NPCs will launch an attack on the group if appropriate or flee from them, barricade themselves in, and avoid contact as though they were hostile.",
      },
    },
  },

  {
    name: "NPC Action",
    table: {
      20: {
        name: "Nailed It",
        description:
          "The NPC succeeds spectacularly at their action. They get an additional bonus of the Mediator’s choice. If they are making an attack, they hit, and do double damage or get another bonus of the Mediator’s choice.",
      },
      11: {
        name: "Success",
        description:
          "The NPC achieves their action successfully. An attack hits and deals standard damage.",
      },
      6: {
        name: "Tough Choice",
        description:
          "The NPC is successful, but faces a Tough Choice. The players give the Mediator a choice between two Setbacks. In combat, a weapon attack hits, but with a choice of Setback chosen by the players.",
      },
      2: {
        name: "Failure",
        description:
          "The NPC has failed at their action. The players choose an appropriate Setback for failure. In combat, a weapon attack misses.",
      },
      1: {
        name: "Cascade Failure",
        description:
          "The NPC has catastrophically failed at their action. They suffer a Severe Setback of the player’s choice. A weapon attack misses, with a Severe Setback chosen by the players.",
      },
    },
  },

  {
    name: "NPC Moral",
    table: {
      20: {
        name: "Fight to the Death",
        description:
          "The NPCs see this one through to the end. They hunker down and will not retreat from this fight under any circumstance.",
      },
      11: {
        name: "Keep Fighting",
        description: "The NPCs continue to fight this one out for now.",
      },
      6: {
        name: "Fighting Retreat",
        description:
          "The NPCs retreat, but do so whilst continuing to fight. They will fight for one more round and then retreat.",
      },
      2: {
        name: "Retreat",
        description:
          "The NPCs flee the fight as quickly and safely as possible.",
      },
      1: {
        name: "Surrender",
        description:
          "The NPCs surrender to whoever is attacking them. If there is nobody to surrender to, they will recklessly flee.",
      },
    },
  },

  {
    name: "Retreat",
    table: {
      20: {
        name: "Perfect Escape",
        description:
          "The group makes a perfect escape from the situation to any location of their choice within the Region Map and cannot be pursued.",
      },
      11: {
        name: "Escape",
        description:
          "The group makes a safe escape from the situation to any adjacent location of their choice within the Map and cannot be pursued.",
      },
      6: {
        name: "Dangerous Escape",
        description:
          "The group escapes to any adjacent location of their choice within the Region Map, but at a cost. They must make a Tough Choice related to the situation.",
      },
      2: {
        name: "Failed Escape",
        description:
          "The group fails to retreat from the situation and are pinned down. They cannot retreat and must fight it out to the end.",
      },
      1: {
        name: "Disastrous Escape",
        description:
          "The group retreat to an adjacent location of their choice within the Region Map, but at a severe cost. They suffer a Severe Setback and may be pursued.",
      },
    },
  },

  {
    name: "Travel",
    table: {
      20: {
        name: "Discovery!",
        description: "Denotes some kind of reward or discovery.",
      },
      11: {
        name: "Safe Travel",
        description: "Denotes safe travel with perhaps a scenic note",
      },
      6: {
        name: "Travel Dilema",
        description:
          "Denotes a situation where the Pilots will need to make a difficult choice.",
      },
      2: {
        name: "You are in Danger!",
        description:
          "Denotes a situation where the Pilots are attacked or put in danger by a local threat.",
      },
      1: {
        name: "Travel Disaster!",
        description:
          "Denotes a situation where the Pilots are attacked or put in danger by a significant threat.",
      },
    },
  },
];

const parseQuote = (str) => {
  const split = str.split("`");

  return split.map((item, index) => {
    if (index % 2 !== 0) {
      return (
        <span key={item.id + "quote" + index} style={{ color: "moccasin" }}>
          {item}
        </span>
      );
    }
    return <span key={item.id + "quote" + index}>{item}</span>;
  });
};

function evaluateMath(str) {
  for (var i = 0; i < str.length; i++) {
    if (isNaN(str[i]) && !["+", "-", "/", "*", "."].includes(str[i])) {
      return NaN;
    }
  }

  try {
    return eval(str);
  } catch (e) {
    if (e.name !== "SyntaxError") throw e;
    return NaN;
  }
}

const parseAsterisk = (str) => {
  const split = str.split("*");

  return split.map((item, index) => {
    if (index % 2 !== 0) {
      return (
        <span
          key={item.id + "asterisk" + index}
          style={{ color: "red", fontSize: 11 }}
        >
          {item}
        </span>
      );
    }
    return <span key={item.id + "asterisk" + index}>{parseQuote(item)}</span>;
  });
};

const parseDetail = (str, id) => {
  if (str === undefined) return "";
  const detailSplit = str.split("\n");
  return detailSplit.map((item, index) => {
    if (item === "") return <div key={index + id}>&#8205;</div>;

    return <div key={index + id}>{parseAsterisk(item)}</div>;
  });
};

const getImage = (str) => {
  return str.substring(str.indexOf("<") + 1, str.lastIndexOf(">"));
};

const getSFX = (str) => {
  return str.substring(str.indexOf("$") + 1, str.lastIndexOf("$"));
};

function App() {
  const [text, setText] = useState("");
  const [isOBRReady, setIsOBRReady] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("PLAYER");
  const [skillData, setSkillData] = useState(null);
  const [chat, setChat] = useState([]);
  const [myChat, setMyChat] = useState([]);
  const [cookiesNotEnabled, setCookiesNotEnabled] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [player, setPlayer] = useState(null);
  const [ignoreFirstUpdate, setIgnoreFirstUpdate] = useState(false);
  const [chatToCheckChanges, setChatToCheckChanges] = useState([]);
  const [selectedTable, setSelectedTable] = useState(0);
  const [showHelper, setShowHelper] = useState(false);

  const ChatInstance = (props) => {
    let propsString = JSON.stringify(props);
    const imageURL = getImage(propsString);
    const sfxURL = getSFX(propsString);

    if (imageURL) {
      propsString = propsString.replace("<" + imageURL + ">", "");
    }

    if (sfxURL && !props.noSFX) {
      propsString = propsString.replace("$" + sfxURL + "$", " ♫ ");
    }

    useEffect(() => {
      if (index > props.chatLength - 1) {
        const audio = new Audio(sfxURL);
        audio.volume = 0.2;
        audio.play();
      }
    }, []);

    const { item, index } = JSON.parse(propsString);

    const detail = item.detail ? item.detail.trim() : "";

    if (item.skillName) {
      return (
        <div style={{ marginTop: 4 }} id={"chat_" + item.id}>
          <div className="outline">
            <div>
              {item.user} ({item.characterName})
            </div>
          </div>
          <div className="skill-detail">
            <div style={{ fontSize: 13, color: "darkorange" }}>
              {item.skillName}
            </div>
            <div style={{ color: "darkgrey" }}>{item.info}</div>
            <hr
              style={{
                marginTop: 4,
                marginBottom: 4,
                borderColor: "grey",
                backgroundColor: "grey",
                color: "grey",
              }}
            ></hr>
            {detail && (
              <div style={{ marginBottom: item.diceOneResult ? 10 : 0 }}>
                {parseDetail(detail, item.id)}
              </div>
            )}
            {imageURL && (
              <div
                style={{
                  backgroundImage: `url(${imageURL})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: 150,
                  width: 200,
                  overflow: "hidden",
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderRadius: 5,
                  marginTop: 10,
                }}
              ></div>
            )}
          </div>
        </div>
      );
    }

    if (item.roll) {
      return (
        <div style={{ marginBottom: 8 }}>
          <div className="outline">
            <div>
              {item.user} ({rollTable[item.rollTableIndex].name})
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#222",
              padding: 5,
              borderRadius: 8,
            }}
            className="outline"
          >
            <span style={{ fontSize: 12, color: "cyan" }}>{item.roll}</span>
            {item.roll === 20 && (
              <>
                <span
                  style={{ color: "yellow" }}
                  className={index > props.chatLength - 8 ? "crit-success" : ""}
                >
                  {rollTable[item.rollTableIndex].table[20].name}
                </span>
                <div
                  style={{
                    color: "lightgrey",
                    padding: 5,
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  {rollTable[item.rollTableIndex].table[20].description}
                </div>
              </>
            )}

            {item.roll >= 11 && item.roll <= 19 && (
              <>
                <span style={{ color: "lightgreen" }}>
                  {rollTable[item.rollTableIndex].table[11].name}
                </span>
                <div
                  style={{
                    color: "lightgrey",
                    padding: 5,
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  {rollTable[item.rollTableIndex].table[11].description}
                </div>
              </>
            )}

            {item.roll >= 6 && item.roll <= 10 && (
              <>
                <span style={{ color: "orange" }}>
                  {rollTable[item.rollTableIndex].table[6].name}
                </span>
                <div
                  style={{
                    color: "lightgrey",
                    padding: 5,
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  {rollTable[item.rollTableIndex].table[6].description}
                </div>
              </>
            )}

            {item.roll >= 2 && item.roll <= 5 && (
              <>
                <span style={{ color: "red" }}>
                  {rollTable[item.rollTableIndex].table[2].name}
                </span>
                <div
                  style={{
                    color: "lightgrey",
                    padding: 5,
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  {rollTable[item.rollTableIndex].table[2].description}
                </div>
              </>
            )}

            {item.roll === 1 && (
              <>
                <span
                  style={{ color: "red" }}
                  className={index > props.chatLength - 8 ? "crit" : ""}
                >
                  {rollTable[item.rollTableIndex].table[1].name}
                </span>
                <div
                  style={{
                    color: "lightgrey",
                    padding: 5,
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  {rollTable[item.rollTableIndex].table[1].description}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    if (item.message) {
      if (item.message.charAt(0) === "=") {
        const mathToEvaluate = item.message.substring(1, item.message.length);
        return (
          <div
            className="outline"
            style={{ marginTop: 4 }}
            id={"chat_" + item.id}
          >
            <div>{item.user}</div>
            <span style={{ color: "#D2691E" }}>
              {mathToEvaluate + " = " + evaluateMath(mathToEvaluate)}
            </span>
            {imageURL && (
              <div
                style={{
                  backgroundImage: `url(${imageURL})`,
                  backgroundSize: "cover",
                  height: 150,
                  width: 200,
                  overflow: "hidden",
                  borderRadius: 5,
                }}
              ></div>
            )}
          </div>
        );
      }

      if (item.user === name) {
        return (
          <div className="outline" style={{ textAlign: "right", marginTop: 4 }}>
            <div onClick={() => setToPM(item.user)}>{item.user}</div>
            <span style={{ color: item.whisper ? "violet" : "#FFF" }}>
              {item.whisper ? "*" : ""}
              {item.message}
              {item.whisperTarget ? " - " + item.whisperTarget : ""}
              {item.whisper ? "*" : ""}
            </span>
            {imageURL && (
              <div
                style={{
                  backgroundImage: `url(${imageURL})`,
                  backgroundSize: "cover",
                  height: 150,
                  width: 200,
                  overflow: "hidden",
                  borderRadius: 5,
                  marginLeft: "auto",
                }}
              ></div>
            )}
          </div>
        );
      }

      return (
        <div
          className="outline"
          style={{ marginTop: 4 }}
          id={"chat_" + item.id}
        >
          <div>{item.user}</div>
          <span style={{ color: "#FFF" }}>{item.message}</span>
          {imageURL && (
            <div
              style={{
                backgroundImage: `url(${imageURL})`,
                backgroundSize: "cover",
                height: 150,
                width: 200,
                overflow: "hidden",
                borderRadius: 5,
              }}
            ></div>
          )}
        </div>
      );
    } else {
      if (imageURL) {
        return (
          <div
            className="outline"
            style={{ marginTop: 4 }}
            id={"chat_" + item.id}
          >
            <div>{item.user}</div>
            {imageURL && (
              <div
                style={{
                  backgroundImage: `url(${imageURL})`,
                  backgroundSize: "cover",
                  height: 150,
                  width: 200,
                  overflow: "hidden",
                  borderRadius: 5,
                }}
              ></div>
            )}
          </div>
        );
      }

      return "";
    }
  };

  useEffect(() => {
    OBR.onReady(async () => {
      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          const metadata = await OBR.scene.getMetadata();
          if (metadata["salvage.union.extension/metadata"]) {
            setMetadata(metadata["salvage.union.extension/metadata"]);
          }

          if (metadata["salvage.union.extension/metadata"]) {
            const currentChat = await createChatArray(metadata);
            setChatToCheckChanges(currentChat);
          }

          setIsOBRReady(true);
          setTimeout(() => {
            var objDiv = document.getElementById("chatbox");
            if (objDiv) {
              objDiv.scrollTop = objDiv.scrollHeight;
            }
          }, 100);

          OBR.action.setBadgeBackgroundColor("orange");
          setName(await OBR.player.getName());
          setId(await OBR.player.getId());

          OBR.player.onChange(async (player) => {
            setName(await OBR.player.getName());
          });

          setRole(await OBR.player.getRole());
        } else {
          setIsOBRReady(false);
          setMetadata(false);
          setPlayer(null);
          setChat([]);
        }
      });

      if (await OBR.scene.isReady()) {
        const metadata = await OBR.scene.getMetadata();
        if (metadata["salvage.union.extension/metadata"]) {
          setMetadata(metadata["salvage.union.extension/metadata"]);
        }

        if (metadata["salvage.union.extension/metadata"]) {
          const currentChat = await createChatArray(metadata);
          setChatToCheckChanges(currentChat);
        }

        setIsOBRReady(true);
        setTimeout(() => {
          var objDiv = document.getElementById("chatbox");
          if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
          }
        }, 100);

        OBR.action.setBadgeBackgroundColor("orange");
        setName(await OBR.player.getName());
        setId(await OBR.player.getId());

        OBR.player.onChange(async (player) => {
          setName(await OBR.player.getName());
        });

        setRole(await OBR.player.getRole());
      }
    });

    try {
      localStorage.getItem("salvage.union.extension/rolldata");
    } catch {
      setCookiesNotEnabled(true);
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addMessage();
    }
  };

  const createChatArray = async (metadata) => {
    const metadataGet = metadata["salvage.union.extension/metadata"];
    let messages = [];
    const keys = Object.keys(metadataGet);

    const playerId = await OBR.player.getId();
    setId(playerId);

    keys.forEach((key) => {
      messages = messages.concat(metadataGet[key]);
      if (key === playerId) {
        setMyChat(metadataGet[key]);
      }
    });

    return messages.sort((a, b) => a.id - b.id);
  };

  const checkForSkills = async (metadata) => {
    const skillData = metadata["salvage.union.character/sendskill"];
    setSkillData(skillData);
  };

  useEffect(() => {
    if (skillData) {
      if (skillData.userId === id) {
        const localSkillData = JSON.parse(
          localStorage.getItem("salvage.union.extension/skilldata")
        );

        if (localSkillData) {
          if (localSkillData.id !== skillData.id) {
            addSkillMessage(skillData);
          }
        } else {
          addSkillMessage(skillData);
        }
        localStorage.setItem(
          "salvage.union.extension/skilldata",
          JSON.stringify(skillData)
        );
      }
    }
  }, [skillData]);

  useEffect(() => {
    if (chatToCheckChanges.length !== chat.length) {
      setChat(chatToCheckChanges);
      setTimeout(() => {
        var objDiv = document.getElementById("chatbox");
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 100);
    }
  }, [chatToCheckChanges]);

  useEffect(() => {
    if (player && !ignoreFirstUpdate) {
      if (metadata[player.id]) {
        if (metadata[player.id].lastEdit !== id + "-chat") {
          setPlayer(metadata[player.id]);
        }
      }
    }
    if (ignoreFirstUpdate) {
      setIgnoreFirstUpdate(false);
    }
  }, [metadata]);

  useEffect(() => {
    if (isOBRReady) {
      OBR.scene.onMetadataChange(async (metadata) => {
        const currentChat = await createChatArray(metadata);
        setChatToCheckChanges(currentChat);
      });

      OBR.room.onMetadataChange(async (metadata) => {
        checkForSkills(metadata);
      });

      OBR.action.onOpenChange(async (isOpen) => {
        // React to the action opening or closing
        if (isOpen) {
          setUnreadCount(0);
          OBR.action.setBadgeText(undefined);
        }
      });

      try {
        localStorage.getItem("salvage.union.extension/rolldata");
      } catch {
        setCookiesNotEnabled(true);
        return;
      }
    }
  }, [isOBRReady]);

  useEffect(() => {
    const updateMessages = async () => {
      const lastMessage = chat[chat.length - 1];

      const isOpen = await OBR.action.isOpen();

      if (lastMessage && isOBRReady && !isOpen) {
        if (isOBRReady) {
          const isOpen = await OBR.action.isOpen();
          if (!isOpen) {
            if (role === "GM") {
              setUnreadCount(unreadCount + 1);
              OBR.action.setBadgeText("" + (unreadCount + 1));
            }
          }
        }
      }
    };

    if (isOBRReady) {
      updateMessages();
    }
  }, [chat]);

  const clearChat = async () => {
    const metadataGet = await OBR.scene.getMetadata();
    const metadata = metadataGet["salvage.union.extension/metadata"];
    const keys = Object.keys(metadata);

    let clearedMetaData = { ...metadata };

    keys.forEach((key) => {
      clearedMetaData[key] = [];
    });

    OBR.scene.setMetadata({
      "salvage.union.extension/metadata": clearedMetaData,
    });
  };

  const addMessage = async () => {
    if (text !== "") {
      if (role === "GM") {
        if (text === "/clearchat") {
          clearChat();
          setText("");
          return;
        }
      }

      const newMessage = {
        id: new Date().getTime(),
        user: name,
        message: text.trim(),
      };
      const newChat = [...myChat, newMessage];

      const metadataGet = await OBR.scene.getMetadata();
      const metadata = metadataGet["salvage.union.extension/metadata"];

      let metadataChange = { ...metadata };

      if (newChat.length > chatLimit) {
        newChat.splice(0, 2);
      }

      metadataChange[id] = newChat;

      OBR.scene.setMetadata({
        "salvage.union.extension/metadata": metadataChange,
      });

      setText("");

      setTimeout(() => {
        var objDiv = document.getElementById("chatbox");
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 100);
    }
  };

  const addSkillMessage = async (skill) => {
    const newMessage = {
      id: new Date().getTime(),
      user: name,
      skillName: skill.skillName,
      characterName: skill.characterName,
      info: skill.info,
      detail: skill.detail,
    };
    const newChat = [...myChat, newMessage];

    const metadataGet = await OBR.scene.getMetadata();
    const metadata = metadataGet["salvage.union.extension/metadata"];

    let metadataChange = { ...metadata };

    if (newChat.length > chatLimit) {
      newChat.splice(0, 2);
    }

    metadataChange[id] = newChat;

    OBR.scene.setMetadata({
      "salvage.union.extension/metadata": metadataChange,
    });

    setTimeout(() => {
      var objDiv = document.getElementById("chatbox");
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }, 100);
  };

  const addRoll = async (roll, rollTableIndex) => {
    const newMessage = {
      id: new Date().getTime(),
      user: name,
      roll: roll,
      rollTableIndex: rollTableIndex,
    };
    const newChat = [...myChat, newMessage];

    const metadataGet = await OBR.scene.getMetadata();
    const metadata = metadataGet["salvage.union.extension/metadata"];

    let metadataChange = { ...metadata };

    if (newChat.length > chatLimit) {
      newChat.splice(0, 2);
    }

    metadataChange[id] = newChat;

    OBR.scene.setMetadata({
      "salvage.union.extension/metadata": metadataChange,
    });

    setTimeout(() => {
      var objDiv = document.getElementById("chatbox");
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (!showHelper) {
      setTimeout(() => {
        var objDiv = document.getElementById("chatbox");
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 100);
    }
  }, [showHelper]);

  if (cookiesNotEnabled) {
    return (
      <div
        style={{
          background: "#444",
          height: 540,
          width: 400,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            paddingLeft: 25,
            paddingRight: 20,
            paddingTop: 40,
          }}
        >
          <div className="outline" style={{ color: "red", font: 14 }}>
            Error:
          </div>
          <div className="outline" style={{ fontSize: 14 }}>
            You need to enable 3rd Party cookies for this extention to work.
            This is because some chat data is stored in the browser localstorage
            that enables to cache some user data and settings.
          </div>
        </div>
      </div>
    );
  }

  if (!isOBRReady) {
    return (
      <div
        style={{
          background: "#444",
          height: 540,
          width: 400,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            paddingLeft: 25,
            paddingRight: 20,
            paddingTop: 40,
          }}
        >
          <div className="outline" style={{ color: "red", font: 14 }}>
            No Scene found.
          </div>
          <div className="outline" style={{ fontSize: 14 }}>
            You need to load a scene to enable the chat and dice roller. If a
            scene is already loaded, kindly refresh the page.
          </div>
        </div>
      </div>
    );
  }

  const generateRandomNumber = (end) => {
    var range = end;
    var randomNum = Math.floor(Math.random() * range) + 1;

    return randomNum;
  };

  const renderDice = () => {
    return (
      <div
        style={{
          marginBottom: 10,
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="outline" style={{ fontSize: 14, color: "lightgrey" }}>
          Salvage Union
        </div>
        <button
          className="button"
          style={{
            marginRight: 4,
            width: 60,
          }}
          onClick={() => {
            setShowHelper(!showHelper);
          }}
        >
          {!showHelper ? "Chat" : "Setbacks"}
        </button>
        <select
          style={{
            backgroundColor: "#333",
            color: "white",
            fontSize: 10,
            padding: 1,
            borderRadius: 3,
            border: "1px solid #222",
            marginRight: 4,
          }}
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value);
          }}
        >
          {rollTable.map((item, index) => {
            return <option value={index}>{item.name}</option>;
          })}
        </select>

        <button
          className="button"
          style={{ marginRight: 4, width: 100, color: "orange" }}
          onClick={() => {
            addRoll(generateRandomNumber(20), selectedTable);
          }}
        >
          Roll D20
        </button>
      </div>
    );
  };

  const renderSetbacks = () => {
    return (
      <div
        className="outline"
        style={{
          fontSize: 10,
          flexDirection: "column",
          background: "#222",
          padding: 5,
          borderRadius: 8,
          color: "lightgrey",
        }}
      >
        <div style={{ color: "orange", fontSize: 12 }}>Tough Choices</div>
        <div>
          • The player or NPC deals half damage on an attack or takes 2 SP or 2
          HP damage
        </div>
        <div>• Their action succeeds, but they gain 2 Heat</div>
        <div>• You hit, but damage a System or Module on your Mech.</div>
        <div>• You deal half damage or hurt yourself.</div>
        <div>• You hit, but an enemy gets a free attack against you.</div>
        <div>• You hit, but activate the downside of your weapon.</div>
        <div>• You hit, but gain additional Heat.</div>
        <div>• You succeed in your task, but must expend additional EP.</div>
        <div>• You hit, but must make a Heat Check.</div>
        <div>• You betray a friend or make an enemy.</div>
        <div>
          • Save a wastelander from dying or get to a desti- nation faster.
        </div>
        <div>• Save one wastelander from death, but not the other.</div>
        <div>• You salvage something powerful, but activate its downside.</div>
        <hr />
        <div style={{ color: "orange", fontSize: 12 }}>They are hurt.</div>
        <div>• They take damage (2 SP/2 HP by Default)</div>
        <div>• An NPC attacks them.</div>
        <div>
          • They must roll on the Critical Damage or Critical Injury Table.
        </div>
        <div>• A System or Module is damaged or destroyed.</div>
        <div>• A Pilot suffers a Minor or Major Injury.</div>
        <div>• They gain Heat and must roll on the Reactor Overload Table.</div>
        <div>• They must roll on the Reactor Overload Table.</div>
        <div>• Their weapon’s Trait is used against them.</div>
        <hr></hr>
        <div style={{ color: "orange", fontSize: 12 }}>
          Their reputation or standing is harmed.
        </div>
        <div>• They offend someone important.</div>
        <div>
          • They break a law, code, or unwritten rule and become targets for
          retributive justice.
        </div>
        <div>• They are cast out of a community.</div>
        <div>• A bounty is put on their heads.</div>
        <div>• They lose an ally.</div>
        <div>
          • Something from a Pilot’s background comes back to haunt them.
        </div>
        <hr></hr>
        <div style={{ color: "orange", fontSize: 12 }}>
          They lose something.
        </div>
        <div>• Something important is stolen.</div>
        <div>• Their ballistic weapon jams or runs out of ammo.</div>
        <div>
          • Their items or weapons are less effective than they should be.
        </div>
        <div>• A trader demands a costly deal.</div>
        <hr></hr>
        <div style={{ color: "orange", fontSize: 12 }}>
          Their environment shifts.
        </div>
        <div>• A sudden radiation storm makes a journey difficult.</div>
        <div>• Acid rain causes them to seek shelter.</div>
        <div>• A disease begins to spread.</div>
        <div>• The path is blocked by debris.</div>
        <div>• An enemy suddenly flanks them.</div>
        <hr></hr>
        <div style={{ color: "orange", fontSize: 12 }}>
          Their enemies advance.
        </div>
        <div>• A faction gains power.</div>
        <div>
          • A new enemy reinforcement suddenly joins the fight they are in.
        </div>
        <div>• An Ally loses territory or resources.</div>
        <div>• A settlement is taken over by a foe.</div>
        <div>• A group is waiting to ambush the Pilots.</div>
        <div>• A faction captures something powerful.</div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: "#444",
        height: 540,
        width: 400,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          height: "100%",
        }}
      >
        {renderDice()}
        <div
          id="chatbox"
          className="scrollable-container"
          style={{
            backgroundColor: "#333",
            padding: 10,
            overflow: "scroll",
            height: 420,
            border: "1px solid #222",
          }}
        >
          {showHelper
            ? renderSetbacks()
            : chat.length
            ? chat
                .sort((a, b) => a.id - b.id)
                .map((item, index) => (
                  <ChatInstance
                    key={item.id}
                    item={item}
                    index={index}
                    name={name}
                    role={role}
                    chatLength={chat.length}
                  />
                ))
            : ""}
        </div>
        <div style={{ marginTop: 5, display: "flex", alignItems: "center" }}>
          <input
            id="chatbox"
            style={{
              color: "#FFF",
              width: 450,
              height: 24,
              marginRight: 0,
              paddingLeft: 4,
              backgroundColor: "#333",
              fontSize: 12,
              border: "1px solid #222",
              outline: "none",
            }}
            role="presentation"
            autoComplete="off"
            value={text}
            onChange={(evt) => {
              setText(evt.target.value);
            }}
            onKeyDown={handleKeyDown}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default App;
