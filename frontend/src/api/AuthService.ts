// This file contains methods for making authentication-related API calls

import axios from 'axios';
import type { LoginForm } from '../types.ts';

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