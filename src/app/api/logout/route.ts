import { NextResponse } from "next/server";

export async function GET(req: Request){
    try{
        const responses = NextResponse.json({message: "successfully logged out"}, {status: 200})
        responses.cookies.set("token","", {httpOnly: true, expires: new Date(0)});
        console.log("user logged out");
        return responses
    }catch(e){
        return NextResponse.json({message: "loggin out unsuccessful"+e}, {status:500})
    }
}