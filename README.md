# AI-driven-detection
SentinelAI is an AI-driven cybersecurity dashboard designed to monitor, detect, and visualize network threats in real-time. By leveraging machine learning models and high-frequency traffic analysis, it provides a proactive defense layer against network anomalies, DDoS attacks, and unauthorized access attempts.

Key Features
Real-time Dashboard: Visualizes network traffic events as they happen using Supabase Realtime
Threat Detection: Categorizes traffic into "Normal" vs "Attack" using a backend ML model.
Automated Simulator: Includes a trafficSimulator to generate test packets for system validation.
Security Metrics: High-level cards tracking total threats blocked and system health.

The Tech stack
Frontend: React, TypeScript, Vite, Tailwind CSS
Icons: Lucide-React
Backend/Database: Supabase (PostgreSQL + Edge Functions)
AI Engine: Python (Scikit-Learn / Random Forest)

Setup instructions
Clone the repo: git clone https://github.com/GreatCyber907/sentinel-ai.git
Install dependencies: npm install
Environment Variables: Create a .env file in the root directory and add your Supabase credentials:
