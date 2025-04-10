# Daily Exposed

A modern investigative journalism platform focused on exposing scams and frauds in MLM, Crypto, and AI industries.

## Features

- 🚀 Modern, responsive design built with Next.js 14 and Tailwind CSS
- 📝 Markdown-based article editor with live preview
- 🤖 AI-powered content rewriting using GPT-4
- 🎨 Automatic image generation with DALL·E
- 🔄 Automatic scraping and rewriting of BehindMLM articles
- 🔒 Secure admin dashboard with NextAuth authentication
- 📊 PostgreSQL database with Prisma ORM
- 🎯 SEO optimized with metadata and structured data

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4 Turbo + DALL·E 3
- **Scraping**: Cheerio
- **Hosting**: Vercel (recommended) or custom server

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/daily-exposed.git
   cd daily-exposed
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in `.env`

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Create an admin user:
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the app running.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/daily_exposed"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# BehindMLM Scraping
BEHINDMLM_BASE_URL="https://behindmlm.com"
SCRAPING_INTERVAL="*/30 * * * *"  # Every 30 minutes
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

### Custom Server

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [BehindMLM](https://behindmlm.com) for inspiration
- [Shadcn UI](https://ui.shadcn.com) for beautiful components
- [Vercel](https://vercel.com) for hosting
- [OpenAI](https://openai.com) for AI capabilities 