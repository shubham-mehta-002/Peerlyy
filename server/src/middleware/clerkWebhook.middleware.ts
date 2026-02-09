import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { Webhook } from 'svix';
import { AppError } from "../utils/AppError.js";
import { prisma } from "../config/prisma.js";

export const verifyClerkWebhook = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const wh = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET)

    try {
        wh.verify(req.body.toString(), {
            "svix-id": req.headers["svix-id"] as string,
            "svix-timestamp": req.headers["svix-timestamp"] as string,
            "svix-signature": req.headers["svix-signature"] as string,
        })

        next()
    } catch {
        throw new AppError("Invalid webhook signature", 401)
    }
}



export const handleUserCreated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("CALLED")
        const { data } = req.body;

        if (!data || !data.id || !data.email_addresses || data.email_addresses.length === 0) {
            throw new AppError('Invalid webhook payload', 400);
        }

        const email = data.email_addresses[0].email_address;
        const clerkId = data.id;
        console.log({ data })
        // // Validate college email domain (async - checks database)
        // try {
        //     // await validateCollegeEmail(email);
        //     console.log({ email })
        // } catch (error) {
        //     // If email domain is not allowed, delete user from Clerk
        //     // This prevents unauthorized signups
        //     console.warn(`Rejected signup for non-college email: ${email}`);
        //     // Note: You might want to call Clerk API to delete the user here
        //     return res.status(200).json({ received: true });
        // }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { clerkId } })

        if (existingUser) {
            return res.status(200).json({ received: true, message: 'User already exists' });
        }

        // Validate college email domain
        const domain = email.split('@')[1];
        const college = await prisma.college.findUnique({
            where: { domain }
        });

        if (!college) {
            console.warn(`Rejected signup for non-college email: ${email}`);
            // In a real scenario, you might want to delete the user from Clerk here using their Admin SDK
            // await clerkClient.users.deleteUser(clerkId);
            return res.status(400).json({
                success: false,
                message: 'Email domain not authorized. Please use your college email.'
            });
        }

        // Check if email already exists

        // Check if email already exists
        const emailExists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (emailExists) {
            console.warn(`Email ${email} already exists in database`);
            return res.status(200).json({ received: true, message: 'Email already registered' });
        }

        // Create user
        await prisma.user.create({
            data: {
                clerkId,
                email: email.toLowerCase(),
                collegeId: college.id,
                role: "STUDENT" // Default role
            }
        })


        console.log(`✅ User synced with DB: ${email}`);

        res.status(200).json({ received: true, message: 'User created successfully' });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            console.error('Error handling user.created webhook:', error);
            next(new AppError('Failed to process webhook', 500));
        }
    }
};
