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


export type CreateClassForm = 
{
    className: string;
    schoolYear: string;
    semester: string;
    section: string;
};


export type ClassCardDetails = 
{
    className: string;
    schoolYear: string;
    semester: string;
    section: string;
    joinCode: string;
    teacherName: string;
    clickHandler: (joinCode: string) => void;
};


export type ClassDetails = 
{
    className: string;
    schoolYear: string;
    semester: string;
    section: string;
    joinCode: string;
    teacherName: string;
};


export type SubmissionDetails = 
{
    submissionNumber: number;
    fileName: string;
    fileExtension: string;
    content: string;
    teacherFeedback: string | null;
    thumbsUp: boolean | null;
    isEvaluated: boolean;
    submittedAt: string;
    studentName: string;
    studentEmail: string;
    className: string;
    classJoinCode: string;
}


export type SimpleSectionEvaluation =
{
    Score: number;
    General_Evaluation: string;
}


export type DetailedSectionEvaluation =
{
    Score: number;
    Strengths: string;
    Weaknesses: string;
    Suggestions: string;
}


export type EvaluationResults =
{
    Preface: SimpleSectionEvaluation;
    Introduction: DetailedSectionEvaluation;
    Architectural_Design: SimpleSectionEvaluation;
    Detailed_Design: DetailedSectionEvaluation;
    Total_Score: number;
}

