

module.exports = function (RED) {
  function readCard(config) {
    RED.nodes.createNode(this, config);
    this.status({ fill: "blue", shape: "ring", text: "Starting..." });
    
    const { NFC } = require("nfc-pcsc");
    const nfc = new NFC();
    
    nfc.on("reader", (reader) => {
      this.status({ fill: "green", shape: "dot", text: reader.reader.name });
      reader.on("card", (card) => {
        console.log(`${reader.reader.name}  card detected`, card);
        this.status({ fill: "green", shape: "dot", text: "Card detected" });
        let msg = {};
        msg.payload = {};
        msg.payload.card = card;
        msg.payload.action = 'detected';
        this.send(msg);
      });
      reader.on("card.off", (card) => {
        console.log(`${reader.reader.name}  card removed`, card);
        this.status({ fill: "green", shape: "dot", text: "Card gone" });
        let msg = {};
        msg.payload = {};
        msg.payload.card = card;
        msg.payload.action = 'removed';
        this.send(msg);
      });
      reader.on("error", (err) => {
        console.log(`${reader.reader.name}  an error occurred`, err);
        this.status({ fill: "red", shape: "dot", text: "error" });
      });
      reader.on("end", () => {
        console.log(`${reader.reader.name}  device removed`);
        this.status({
          fill: "grey",
          shape: "dot",
          text: "Device disconnected",
        });
      });
    });

    nfc.on("error", (err) => {
      console.log("an error occurred", err);
      this.status({ fill: "red", shape: "dot", text: "error" });
    });
  }
  RED.nodes.registerType("read-card", readCard);
};


