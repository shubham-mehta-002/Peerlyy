import { prisma } from "../config/prisma.js";
import { hashPassword } from "./hash.js";
import { UserRole } from "../constants/userRoles.enum.js";
import { AuthProvider } from "../constants/authProvider.enum.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@peerlyy.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PeerlyyAdmin123!";

export const seedAdminUser = async (): Promise<void> => {
    try {
        // Check if any ADMIN users exist in the database
        const adminCount = await prisma.user.count({
            where: { role: UserRole.ADMIN }
        });

        if (adminCount === 0) {
            console.log("No users found. Creating default admin user...");

            // Check if the college domain exists for thapar.edu
            const domain = "thapar.edu";
            let collegeDomain = await prisma.collegeDomain.findUnique({
                where: { domain }
            });

            // Create the college domain if it doesn't exist
            if (!collegeDomain) {
                collegeDomain = await prisma.collegeDomain.create({
                    data: {
                        domain,
                        isActive: true
                    }
                });
                console.log(`Created college domain: ${domain}`);
            }

            // Check if a college exists for this domain
            let college = await prisma.college.findFirst({
                where: { domainId: collegeDomain.id }
            });

            // Create a default college if it doesn't exist
            if (!college) {
                college = await prisma.college.create({
                    data: {
                        name: "Thapar Institute",
                        campus: "Patiala",
                        domainId: collegeDomain.id
                    }
                });
                console.log(`Created default college: Thapar Institute`);
            }

            // Hash the admin password
            const hashedPassword = await hashPassword(ADMIN_PASSWORD);

            // Create the admin user
            const adminUser = await prisma.user.create({
                data: {
                    email: ADMIN_EMAIL,
                    password: hashedPassword,
                    provider: AuthProvider.EMAIL,
                    isVerified: true,
                    isProfileComplete: true,
                    role: UserRole.ADMIN,
                    status: "ACTIVE" as const,
                    collegeId: college.id
                }
            });

            console.log(`✅ Default admin user created successfully!`);
            console.log(`   Email: ${ADMIN_EMAIL}`);
            console.log(`   Role: ${adminUser.role}`);
        } else {
            console.log(`Database already has ${adminCount} admin user(s). Skipping admin seed.`);
        }
    } catch (error: any) {
        // Check if it's a missing table error (database not migrated)
        if (error.code === 'P2022' || error.code === 'P2021') {
            console.warn("⚠️  Database tables not found. Please run: npx prisma migrate dev");
            console.warn("   Admin seeding skipped.");
        } else {
            console.error("❌ Failed to seed admin user:", error.message || error);
        }
        // Don't throw error - allow server to start even if seeding fails
    }
};
