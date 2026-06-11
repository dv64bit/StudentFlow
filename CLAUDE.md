# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

No test suite configured.

## Required Environment Variables

```
MONGODB_URL=
NEXT_CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_TINY_EDITOR_API_KEY=
```

## Architecture

**Next.js 14 App Router** with two route groups:
- `app/(auth)/` — Clerk sign-in/sign-up pages (public)
- `app/(root)/` — main app behind auth layout with left/right sidebars

**Data layer — all server actions in `lib/actions/`**. Every action calls `connectToDatabase()` first (singleton Mongoose connection). Actions use `"use server"` directive and are called directly from Server Components or form handlers. Type contracts live in `lib/actions/shared.types.d.ts`.

**MongoDB models in `database/`**:
- `user.model.ts` — `clerkId` is the FK linking Clerk auth to MongoDB user
- `question.model.ts` — fields: `questionTitle`, `questionExplantion` (typo in schema, don't fix without migration), `questionTags`, `user`, `upvotes`, `downvotes`, `views`, `answers`
- `tag.model.ts` — tags are upserted by name (case-insensitive) and reference question IDs
- `answer.model.ts`, `interaction.model.ts`

**Auth flow**: Clerk handles auth. `app/api/webhooks/route.ts` listens for Clerk `user.created/updated/deleted` events (verified via Svix) and syncs to MongoDB. The middleware in `middleware.ts` protects specific routes.

**Reputation system**: Voting actions in `question.action.ts` and `answer.action.ts` directly `$inc` user reputation. Asking a question: +5. Receiving upvote on question: +10. Upvoting someone: +1.

**AI feature**: `app/api/chatgpt/route.ts` — POST endpoint that calls OpenAI `gpt-3.5-turbo`. Triggered from the answer form to generate AI-assisted answers.

**UI**: shadcn/ui components in `components/ui/`. Shared layout components in `components/shared/`. TinyMCE rich-text editor used in `QuestionForm` and `Answer` forms. Prism.js handles syntax highlighting in `ParseHTML.tsx`. Theme (dark/light) managed by `context/ThemeProvider.tsx`.

**Path aliasing**: `@/` maps to project root (see `tsconfig.json`).
