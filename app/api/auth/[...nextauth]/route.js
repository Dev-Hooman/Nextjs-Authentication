import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter"

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { connectToDB } from '@/utils/database';
import User from '@/models/user';

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_ID_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_ID_CLIENT_SECRET,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    })
    ,
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET
    }),
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
        const { username, password } = credentials;

        console.log("Credentials: ", username, password);

        try {
          await connectToDB();
          const user = await User.findOne({ username });

          console.log("User Found ?", user);

          if (!user) {
            throw new Error("Invalid username or password");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid username or password");
          }

          console.log("Exiting Authorize...");
          return user;
        } catch (error) {
          console.error("Error during authorization:", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      console.log(sessionUser);
      session.user.id = sessionUser._id.toString();
      session.user.name = sessionUser.username

      return session;
    },

    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectToDB();
          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name.replace(' ', '').toLowerCase(),
              image: profile.picture,
              provider: "google"
            });
          }

          return true;
        } catch (error) {
          console.log('Error checking if user exists: ', error.message);
          return false;
        }
      }
      else if (account.provider === 'github') {
        try {
          await connectToDB();
          const userExists = await User.findOne({ email: profile.email });

          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.login.replace('-', '').toLowerCase(),
              image: profile.avatar_url,
              provider: "github"
            });
          }
          return true;
        } catch (error) {
          console.log('Error checking if user exists: ', error.message);
          return false;
        }
      }
      else if (account.provider === "credentials") {
        return true;
      }
      else if (account.provider === "twitter") {

        try {
          await connectToDB();
          const userExists = await User.findOne({ username: profile.data.username });

          if (!userExists) {
            await User.create({
              username: profile.data.username,
              image: profile.data.profile_image_url,
            });
          }

          return true;
        } catch (error) {
          console.log('Error checking if user exists: ', error.message);
          return false;
        }
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
