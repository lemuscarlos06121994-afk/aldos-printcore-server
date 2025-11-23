# Aldo's PrintCore Server

Basic Node.js server for Aldo's kiosk, prepared for Star CloudPRNT.

## Endpoints

- `GET /` – Health check, returns a simple text.
- `GET /cloudprnt/status` – Printer checks if the server is online and ready.
- `GET /cloudprnt/job` – Printer asks if there is a ticket to print.
- `POST /api/orders` – The kiosk app will send orders here in the future.

This project is built to run on **Render.com** as a Web Service.
