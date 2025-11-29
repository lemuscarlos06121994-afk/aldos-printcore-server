// Simple CloudPRNT-style server for Aldo's
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para poder recibir peticiones desde GitHub Pages
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aquí guardamos el último ticket enviado por la app
let lastTicket = null;

// 1) Home — solo para comprobar que el servidor está vivo
app.get("/", (req, res) => {
  res.send("✅ Aldo's CloudPRNT basic server is running.");
});

// 2) Status endpoint — la impresora pregunta si hay trabajo
app.get("/cloudprnt/status", (req, res) => {
  res.json({
    ok: true,
    readyToPrint: !!lastTicket,
    message: lastTicket ? "Job waiting." : "Server online, no jobs in queue yet."
  });
});

// 3) Printer asks for the job here
app.get("/cloudprnt/job", (req, res) => {
  if (!lastTicket) {
    return res.json({ jobReady: false });
  }

  const job = {
    jobReady: true,
    job: Buffer.from(lastTicket).toString("base64"), // ESC/POS ticket as base64
    type: "escpos"
  };

  // Limpiamos el ticket después de entregarlo
  lastTicket = null;

  res.json(job);
});

// 4) Kiosk app sends order here (desde app.js)
app.post("/submit", (req, res) => {
  const { ticket } = req.body;

  if (!ticket) {
    return res.status(400).json({ error: "Missing ticket" });
  }

  console.log("🧾 New ticket received from kiosk:");
  console.log(ticket);

  // Guardamos el ticket en memoria; la impresora lo recogerá en /cloudprnt/job
  lastTicket = ticket;

  res.json({ ok: true });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Aldo's CloudPRNT server listening on port ${PORT}`);
});
