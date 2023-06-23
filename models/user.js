import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    // match: [/^(?=.{1,3}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
  },
  password:{
    type : String
  },
  image: {
    type: String,
    default: ""
  },
  // provider: {
  //   type: String,
  //   Default: "credentials"
  // }
});

const User = models.User || model("User", UserSchema);

export default User;