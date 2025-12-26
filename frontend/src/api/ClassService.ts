// This file contains methods for making class-related API calls

import axios from 'axios';
import type { CreateClassForm } from '../types.ts';

export const createClass = async(formData: CreateClassForm, email: string) =>
{
    try
    {
        const response = await axios.post
        (
            `http://localhost:8080/api/class/create`, formData, 
            {
                params: { email },
                withCredentials: true
            }
        );

        return response.data;
    }
    catch(error: any)
    {
        if (error.response?.data)
        {
            throw new Error(error.response.data);
        }

        throw new Error('Creating class failed. Please try again.');
    }
};