import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import pkg from "pg"

const { Pool } = pkg

const app = express()

// CORS: allow frontend origin
const ORIGIN = process.env.CORS_ORIGIN || "*"
app.use(cors({ origin: ORIGIN }))

app.use(express.json())
app.use(morgan("dev"))

// Postgres connection via DATABASE_URL or discrete vars
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
})

// const pool = new Pool({
//   host: process.env.PGHOST,
//   port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
//   ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
// });


// Ensure table exists on boot
async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ideas (
      id SERIAL PRIMARY KEY,
      text VARCHAR(280) NOT NULL,
      votes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
}
ensureSchema().catch((e) => {
  console.error("[schema] failed", e)
  process.exit(1)
})

app.get("/health", (req, res) => res.json({ ok: true }))

app.get("/ideas", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ideas ORDER BY votes DESC, created_at DESC LIMIT 200")
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch ideas" })
  }
})

app.post("/ideas", async (req, res) => {
  try {
    const text = (req.body?.text || "").toString().slice(0, 280).trim()
    if (!text) return res.status(400).json({ error: "Text is required" })
    const { rows } = await pool.query("INSERT INTO ideas(text) VALUES($1) RETURNING *", [text])
    res.status(201).json(rows[0])
  } catch (e) {
    res.status(500).json({ error: "Failed to add idea" })
  }
})

app.post("/ideas/:id/upvote", async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" })
    const { rows } = await pool.query("UPDATE ideas SET votes = votes + 1 WHERE id = $1 RETURNING *", [id])
    if (!rows[0]) return res.status(404).json({ error: "Not found" })
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: "Failed to upvote idea" })
  }
})

const PORT = Number(process.env.PORT || 4000)
app.listen(PORT, () => {
  console.log(`[backend] listening on ${PORT}`)
})
