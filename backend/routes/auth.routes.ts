import pool from '../database/db.config';
import { asyncHandler } from './../middlewares/asyncHandler';
import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.post("/register", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { name, role, department, email, password } = req.body

        //check if person exists
        const personExists = await pool.query("select email from users where email = $1", [email]);

        if (personExists.rows.length > 0) {
            res.status(401).json({
                message: "User Already Exists"
            });
            return
        }

        //Hash the password
        const hashed_password = bcrypt.hashSync(password, 10);

        //Insert Person
        const newPerson = await pool.query("insert into users(name, role, department, email, password) values ($1, $2, $3, $4, $5)", [name, role, department, email, hashed_password]);

        res.status(200).json({
            newUser: newPerson.rows
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error: ", error
        })
        console.log(error);
    }
})
)

router.post("/login", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtSecret: string = process.env['ACCESS_TOKEN_SECRET']!
        console.log(jwtSecret)

        const { email, password } = req.body

        //check if person exists
        const personExists = await pool.query("select name, role, email, password from users where email = $1", [email]);

        if (personExists.rows.length === 0) {
            res.status(401).json({
                message: "User does not exist"
            });
            return
        }

        //Check if password matches
        await bcrypt.compare(password, personExists.rows[0].password)


        const payload = ({
            name: personExists.rows[0].name,
            role: personExists.rows[0].role,
            password: personExists.rows[0].password
        })

        //Generate token
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "15m" })

        res.status(200).json({
            token: token,
            user: {
                name: personExists.rows[0].name,
                role: personExists.rows[0].role,
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error: ", error
        })
        console.log(error);
    }
})
)
export default router

