
import 'server-only';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
// import { prisma } from '@/lib/prisma';

export const authService = {
    seed: async () => {
        try {
            const adminUser = await prisma.user.findUnique({
                where: { email: 'admin@example.com' },
            });

            if (!adminUser) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash('admin', salt);
                await prisma.user.create({
                    data: {
                        email: 'admin@example.com',
                        passwordHash: passwordHash,
                    },
                });
                console.log('Default admin user created: admin@example.com / admin');
            }
        } catch (error) {
            console.error("Failed to seed database:", error);
        }
        
    },
 
    login: async (email: string, password: string) => {
        console.log("Attempting login for:", email);
       
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user || !user.passwordHash) return null;

            if (user) {
                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (isValid) {
                    return { id: user.id, email: user.email };
                }
            }
            return null;
        } catch (error) {
            console.error("Login failed:", error);
            return null;
        }
        
    },

    changePassword: async (email: string, oldPassword: string, newPassword: string) => {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user || !user.passwordHash) return null;

            if (!user) {
                return { success: false, message: 'User not found.' };
            }

            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
            if (!isOldPasswordValid) {
                return { success: false, message: 'The old password you entered is incorrect.' };
            }

            const salt = await bcrypt.genSalt(10);
            const newPasswordHash = await bcrypt.hash(newPassword, salt);
            
            await prisma.user.update({
                where: { email },
                data: { passwordHash: newPasswordHash },
            });

            return { success: true, message: 'Password updated successfully!' };
        } catch (error) {
            console.error("Password change failed:", error);
            return { success: false, message: 'An unexpected error occurred.' };
        }
        
    },
};
