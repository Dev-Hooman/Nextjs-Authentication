import { connectToDB } from "@/utils/database"
import User from "@/models/user";
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  const { username, password, image, email } = await req.json();
  console.log(username, password, image, email);
  try {
    await connectToDB();

    const user = await User.findOne({ username })

    if (user !== null) {
      return new Response('User already exists',
        { status: 201 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User({
      email,
      username,
      password: hashedPassword,
      image

    });

    await newUser.save();



    return new Response('User created successfully',
      { status: 201 }
    )

  } catch (err) {
    return new Response("Failed to create a new prompt", { status: 500 })

  }

}


