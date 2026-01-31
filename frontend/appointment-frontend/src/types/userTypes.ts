
//Reference Tables
export type Privilege = {
    privilegeId: number;
    roleName: string;
}



export type User = {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    privilege?: Privilege;
}

export type RegisterUserRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    privilegeId: number;
};

export type RegisterResponse = {
    userId: number
    email: string
    privilege: number
};

export type RegisterUserForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

