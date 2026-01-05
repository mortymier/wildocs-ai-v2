import axios from 'axios';

export const uploadSubmission = async(file: File, email: string, joinCode: string) =>
{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    formData.append('joinCode', joinCode);

    try
    {
        const response = await axios.post
        (
            `http://localhost:8080/api/submission/upload`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            }
        );

        return response.data;
    }
    catch(error: any)
    {
        if(error.response?.data)
        {
            throw new Error(error.response.data);
        }

        throw new Error('Uploading submission failed. Please try again');
    }
};


export const getStudentSubmissionsInClass = async(email: string, joinCode: string) =>
{
    try
    {
        const response = await axios.get
        (
            `http://localhost:8080/api/submission/all/student-class`,
            {
                params: { email, joinCode },
                withCredentials: true
            }
        );

        return response.data;
    }
    catch(error: any)
    {
        if(error.response?.data)
        {
            throw new Error(error.response.data);
        }

        throw new Error('Fetching student submissions failed. Please try again.');
    }
};


export const deleteSubmission = async(joinCode: string, submissionNumber: number) =>
{
    try
    {
        const response = await axios.delete
        (
            `http://localhost:8080/api/submission/delete`,
            {
                params: { joinCode, submissionNumber },
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

        throw new Error('Deleting submission failed. Please try again.');
    }
}

export const getSubmissionEvaluationResults = async(joinCode: string, submissionNumber: number) =>
{
    try
    {
        const response = await axios.get
        (
            `http://localhost:8080/api/submission/evaluation-results`,
            {
                params: { joinCode, submissionNumber },
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

        throw new Error('Fetching evaluation results failed. Please try again.');
    }
}