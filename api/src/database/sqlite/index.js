const sqlite3 = require("sqlite3"); // Drive responsável por estabelecer comunicação com BD
const sqlite = require("sqlite"); // Responsável por conectar
const path = require("path");

async function sqliteConnection() {
  const database = await sqlite.open(
    {
      filename: path.resolve(__dirname, "..", "database.db"),
      driver: sqlite3.Database
    }
  );

  return database;
}
module.exports = sqliteConnection;