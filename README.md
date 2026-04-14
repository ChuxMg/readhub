This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Configuration

This project now supports a **Prisma database** and **AI Chat** via OpenAI. Before running or deploying, ensure you have the following environment variables set:

1.  **OpenAI API Key**: Required for the chat feature.
    - Add `OPENAI_API_KEY=your_key_here` to your `.env` file.
2.  **Database URL**:
    - Locally, it defaults to a SQLite database (`file:./dev.db`).
    - For production (Vercel), you may want to connect a PostgreSQL or similar database. Update the `datasource` in `prisma/schema.prisma` if needed.

### Steps to Deploy:

1. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Push your local code to that repository:
     ```bash
     git remote add origin <your-repo-url>
     git branch -M main
     git push -u origin main
     ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Connect your GitHub account and import the repository.
   - Vercel will automatically detect that this is a Next.js project.

3. **Configure Settings**:
   - The default settings (Build Command: `next build`, Output Directory: `.next`) are already correct for this project.
   - Click **Deploy**.

4. **Alternative: Deploy via Vercel CLI**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the project root and follow the prompts.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
