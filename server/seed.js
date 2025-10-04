import sqlite3 from "sqlite3";
import { open } from "sqlite";

const seed = async () => {
  const db = await open({ filename: "./parish.db", driver: sqlite3.Database });
  await db.exec("PRAGMA foreign_keys = ON;");
  await db.run("DELETE FROM parishioners");
  await db.run("DELETE FROM parishes");
  const p1 = await db.run("INSERT INTO parishes(name,city,phone) VALUES(?,?,?)", ["St. Joseph", "Charlotte", "704-000-0000"]);
  const p2 = await db.run("INSERT INTO parishes(name,city,phone) VALUES(?,?,?)", ["St. Mary", "Concord", "704-111-1111"]);
  await db.run("INSERT INTO parishioners(parish_id,name,email,role) VALUES(?,?,?,?)",
    [p1.lastID,"Alice Brown","alice@example.com","Volunteer"]);
  await db.run("INSERT INTO parishioners(parish_id,name,email,role) VALUES(?,?,?,?)",
    [p1.lastID,"John Lee","john@example.com","Member"]);
  await db.run("INSERT INTO parishioners(parish_id,name,email,role) VALUES(?,?,?,?)",
    [p2.lastID,"Kevin Shah","kevin@example.com","Staff"]);
  console.log("Seeded sample data.");
  await db.close();
};

seed();
