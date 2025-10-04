import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({ filename: "./parish.db", driver: sqlite3.Database });
  await db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS parishes(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT,
      phone TEXT
    );
    CREATE TABLE IF NOT EXISTS parishioners(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parish_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Member','Volunteer','Staff')),
      FOREIGN KEY(parish_id) REFERENCES parishes(id) ON DELETE CASCADE
    );
  `);
})();

const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Parishes
app.get("/api/parishes", async (_req, res) => {
  const rows = await db.all("SELECT * FROM parishes ORDER BY name");
  res.json(rows);
});
app.post("/api/parishes", async (req, res) => {
  const { name, city, phone } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const r = await db.run("INSERT INTO parishes(name,city,phone) VALUES(?,?,?)", [name, city || "", phone || ""]);
  res.status(201).json({ id: r.lastID, name, city: city || "", phone: phone || "" });
});
app.put("/api/parishes/:id", async (req, res) => {
  const { name, city, phone } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  await db.run("UPDATE parishes SET name=?, city=?, phone=? WHERE id=?", [name, city || "", phone || "", req.params.id]);
  res.json({ ok: true });
});
app.delete("/api/parishes/:id", async (req, res) => {
  await db.run("DELETE FROM parishes WHERE id=?", [req.params.id]);
  res.status(204).end();
});

// Parishioners
app.get("/api/parishes/:id/parishioners", async (req, res) => {
  const { id } = req.params;
  const { search = "", role = "" } = req.query;
  const params = [id];
  let sql = "SELECT * FROM parishioners WHERE parish_id=?";
  if (search) {
    sql += " AND (name LIKE ? OR email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (role) {
    sql += " AND role=?";
    params.push(role);
  }
  sql += " ORDER BY name";
  const rows = await db.all(sql, params);
  res.json(rows);
});
app.post("/api/parishes/:id/parishioners", async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  if (!name || !email || !role) return res.status(400).json({ error: "name, email, role required" });
  if (!isEmail(email)) return res.status(400).json({ error: "invalid email" });
  if (!["Member","Volunteer","Staff"].includes(role)) return res.status(400).json({ error: "invalid role" });
  const r = await db.run(
    "INSERT INTO parishioners(parish_id,name,email,role) VALUES(?,?,?,?)",
    [id, name, email, role]
  );
  res.status(201).json({ id: r.lastID, parish_id: Number(id), name, email, role });
});
app.put("/api/parishioners/:pid", async (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) return res.status(400).json({ error: "name, email, role required" });
  if (!isEmail(email)) return res.status(400).json({ error: "invalid email" });
  await db.run("UPDATE parishioners SET name=?, email=?, role=? WHERE id=?", [name, email, role, req.params.pid]);
  res.json({ ok: true });
});
app.delete("/api/parishioners/:pid", async (req, res) => {
  await db.run("DELETE FROM parishioners WHERE id=?", [req.params.pid]);
  res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("API running on http://localhost:" + PORT));
