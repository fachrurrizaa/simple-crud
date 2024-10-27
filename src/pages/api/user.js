import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import * as z from "zod";

// validate and create a new user

const userSchema = z.object({
    username: z.string().min(3, 'Username is required').max(250),
    password: z
    .string()
    .min(3, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    ,
    email: z.string().min(3, 'Email is required').email('Invalid email'),
    nama: z.string().min(3, 'Name is required').max(250),
});

export default async function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        try {
            if (!req.body.email ||!req.body.password) {
                return res.status(400).json({ message: "Please fill in all fields" });
            }
    
            const { username, password, email, nama } = userSchema.parse(req.body);
    
            const existingUserByEmail = await prisma.User.findUnique({ 
                where: { email : email } 
            });
            
            if (existingUserByEmail) {
                return res.status(409).json({ message: "Email already exists" });
            }
    
            const existingUserByUsername = await prisma.User.findUnique({ 
                where: { username : username } 
            });
    
            if (existingUserByUsername) {
                return res.status(409).json({ message: "Username already exists" });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
             
            const newUser = await prisma.User.create({
                data: {
                    username,
                    password: hashedPassword,
                    email,
                    nama,
                },
            });
    
            const { password: newUserPassword, ...user } = newUser;
            
            res.status(201).json(newUser);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    if (method === "GET") {
        if (req.query?.username) { 
            res.json(await prisma.User.findUnique({ where: { username: req.query.username } }));
        } else {
            res.json(await prisma.User.findMany());
        }
    }

    if (method === "PUT") {
        if (!req.query.id) {
            return res.status(400).json({ message: "Please provide an ID to update" });
        }
    
        try {
            const { username, password, email, nama } = userSchema.partial().parse(req.body);
    
            // Jika password diberikan, hash sebelum diperbarui
            const updatedData = {
                ...(username && { username }),
                ...(password && { password: await bcrypt.hash(password, 10) }),
                ...(email && { email }),
                ...(nama && { nama }),
            };
    
            const updatedUser = await prisma.User.update({
                where: { id: parseInt(req.query.id, 10) }, // Gunakan id dari query
                data: updatedData,
            });
    
            const { password: updatedUserPassword, ...user } = updatedUser;
    
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: "Error updating user" });
        }
    }


    if (method === "DELETE") {
        if (req.query?.username) {
            try {
                await prisma.User.delete({ where: { username: req.query.username } });
                res.json({ message: "User deleted successfully" });
            } catch (error) {
                console.error(error);
                res.status(404).json({ message: "User not found" });
            }
        } else {
            res.status(400).json({ message: "Please provide a username" });
        }
    }

}