import { IUser } from "./user";


const genericRoles = [{
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
}];

const ezikovo2022 = [{
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
}, {
    key: "competitions.category",
    value: "Италиански език",
    role: "Италиански Език",
}, {
    key: "competitions.category",
    value: "Руски език",
    role: "Руски Език",
}];

const it2022 = [{
    key: "competitions.name",
    value: "IT2022",
    role: "IT Състезание 2022"
}, {
    key: "competitions.category",
    value: "Програмиране",
    role: "Програмиране",
}, {
    key: "competitions.category",
    value: "Фотография",
    role: "Фотография",
}, {
    key: "competitions.category",
    value: "Видеоклип",
    role: "Видеоклип",
}, {
    key: "competitions.category",
    value: "Front-end web development",
    role: "Front-end DEV",
}, {
    key: "competitions.category",
    value: "Графичен дизайн",
    role: "Графичен дизайн",
}, {
    key: "competitions.category",
    value: "Презентация",
    role: "Презентация",
}, {
    key: "competitions.category",
    value: "(ре)Дизайн на уеб сайт",
    role: "(ре)Дизайн",
}, {
    key: "competitions.category",
    value: "GAME DEV",
    role: "Game DEV",
}]

//     &then=`Програмиране`
//     &then=`Фотография`
//     &then=`Видеоклип`
//     &then=`Front-end web development`
//     &then=`Графичен дизайн`
//     &then=`Презентация`
//     &then=`(ре)Дизайн на уеб сайт`
//     &then=`GAME DEV`

const roles = [
    ...genericRoles,
    ...ezikovo2022,
    ...it2022
]

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
        return roles.find(r => r.value.toLowerCase() === target.trim().toLowerCase())?.role;
    }
}
    
    