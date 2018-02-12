import moment from "moment";
import * as Primus from "primus";

export default class Server {
  constructor() {
    this.primus = Primus.createServer((spark) => {
      this.log("Connected", spark.id);

      spark.emit("test", { test: 21 });

      spark.on("testok", (data) => {
        this.log(data, spark.id);
        this.send("ok");
      });

      spark.on("data", (data) => {
        this.log(`Data : ${JSON.stringify(data)}`, spark.id);
      });

      spark.on("error", (error) => {
        this.log(`Error : ${error.message}`, spark.id);
      });

      spark.on("readyStateChange", (state) => {
        this.log(`Connection readyStateChange: ${state}`);
      });

      spark.on("heartbeat", () => {
        this.log("We've received a response to a heartbeat.", spark.id);
      });

      spark.on("end", () => {
        this.log("Disconnected", spark.id);
      });
    }, {
      port: 2121,
      transformer: "engine.io",
      plugin: "primus-emit"
    });

    this.events();
  }

  send(data) {
    this.primus.write(data);
  }

  log(message, sparkId) {
    if (sparkId) {
      console.log(`[${moment().format("LTS")}][SERVER][${sparkId}] ${message}`);
    } else {
      console.log(`[${moment().format("LTS")}][SERVER] ${message}`);
    }
  }

  events() {
    this.primus.on("initialised", () => {
      this.log("Initialised");
    });

    this.primus.on("connection", () => {
      this.log("New connection");
    });

    this.primus.on("disconnection", () => {
      this.log("disconnection");
    });

    this.primus.on("close", () => {
      this.log("Closed");
    });

    this.primus.on("plugin", () => {
      this.log("A new plugin has been added.");
    });

    this.primus.on("plugout", () => {
      this.log("A plugin has been removed.");
    });
  }
}
