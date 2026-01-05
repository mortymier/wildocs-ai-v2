package com.wildocsai.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.wildocsai.backend.entity.ClassEntity;
import com.wildocsai.backend.entity.SubmissionEntity;
import com.wildocsai.backend.repository.ClassRepository;
import com.wildocsai.backend.repository.SubmissionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService
{
    private final Client geminiClient;
    private final ClassRepository classRepository;
    private final SubmissionRepository submissionRepository;

    /*
        If a model runs out of requests-per-day, try another one from this list:

        - gemini-3-flash-preview
        - gemini-2.5-flash
        - gemini-2.5-flash-lite

        Each of them has a limit of 20 requests per day.
        Switching between models gives you a total of 60 requests per day.
     */

    public String askGemini(String prompt)
    {
        GenerateContentResponse response = geminiClient.models
                .generateContent("gemini-3-flash-preview", prompt, null);

        log.info("\n\nText Response:\n\n" + response.text());

        return response.text();
    }

    @Transactional
    public String evaluateSDD(String joinCode, Integer submissionNumber)
    {
        ClassEntity classEntity = classRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new IllegalArgumentException("Class with join code " + joinCode + " not found."));

        SubmissionEntity submission = submissionRepository.findByClassEntityAndSubmissionNumber(classEntity, submissionNumber)
                .orElseThrow(() -> new IllegalArgumentException("Submission number " + submissionNumber + " not found in class " + joinCode + "."));

        if(submission.getIsEvaluated())
        {
            throw new IllegalArgumentException("SDD submission has already been evaluated by AI");
        }

        String contentJSON = submission.getContent();

        String prompt =
        """
            You are an expert AI assistant specializing in software engineering documentation analysis. Your task is to evaluate a Software Design Document (SDD) provided in a JSON format. You must analyze each section based on the detailed criteria provided below and generate a structured JSON output containing your evaluation, including scores, strengths, weaknesses, and suggestions.

            The total maximum score for the entire document is 100 points.

            **INPUT:**
            You will receive a JSON object representing the SDD. Here is the structure of the input you will be evaluating:
            ```json
            {
              "Title": "String",
              "Preface": "String",
              "Introduction": {
                "Purpose": "String",
                "Scope": "String",
                "Definitions and Acronyms": "String",
                "References": "String"
              },
              "Architectural Design": {
                "description": "String",
                "blockDiagramExists": "Boolean"
              },
              "Detailed Design": {
                "Module X": {
                  "Transaction Y": {
                    "hasAllImages": "Boolean",
                    "frontendComponents": "String",
                    "backendComponents": "String"
                  }
                }
              }
            }
            ```

            **EVALUATION CRITERIA:**

            **1. Preface (Max Score: 10 points)**
               - **Scoring:** Award a high score (8-10) simply if the `Preface` field exists and is not empty. The quality of the content is not a primary concern for this section. If it's empty or missing, the score should be 0.
               - **Evaluation:** Provide a brief, one-sentence evaluation confirming its presence.

            **2. Introduction (Max Score: 30 points)**
               - **Purpose (10 points):** Evaluate if the text clearly explains the purpose of the SDD and the system it describes. Does it state what the document aims to achieve?
               - **Scope (10 points):** Assess if the text outlines the features, functionalities, and boundaries of the system. The presence of a clear list of core functionalities is a strong positive indicator.
               - **Definitions and Acronyms (5 points):** Check if the definitions and acronyms provided are relevant to software development and the context of the document. The list should explain technical terms, not just common words.
               - **References (5 points):** Evaluate if the references are relevant to the technologies and standards mentioned in the document (e.g., React, Spring Boot, IEEE standards). A higher number of relevant references is better.
               - **Evaluation:** Provide a summary of strengths (what was done well), weaknesses (what is missing or unclear), and concrete suggestions for improvement.

            **3. Architectural Design (Max Score: 20 points)**
               - **Scoring:** The score is primarily based on the `blockDiagramExists` flag.
                 - If `blockDiagramExists` is `true`, award at least 15 points.
                 - If the `description` field provides a coherent explanation of the architecture, award the remaining 5 points.
                 - If `blockDiagramExists` is `false`, the score should be low (0-5), regardless of the description.
               - **Evaluation:** Provide a brief, one-sentence evaluation based on the presence of the block diagram.

            **4. Detailed Design (Max Score: 40 points)**
               - **Scoring:** This section's score is based on the completeness and detail of its modules and transactions. Start with a score of 40 and deduct points for issues.
                 - For each transaction, check the following:
                   - If `hasAllImages` is `false`, deduct **3 points**. This flag indicates at least 1 missing diagram (UI, Class, Sequence, ERD), which is a significant omission.
                   - If `frontendComponents` is empty or contains placeholder text, deduct **2 points**.
                   - If `backendComponents` is empty or contains placeholder text, deduct **2 points**.
                 - Review the content of `frontendComponents` and `backendComponents`. The descriptions should be specific, mentioning component names, their purpose, and technologies used (e.g., "React Functional Component," "Spring Boot REST Controller"). Vague descriptions should result in a minor deduction (1-3 points per transaction).
                 - **Minimum Score Rule:** After all deductions, if the final score for this section is 0 but the "Detailed Design" section in the JSON is not empty, set the score between 5-10. User does not need to know about this rule.
               - **Evaluation:** Provide a summary of strengths (e.g., "Well-defined components in the User Authentication module"), weaknesses (e.g., "Missing diagrams and backend details in Module 2"), and specific suggestions (e.g., "Add sequence diagrams for all transactions to clarify data flow.").

            **CRITICAL OUTPUT FORMATTING RULES:**
            Your response MUST be a single, raw JSON object. It is absolutely critical that you follow these rules, as your output will be parsed directly by a program and will fail otherwise.

            1.  **NO MARKDOWN:** Do NOT wrap the JSON in markdown code fences (like ```json ... ```).
            2.  **NO EXTRA TEXT:** Do NOT include any explanatory text, greetings, or apologies before or after the JSON object.
            3.  **RAW PLAINTEXT ONLY:** The entire response body must be the JSON object itself, starting with '{' and ending with '}'.

            **JSON Structure to follow:**
            {
              "Preface": {
                "Score": <number>,
                "General_Evaluation": "<string>"
              },
              "Introduction": {
                "Score": <number>,
                "Strengths": "<string>",
                "Weaknesses": "<string>",
                "Suggestions": "<string>"
              },
              "Architectural_Design": {
                "Score": <number>,
                "General_Evaluation": "<string>"
              },
              "Detailed_Design": {
                "Score": <number>,
                "Strengths": "<string>",
                "Weaknesses": "<string>",
                "Suggestions": "<string>"
              },
              "Total_Score": <number>
            }
            
            
            Here is the SDD JSON to evaluate:

        """ + contentJSON;

        GenerateContentResponse evaluation = geminiClient.models.generateContent
        (
            "gemini-2.5-flash",
            prompt,
            null
        );

        log.info("\nGemini Prompt:\n" + prompt);
        log.info("\nGemini Evaluation Result:\n" + evaluation.text());

        // Make sure no JSON markdown fences surround the result (```json ```)
        String rawEvaluation = evaluation.text();
        String cleanEvaluation = rawEvaluation.replace("```json", "").replace("```", "").trim();

        submission.setAiEvaluation(cleanEvaluation);
        submission.setIsEvaluated(true);
        submissionRepository.save(submission);

        return "SDD AI Evaluation succesful!";
    }
}
