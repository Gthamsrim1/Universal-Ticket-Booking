import { NextResponse } from 'next/server';
import VendorModel from '../(models)/Vendors';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, user, password, type, id, avatar, contact } = body;

    if (type === "signup") {
      const existingUser = await VendorModel.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists" });
      }

      const count = await VendorModel.countDocuments();
      const newUser = await VendorModel.create({ email, user, password, id: count + 1, avatar: null, contact: null });

      return NextResponse.json({ message: "Signup successful", user: newUser });

    } else if (type === "login") {
      const existingUser = await VendorModel.findOne({ email }) || await VendorModel.findOne({ user: email });

      if (existingUser) {
        if (existingUser.password === password) {
          return NextResponse.json({
            message: "Login Successful",
            user: existingUser.user,
            id: existingUser.id ?? existingUser._id,
            email: existingUser.email,
            avatar: existingUser.avatar,
            contact: existingUser.contact,
          });
        } else {
          return NextResponse.json({ message: "Incorrect password" });
        }
      }

      return NextResponse.json({ message: "User doesn't exist" });

    } else if (type === "update") {
        if (!id) {
          return NextResponse.json({ message: "User ID is required for update" }, { status: 400 });
        }

        const updatedFields: any = {};
        if (user !== undefined) updatedFields.user = user;
        if (email !== undefined) updatedFields.email = email;
        if (avatar !== undefined) updatedFields.avatar = avatar;
        if (contact !== undefined) updatedFields.contact = contact;
        if (password !== undefined) updatedFields.password = password;

        if (Object.keys(updatedFields).length === 0) {
          return NextResponse.json({ message: "No fields provided for update" }, { status: 400 });
        }
        const updatedUser = await VendorModel.findOneAndUpdate(
          { id: Number(id) },
          updatedFields,
          { new: true }
        );

        if (!updatedUser) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { password: _, ...userWithoutPassword } = updatedUser.toObject();

        return NextResponse.json({
          message: "Update successful",
          user: userWithoutPassword
        });
      } else if (type == 'getPass') {
        const existingUser = await VendorModel.findOne({ id });
        if (existingUser) {
          return NextResponse.json({
            password: existingUser.password
          })
        } else {
          return NextResponse.json({
            message: "User not found"
          })
        }
      }

    return NextResponse.json({ message: "Invalid request type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
