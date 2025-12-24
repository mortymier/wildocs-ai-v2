// This file is for type declarations

export type LoginForm =
{
    email: string;
    password: string;
};


export type RegisterForm = 
{
    firstName: string;
    lastName: string;
    idNum: string;
    email: string;
    password: string;
};


export type AuthenticatedUser = 
{
    firstName: string;
    lastName: string;
    email: string;
    idNum: string;
    role: 'TEACHER' | 'STUDENT' | 'ADMIN';
};


export type ProtectRouteRoles = 
{
    allowedRoles: Array<'TEACHER' | 'STUDENT' | 'ADMIN'>;
};


export type AuthorizationState = 'loading' | 'authorized' | 'unauthorized' | 'forbidden';