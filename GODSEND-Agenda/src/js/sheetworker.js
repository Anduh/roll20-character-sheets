
//current sheet version
const currentversion = "1.3.0";

const int = score => parseInt(score, 10) || 0;

// tabs

const buttonlist = ["character","background","npc","settings"];
buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        setAttrs({
            sheetTab: button
        });
    });
});

on("sheet:opened", function() {

  getAttrs(["npc", "sheetTab"], values => {

    let npc = int(values["npc"]);
    let sheetTab = values["sheetTab"];
    console.log("sheetTab: ", sheetTab);
    //let page = "character";

    if (sheetTab === "character"){
      npc = 0;
      console.log("sheetTab was char, set NPC=0: ", npc);
    }
    else if (sheetTab === "npc"){
      npc = 1;
      console.log("sheetTab was npc, set NPC=1: ", npc);
    }
    else if (sheetTab === "background"){
      console.log("sheetTab was note");
    }
    else if (sheetTab === "settings"){
      console.log("sheetTab was settings");
    }
    setAttrs({
        npc: npc
    });
  });
});
