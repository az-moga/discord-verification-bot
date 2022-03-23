import { IUser } from "./user";

const roles = [{
    key: "role",
    value: "Ученик",
    role: "Ученик",
}, {
    key: "role",
    value: "Учител",
    role: "Учител",
}, {
    key: "role",
    value: "Директор",
    role: "Директор",
}, {
    key: "role",
    value: "Родител",
    role: "Родител",
}, {
    key: "competitions.name",
    value: "ezici2022",
    role: "Езиково състезание 2022",
}, {
    key: "competitions.category",
    value: "Английски език",
    role: "Английски Език",
}, {
    key: "competitions.category",
    value: "Френски език",
    role: "Френски Език",
}, {
    key: "competitions.category",
    value: "Немски език",
    role: "Немски Език",
}, {
    key: "competitions.category",
    value: "Испански език",
    role: "Испански Език",
}]

export class RoleMap {
    public static exec(user: IUser) {
        return new Set([
            this.getRole(user.role),
            ...user.competitions.map(c => this.getRole(c.category)),
            ...user.competitions.map(c => this.getRole(c.name)),
        ].filter(x => x))
    }

    public static allowedRoles = roles.map(r => r.role);

    private static getRole(target: string) {
        return roles.find(r => r.value === target)?.role;
    }
}