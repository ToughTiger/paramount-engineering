

// import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
// const prisma = new PrismaClient();
import { prisma } from '@/server/lib/prisma';

export const authService = {
  

    login: async (email: string, password: string) => {
       
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

            if (!user) {
                return { success: false, message: 'User not found.' };
            }

            if (!user || !user.passwordHash) return null;

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
