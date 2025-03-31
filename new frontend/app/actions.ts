"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateSqlQuery(userQuery: string): Promise<string> {
  try {
    const systemPrompt = `
      You are a cybersecurity SQL query generator. Convert natural language questions about cybersecurity incidents into valid SQL queries.
      
      The database has a table called 'cybersecurity_incidents' with the following schema:
      - id (integer): Unique identifier for each incident
      - incident_type (text): Type of cybersecurity incident (e.g., Ransomware, Phishing, DDoS)
      - severity (text): Severity level (High, Medium, Low)
      - timestamp (datetime): When the incident occurred
      - affected_system (text): The system affected by the incident
      - department (text): The department affected by the incident
      - description (text): Detailed description of the incident
      
      Return ONLY the SQL query without any explanation or markdown formatting.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userQuery,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating SQL query:", error)
    throw new Error("Failed to generate SQL query")
  }
}

