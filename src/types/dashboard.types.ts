export interface DashboardUser {
    _id: string;
    name: string;
    email: string;
    whatsappNumber?: string;
    isEmailVerified?: boolean;
}