export interface IUser {
    phone: string;
    email: string;
    fullName: string;
    role: string;
    competitions: { name: string; category: string }[]
}