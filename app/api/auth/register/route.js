import { connectToDB } from "@/utils/database"
import User from "@/models/user";
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  const { username, password, image, email } = await req.json();
  console.log( username, password, image, email );
  try {
    await connectToDB();

    const user = await User.findOne({ username })

    console.log(user);

    if (user !== null) {
      return new Response('User already exists',
        { status: 201 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      image

    });

    console.log("New User: ",newUser);

    const Save = await newUser.save();
    console.log("Save User: ",Save);




    return new Response('User created successfully',
      { status: 201 }
    )

  } catch (err) {


    return new Response("Failed to create a User"+err.message, { status: 500 })

  }

}


