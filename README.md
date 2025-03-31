













# QueryShield: Cybersecurity Incident Management System

<div align="center">
  <p>A modern, AI-powered cybersecurity incident management and analysis platform</p>
</div>

## 🌟 Features

### 🛡️ Incident Management
- **Real-time Tracking**: Monitor incidents as they occur
- **Smart Classification**: AI-assisted incident categorization
- **Impact Analysis**: Track financial and operational impacts
- **Root Cause Documentation**: Detailed analysis and documentation

### 👥 Team Collaboration
- **Role Management**: Define and manage security team roles
- **Expertise Tracking**: Map team member skills and certifications
- **Response Workflow**: Streamlined incident response process
- **Performance Metrics**: Track team and individual performance

### 📊 Analytics & Reporting
- **Interactive Dashboards**: Real-time incident visualization
- **Trend Analysis**: Historical data patterns and insights
- **Department Reports**: Department-wise incident tracking
- **Custom Reports**: Generate tailored security reports

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js 16+
Python 3.8+
MySQL 8.0+
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/QueryShield.git
cd QueryShield
```

2. **Frontend Setup**
```bash
cd new-frontend
npm install
npm run dev
```

3. **Backend Setup**
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn api:app --reload
```

4. **Database Setup**
```sql
-- Run the schema file
source final_3nf_schema.sql
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 13+**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Shadcn UI**: Component library

### Backend
- **FastAPI**: API framework
- **Python 3.8+**: Backend language
- **MySQL**: Database
- **Google Gemini AI**: AI integration
- **JWT**: Authentication

## 📝 Environment Setup

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=mysql://user:password@localhost:3306/cybersecurity_incidents_3nf
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

## 📊 Database Schema

### Core Tables
- `incidents`: Track security incidents
- `affected_systems`: Monitor impacted systems
- `security_team`: Manage team members
- `reporters`: Track incident reporters
- `departments`: Organizational structure

### Reference Tables
- `severity_levels`: Incident severity classification
- `incident_types`: Types of security incidents
- `system_types`: Categories of systems
- `criticality_levels`: System importance levels
- `security_roles`: Team member roles

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request


## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Google Gemini AI](https://cloud.google.com/vertex-ai) for AI capabilities
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Next.js](https://nextjs.org/) for the frontend framework

<div align="center">
  Made with ❤️ for better cybersecurity incident management
</div>
