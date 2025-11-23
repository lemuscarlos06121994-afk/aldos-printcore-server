// Simple CloudPRNT-style server for Aldo's
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home – just to comprobar que el servidor está vivo
app.get("/", (req, res) => {
  res.send("✅ Aldo's CloudPRNT basic server is running.");
});

// Status endpoint – la impresora puede preguntar si hay trabajo
app.get("/cloudprnt/status", (req, res) => {
  // Más adelante aquí vamos a decir si hay tickets en cola
  res.json({
    ok: true,
    readyToPrint: false,
    message: "Server online, no jobs in queue yet."
  });
});

// Job endpoint – aquí la impresora pediría el ticket
app.get("/cloudprnt/job", (req, res) => {
  // De momento, no mandamos nada a imprimir
  res.json({
    hasJob: false,
    contentType: "text/plain",
    content: "",
    message: "No jobs yet."
  });
});

// Endpoint para que tu app web mande órdenes (luego lo conectamos)
app.post("/api/orders", (req, res) => {
  console.log("🧾 New order received from kiosk:", req.body);
  // Aquí después guardaremos la orden y la pondremos en la cola de impresión
  res.json({ ok: true, message: "Order received (demo mode)." });
});

app.listen(PORT, () => {
  console.log(`🚀 Aldo's CloudPRNT server listening on port ${PORT}`);
});
