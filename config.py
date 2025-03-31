import os
from dotenv import load_dotenv

load_dotenv()

# Database Configuration
MYSQL_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', 'root'),
    'database': os.getenv('MYSQL_DATABASE', 'cybersecurity_incidents')
} 