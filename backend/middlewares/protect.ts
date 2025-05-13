import express from 'express'
import asyncHandler from './asyncHandler'
import { UserRequest } from '../Utils/Types/user.types'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import pool from '../database/db.config'

dotenv.config()
export const protect = asyncHandler(async(req:UserRequest, res, next) => {
    let token:string|undefined;

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]
    }

    if (!token && req.cookies.access_token) {
        token = req.cookies.access_token
    }

    if (!token) {
        return res.status(401).json({
            message: "Not Authorized, no token"
        })
    }

    try {
        const secret = process.env['ACCESS_TOKEN_SECRET']
        if (!secret) {
            throw new Error("JWT SECRET NOT SET in environment")
        }

        //Token Verification
        const decoded = jwt.verify(token, secret) as { id: number, role: string }
        console.log('[DEBUG] Decoded JWT:', decoded)

        //Finding User in db
        const user = await pool.query("SELECT id, name, role, department, email from users");

        if(!user) {
            return res.status(401).json("Not Authorized: User not found");
        }

        //Debug 
        console.log(user)
        //Attaching user to the request and continue
        req.user = user.rows[0];
        next()

    } catch(error) {
        console.error("[ERROR] JWT verification failed:", error);
        res.status(401).json({ message: "Not authorized: Invalid or expired token" });
    }
})