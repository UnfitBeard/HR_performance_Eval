import express from 'express'
import dotenv from 'dotenv'
import pool from './database/db.config'
import { Request, Response } from 'express'
import authRoutes from './routes/auth.routes'

const app = express()
app.use(express.json())

//routes
app.use("/", authRoutes)

const startServer = async () => {
  try {
    await pool.connect();
    console.log("Successfully connected to the database");

    app.listen(3000, () => {
      console.log("server listening on port 3000");
    });

  } catch (error) {
    console.log("Error connecting to the database", error);
  }
};

startServer()
