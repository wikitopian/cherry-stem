import "dotenv/config";

import Sql from "./CherryStemDatabase.mjs";
import Web from "./CherryStemServer.mjs";
import Skt from "./CherryStemSocket.mjs";

export default class {
  constructor() {
    const sqlFolder = "./sql/";
    const sqlFile = process.env.CS_SQL_FILE ?? "../cherryStem.sqlite3";
    const port = process.env.CS_PORT ?? 3000;
    const refreshRate = process.env.CS_REFRESH_RATE ?? 10000;

    this.sql = new Sql(sqlFolder, sqlFile);
    this.web = new Web(port, refreshRate);
    this.skt = new Skt(this.sql, this.web.getServer());
  }
}
