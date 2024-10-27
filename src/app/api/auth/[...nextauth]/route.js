import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Enter your username' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
            },
            async authorize(credentials) {
                if (!credentials.username ||!credentials.password) {
                    return null;
                }

                const existingUser = await prisma.User.findUnique({
                    where: {
                        username: credentials.username,
                    },
                });

                if ( !existingUser ){
                    throw new Error('No such user found');
                }

                const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    throw new Error('Invalid password');
                }

                return { id: existingUser.id, username: existingUser.username };
            },
        }),
    ],
    
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username
                }
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                }
            }
        }
    },      
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET
}

const handler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };