import google.generativeai as genai
import mysql.connector
import os
from pathlib import Path
import sys
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini API using environment variable
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

def create_prompt(schema, user_query):
    """Create a prompt for the Gemini API including the schema and user query."""
    return f"""
    You are a SQL expert working with a MySQL database. Given the following schema:
    
    {schema}
    
    Convert this request to SQL: {user_query}
    - Use only table and column names present in the schema
    - Return only the SQL query without any formatting or explanation
    - Use standard MySQL syntax
    """

def get_sql_query(schema, user_query):
    """Get SQL query from Gemini API based on the user's natural language query."""
    try:
        # Using the latest model version
        model = genai.GenerativeModel('gemini-1.5-pro-001')
        prompt = create_prompt(schema, user_query)
        response = model.generate_content(prompt)
        
        # Clean response from markdown formatting
        response_text = response.text
        if '```sql' in response_text:
            return response_text.split('```sql')[1].split('```')[0].strip()
        return response_text.strip()
    except Exception as e:
        print(f"Error generating SQL query: {str(e)}")
        return None

def load_schema():
    """Load the SQL schema from the 3nf_complete_schema.sql file."""
    try:
        # Updated to use the correct schema file name
        with open('3nf_complete_schema.sql', 'r') as file:
            return file.read()
    except FileNotFoundError:
        print("Error: 3nf_complete_schema.sql file not found")
        sys.exit(1)

def execute_query(query):
    """Execute the SQL query on the database and return results."""
    try:
        # Database configuration from environment variables
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', 'root'),
            database=os.getenv('MYSQL_DATABASE', 'cybersecurity_incidents_3nf')
        )
            
        cursor = conn.cursor()
        cursor.execute(query)
        
        # Fetch column names
        columns = [desc[0] for desc in cursor.description]
        
        # Fetch all rows
        rows = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return columns, rows
    except Exception as e:
        print(f"Error executing query: {str(e)}")
        return None, None

def display_results(columns, rows):
    """Display query results in a formatted table."""
    if not columns or not rows:
        print("No results found.")
        return

    # Calculate column widths
    widths = [max(len(str(cell)) for cell in [col] + [row[i] for row in rows]) + 2 
              for i, col in enumerate(columns)]
    
    # Print header
    header = "".join(f"{col:<{widths[i]}}" for i, col in enumerate(columns))
    print("\n" + "=" * len(header))
    print(header)
    print("=" * len(header))
    
    # Print rows
    for row in rows:
        print("".join(f"{str(cell):<{widths[i]}}" for i, cell in enumerate(row)))
    print("=" * len(header) + "\n")

def main():
    """Main function to run the SQL query generator."""
    print("Welcome to the Natural Language to SQL Query Converter")
    print("(Type 'exit' to quit)\n")
    
    # Load schema
    schema = load_schema()
    
    while True:
        # Get user input
        user_query = input("\nEnter your question: ").strip()
        
        if user_query.lower() == 'exit':
            break
            
        if not user_query:
            continue
            
        # Generate SQL query
        print("\nGenerating SQL query...")
        sql_query = get_sql_query(schema, user_query)
        
        if sql_query:
            print(f"\nGenerated SQL Query:\n{sql_query}\n")
            
            # Execute query and display results
            print("Executing query...")
            columns, rows = execute_query(sql_query)
            if columns and rows:
                display_results(columns, rows)
        else:
            print("Failed to generate SQL query.")

if __name__ == "__main__":
    main() 