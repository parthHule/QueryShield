# Natural Language to SQL Query Converter

This Python script uses Google's Gemini API to convert natural language questions into SQL queries for a cybersecurity incidents database.

## Prerequisites

- Python 3.7 or higher
- MySQL server (optional - falls back to SQLite if MySQL is not available)
- Google Cloud project with Gemini API enabled
- Gemini API key

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables:
```bash
# On Windows
set GEMINI_API_KEY=your_api_key_here
set MYSQL_USER=your_mysql_user  # Optional
set MYSQL_PASSWORD=your_mysql_password  # Optional

# On Linux/Mac
export GEMINI_API_KEY=your_api_key_here
export MYSQL_USER=your_mysql_user  # Optional
export MYSQL_PASSWORD=your_mysql_password  # Optional
```

3. Ensure your schema.sql file is in the same directory as the script.

## Usage

1. Run the script:
```bash
python sql_query_generator.py
```

2. Enter your questions in natural language. For example:
   - "Show me all critical severity incidents"
   - "What is the total financial impact of incidents in 2024?"
   - "List all incidents reported by John Smith"

3. Type 'exit' to quit the program.

## Features

- Converts natural language questions to SQL queries using Gemini AI
- Supports both MySQL and SQLite databases
- Displays results in a formatted table
- Handles errors gracefully
- Includes comprehensive schema understanding

## Error Handling

The script includes error handling for:
- Missing API key
- Database connection issues
- Invalid SQL queries
- Empty results
- Missing schema file

## Database Schema

The script works with the cybersecurity incidents database schema, which includes tables for:
- Incidents
- Severity Levels
- Incident Types
- Affected Systems
- Departments
- Reporters
- Security Team Members
- Incident Responses
- Incident Logs 