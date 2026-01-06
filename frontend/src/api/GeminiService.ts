import axios from 'axios';

export const evaluateSDD = async(joinCode: string, submissionNumber: number) =>
{
    try
    {
        const response = await axios.post
        (
            `http://localhost:8080/api/gemini/evaluate`,
            null,
            {
                params: { joinCode, submissionNumber },
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

        throw new Error('AI Evaluation failed. Please try again');
    }
};