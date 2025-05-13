import { protect } from './../middlewares/protect';
import express from 'express'
import { Response, Request, NextFunction } from 'express'
import { ReviewRequest } from '../Utils/Types/reviews.types'
import asyncHandler from '../middlewares/asyncHandler'
import pool from '../database/db.config';

const router = express.Router()

router.put("/api/v1/reviews/addNewReview", protect, asyncHandler(async (req: ReviewRequest, res, next) => {
    try {
        const { employee_id, date, summary, score } = req.body

        if (!req.user) {
            res.status(401).json({
                message:"Not authorized: User not found"
            })
            return
        }

        //reviewers id
        const reviewer_id = req.user.id

        //insert feed
        const feed = await pool.query("INSERT INTO reviews (employee_id, reviewer_id, summary, score) values ($1, $2, $3, $4)", [employee_id, reviewer_id, summary, score])
        
        res.status(200).json({
            message:"Success creating review"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        }),
            console.log("Error: ", error)
    }
}))