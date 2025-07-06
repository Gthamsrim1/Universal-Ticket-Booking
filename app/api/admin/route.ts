import { NextResponse } from 'next/server';
import AdminModel from '../(models)/Admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, user, password, type } = body;

    if (type === "signup") {
      const existingUser = await AdminModel.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists" });
      }

      const count = await AdminModel.countDocuments();
      const newUser = await AdminModel.create({ email, user, password, id: count + 1 });

      return NextResponse.json({ message: "Signup successful", user: newUser });
    } else if (type === "login") {
      const existingUser = await AdminModel.findOne({ email }) || await AdminModel.findOne({ user: email });

      if (existingUser) {
        if (existingUser.password === password) {
          return NextResponse.json({ message: "Login Successful", user: existingUser.user, id: existingUser.id ?? existingUser._id });
        } else {
          return NextResponse.json({ message: "Incorrect password" });
        }
      }

      return NextResponse.json({ message: "User doesn't exist" });
    }
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 })
  }
}
