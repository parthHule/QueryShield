import pandas as pd
from pandasql import sqldf
import google.generativeai as genai
import streamlit
# Configure Google Gemini API
genai.configure(api_key='AIzaSyDmJDC8Jn-HiNefGVREKzb9z9yOcgvbPms')

def get_csv_schema(csv_path):
    """Read CSV file and return its schema with sample data"""
    df = pd.read_csv(csv_path)
    return {
        'columns': df.columns.tolist(),
        'sample_data': df.head(3).to_dict(orient='records')
    }

def generate_sql_query(user_input, schema):
    """Use Gemini to generate SQL query from natural language"""
    prompt = f"""
    You are a SQL expert working with CSV data. The table is named 'df' with these columns: {schema['columns']}.
    Sample data: {schema['sample_data']}
    
    Convert this request to SQL: {user_input}
    - Use only column names present in the data
    - Return only the SQL query without any formatting or explanation
    - Use standard SQL syntax
    """
    
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    
    # Clean response from markdown formatting
    response_text = response.text
    if '```sql' in response_text:
        return response_text.split('```sql')[1].split('```')[0].strip()
    return response_text.strip()

def execute_query(csv_path, sql_query):
    """Execute SQL query on CSV data"""
    df = pd.read_csv(csv_path)
    return sqldf(sql_query, {'df': df})

def main():
    csv_path = "finalmark1_sample.csv"
    user_input = input("Enter your data question: ")
    
    try:
        schema = get_csv_schema(csv_path)
        sql_query = generate_sql_query(user_input, schema)
        print(f"\nGenerated SQL:\n{sql_query}\n")
        
        result = execute_query(csv_path, sql_query)
        print("Query Result:")
        print(result)
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()