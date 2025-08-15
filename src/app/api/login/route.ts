import { connectToDb } from "@/db/connectToDb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectToDb();
    if (!email || !password) {
      return NextResponse.json(
        { message: "please enter the fields" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "user not found" });
    }
    const isMatch = bcrypt.compare(user.password, password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "password not matching" },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET! as Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN! as SignOptions["expiresIn"] }
    );

    const responses = NextResponse.json({ message: `Hello, ${email}\nsuccessfully logged in` }, {status: 200});
    responses.cookies.set("token", token, { httpOnly: true });
    return responses;
  } catch (e) {
    return NextResponse.json({ message: "not success" + e });
  }
}
