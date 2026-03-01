# Market Intelligence Builder

A production-ready multi-agent AI research system that generates comprehensive industry reports.

## Features
- **Left Control Panel**: Dynamic research parameters (Industry, Geography, Timeframe).
- **Parallel AI Engine**: Orchestrates multiple specialized agents for Market Sizing, Segmentation, Trends, and more.
- **Institutional UI**: Professional rendering with interactive charts and tables.
- **Export Options**: Professional DOCX, PDF, and Excel reports.
- **Modular Design**: Ready for Claude SaaS or API replacement.

## Tech Stack
- **Frontend**: Next.js (App Router), TailwindCSS, TypeScript, Lucide React, Recharts.
- **Backend**: Next.js API Routes / Modular Services.
- **Styling**: Premium Institutional Design.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## GitHub Deployment
To push this to your repository:
```bash
git remote add origin https://github.com/vibhorkumar1209/market-intelligence-builder.git
git branch -M main
git push -u origin main
```

## Environment Variables
Create a `.env.local` file for API keys (when moving from SaaS to API mode).
```env
# CLAUDE_API_KEY=your_key_here
```
