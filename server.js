// ==============================
// Aldo's CloudPRNT Basic Server
// ==============================

const express = require("express");
const app = express();

// Render asigna PORT automáticamente
const PORT = process.env.PORT || 10000;

// Último ticket enviado desde el kiosco
let lastTicket = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================================
// 1) Home — para probar que el server vive
// =======================================
app.get("/", (req, res) => {
  res.send("✔ Aldo’s CloudPRNT server is running.");
});

// =======================================
// 2) Printer Status — La impresora pregunta aquí
// =======================================
app.get("/cloudprnt/status", (req, res) => {
  const ready = lastTicket ? true : false;

  res.json({
    ok: true,
    readyToPrint: ready,
    message: ready ? "Job ready" : "No jobs pending"
  });
});

// =======================================
// 3) Printer asks for the job here
// =======================================
app.get("/cloudprnt/job", (req, res) => {
  if (!lastTicket) {
    return res.json({ jobReady: false });
  }

  const job = {
    jobReady: true,
    job: Buffer.from(lastTicket).toString("base64"),
    type: "escpos"
  };

  lastTicket = null; // Elimina el job después de entregarlo

  res.json(job);
});

// =======================================
// 4) Kiosk app sends order here
// =======================================
app.post("/submit", (req, res) => {
  const { ticket } = req.body;

  if (!ticket) {
    return res.status(400).json({ error: "Missing ticket" });
  }

  lastTicket = ticket;
  res.json({ ok: true, message: "Ticket stored for printer." });
});

// =======================================
// Start server
// =======================================
app.listen(PORT, () => {
  console.log("🚀 Aldo’s CloudPRNT Server running on", PORT);
});
