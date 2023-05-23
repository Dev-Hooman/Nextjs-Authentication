import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { connectToDB } from '@/utils/database';
import User from '@/models/user';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        username: { type: 'text', placeholder: 'user@email.com' },
        password: { type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {

          const {username, password} = credentials

          console.log("Credentials: ", username, password);
          

          await connectToDB();
          const user = await User.findOne({ username });

          console.log("User Found ?", user);

          if (!user){
            throw new Error("Invalid username or Password");

          };

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) return null;
          console.log("exiting Authorize...");


          return user;
        

      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      console.log(sessionUser);
      session.user.id = sessionUser._id.toString();

      return session;
    },

    async signIn({ account, profile }) {
      console.log("Entring sigin...");

      if (account.provider === 'google') {
        try {
          await connectToDB();
          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name.replace(' ', '').toLowerCase(),
              image: profile.picture,
            });
          }

          return true;
        } catch (error) {
          console.log('Error checking if user exists: ', error.message);
          return false;
        }
      } else if (account.provider == "credentials") {
        return true;
      }
      console.log("Exiting sigin...");

      return false;

    },

    // jwt({ token, account, user }) {
    //   if (account) {
    //     token.accessToken = account.access_token;
    //     token.id = user.id;
    //     token.username = user.name;
    //   }
    //   return token;
    // },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
});

export { handler as GET, handler as POST };
