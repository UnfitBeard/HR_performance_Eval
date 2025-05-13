import express from 'express'
import { Request } from 'express'

export interface User{
    id:string,
    name:string,
    role:string,
    department?:string,
    email?:string,
}

export interface UserRequest extends Request {
    token?:string
    user?:User
}