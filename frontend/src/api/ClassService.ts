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


export const getClassesByTeacher = async(email: string) =>
{
    try
    {
        const response = await axios.get
        (
            `http://localhost:8080/api/class/all/teacher`, 
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

        throw new Error('Fetching classes failed. Please try again.');
    }
};


export const joinClass = async(email: string, joinCode: string) =>
{
    try
    {
        const response = await axios.post
        (
            `http://localhost:8080/api/class/join`, {},
            {
                params: { email, joinCode },
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

        throw new Error('Joining class failed. Please try again.');
    }
};


export const getClassesByStudent = async(email: string) =>
{
    try
    {
        const response = await axios.get
        (
            `http://localhost:8080/api/class/all/student`,
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

        throw new Error('Fetching classes failed. Please try again.');
    }
};


export const getClassDetails = async(joinCode: string) =>
{
    try
    {
        const response = await axios.get
        (
            `http://localhost:8080/api/class/details`,
            {
                params: { joinCode },
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

        throw new Error('Fetching class details failed. Please try again.');
    }
};


export const getStudentsInClass = async(joinCode: string) =>
{
    try
    {
        const response = await axios.get
        (
            `http://localhost:8080/api/class/student-list`,
            {
                params: { joinCode },
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

        throw new Error('Fetching students in class failed. Please try again.');
    }
};