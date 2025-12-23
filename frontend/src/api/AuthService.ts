// This file contains methods for making authentication-related API calls

import axios from 'axios';
import type { LoginForm, RegisterForm } from '../types.ts';

export const login = async(formData: LoginForm) =>
{
    try
    {
        const response = await axios.post
        (
            `http://localhost:8080/api/auth/login`, formData, { withCredentials: true }
        );

        return response.data;
    }
    catch(error: any)
    {
        if(error.response?.data)
        {
            throw new Error(error.response.data);
        }

        throw new Error('Login failed. Please try again.');
    }
};


export const register = async(formData: RegisterForm, role: string) =>
{
    try
    {
        const response = await axios.post
        (
            `http://localhost:8080/api/auth/register`, formData, { params: { role } }
        );

        return response.data;
    }
    catch(error: any)
    {
        if(typeof(error.response?.data) === 'object')
        {
            throw new Error("ID number can only contain numbers and dashes");
        }

        if(error.response?.data)
        {
            throw new Error(error.response.data);
        }

        throw new Error('Registration failed. Please try again.');
    }
};


export const verifyEmail = async(code: string) =>
{
    try
    {
        const response = await axios.get
        (
            `http://localhost:8080/api/auth/verify/email`, { params: { code } }
        );

        return response.data;
    }
    catch(error: any)
    {
        if(error.response?.data)
        {
            throw new Error(error.response.data);
        }

        throw new Error('Email verification failed. Please try again.');
    }
};


export const logout = async() =>
{
    try
    {
        const response = await axios.post
        (
            `http://localhost:8080/api/auth/logout`, {}, { withCredentials: true }
        );

        localStorage.removeItem('authUser');
        return response.data;
    }
    catch(error: any)
    {
        if (error.response?.data)
        {
            throw new Error(error.response.data);
        }

        throw new Error('Logout failed. Please try again.');
    }
};