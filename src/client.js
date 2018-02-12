import moment from "moment";
import * as Primus from "primus";

export default class Client {

  constructor() {
    const Socket = Primus.createSocket({
      transformer: "engine.io",
      plugin: "primus-emit"
    });
    this.socket = new Socket("http://localhost:2121");

    this.events();
  }

  events() {
    this.socket.on("open", () => {
      this.log("Connection opened !");
    });

    this.socket.on("error", (error) => {
      this.log(`Error : ${error.message}`);
    });

    this.socket.on("data", (data) => {
      this.log(`Data : ${JSON.stringify(data)}`);
    });

    this.socket.on("error", (err) => {
      console.error("[" + moment().format("LTS") + "][GameClient] Something horrible has happened", err.stack);
    });

    this.socket.on("reconnect", (opts) => {
      this.log("Reconnection attempt started");
    });

    this.socket.on("reconnect scheduled", (opts) => {
      this.log(`Reconnecting in ${opts.scheduled} ms`);
      this.log(`This is attempt ${opts.attempt} out of ${opts.retries}`);
    });

    this.socket.on("reconnected", (opts) => {
      this.log(`It took ${opts.duration} ms to reconnect`);
    });

    this.socket.on("reconnect timeout", (err, opts) => {
      this.log(`Timeout expired: ${err.message}`);
    });

    this.socket.on("reconnect failed", (err, opts) => {
      this.log(`The reconnection failed: ${err.message}`);
    });

    this.socket.on("timeout", () => {
      this.log("Connection timeout");
    });

    this.socket.on("online", () => {
      this.log("Connection goes online");
    });

    this.socket.on("readyStateChange", (state) => {
      this.log(`Connection readyStateChange: ${state}`);
    });

    this.socket.on("offline", () => {
      this.log("Connection goes offline");
    });

    this.socket.on("end", () => {
      this.log("Connection ended");
    });

    this.socket.on("close", () => {
      this.log("Connection closed");
    });

    this.socket.on("destroy", () => {
      this.log("Connection destroyed");
    });

    this.socket.on("test", (data) => {
      this.log(JSON.stringify(data));
      this.emit("testok", "Good!");
    });
  }

  log(message) {
    console.log(`[${moment().format("LTS")}][CLIENT] ${message}`);
  }

  send(data) {
    this.socket.write(data);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  start() {
    this.socket.open()
  }

  stop() {
    this.socket.end()
  }
}