import { User, UserRequest } from './user.types';
import express from 'express'
import { Request } from "express";

interface Review {
    id:string,
    employee_id:number,
    reviewer_id:number,
    date:string,
    summary:string,
    score:string
}

export interface ReviewRequest extends UserRequest {
    review?:Review
}