import fs from "fs";
import { DatabaseSync } from "node:sqlite";

export default class CherryStemDatabase {
  constructor(folder, file) {
    const sql = new DatabaseSync(file);

    const files = fs.readdirSync(folder);
    const code = files.map((f) => fs.readFileSync(folder + f, "utf8")).join("");

    const txs = this.getTransactions(code);
    for (const { groups: tx } of txs) this[tx.name] = () => sql.exec(tx.sql);

    this.createTables();

    const sts = this.getStatements(code);
    for (const { groups: st } of sts) this[st.name] = sql.prepare(st.sql);
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
