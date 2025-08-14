import { connectToDb } from "@/db/connectToDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

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
        console.log(existingUser)
        const hashedPass = await bcrypt.hash(password, 10)
        console.log(hashedPass)
        const user = await User.create({
            username,
            email,
            password: hashedPass
        })
        console.log("user is created : ", user)
        return NextResponse.json({message: "success"}, {status: 200})

    }catch(e: any){
        return NextResponse.json({message: "error "+e.message}, {status: 500})
    }
}