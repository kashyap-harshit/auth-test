import { connectToDb } from "@/db/connectToDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt, { Secret, SignOptions } from "jsonwebtoken"

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        const {username, email, password} = body;
        await connectToDb();
        if(!username || !email || !password){
            return NextResponse.json({message: "please provide neccessary fields"}, {status: 400})
        }
        console.log("received data: ", {username, email, password})
        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json({message: "user already exists with this email"}, {status: 400})
        }
        const hashedPass = await bcrypt.hash(password, 10)
        console.log(hashedPass)
        const user = await User.create({
            username,
            email,
            password: hashedPass
        })
        if(!user){
            return NextResponse.json({message: "could not create user"}, {status: 500})
        }
        const token = jwt.sign(
            {_id: user._id},
            process.env.JWT_SECRET! as Secret,
            {expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']}
        )
        
        const responses = NextResponse.json({message: "user created successfully", user: {_id: user._id, email: user.email, username: user.username}}, {status: 201})
        responses.cookies.set("token", token,{httpOnly: true})
        return responses;
    }catch(e){
        return NextResponse.json({message: "error "+e}, {status: 500})
    }
}