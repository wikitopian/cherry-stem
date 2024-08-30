import fs from "fs";
import { DatabaseSync } from "node:sqlite";

export default class CherryStemDatabase {
  constructor(folder, file) {
    const sql = new DatabaseSync(file);

    const files = fs.readdirSync(folder);
    const code = files.map((f) => fs.readFileSync(folder + f, "utf8")).join("");

    const txs = this.getTransactions(code);
    for (const { groups } of txs)
      this[groups.name] = () => sql.exec(groups.sql);

    this.createTables();

    const stmts = this.getStatements(code);
    for (const { groups } of stmts) this[groups.name] = sql.prepare(groups.sql);
  }

  getTransactions(code) {
    const txs = /-- TX: (?<tx>(?<name>\w+)\n(?<sql>.*?END TRANSACTION;))/gs;
    return code.matchAll(txs);
  }

  getStatements(code) {
    const stmts = /-- PREPARE: (?<stmt>(?<name>\w+)\n(?<sql>.*?;))/gs;
    return code.matchAll(stmts);
  }
}
