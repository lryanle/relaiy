## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Want to see the live site?](#want-to-see-the-live-site)
- [Project Structure](#project-structure)
- [Project Summary](#project-summary)
- [Stack](#stack)
- [Setting Up](#setting-up)
- [Run Locally](#run-locally)

## Overview

Relaiy: A SaaS platform streamlining conversational agents with context tree generation, parsing, and live updates. Tech stack: TypeScript, Express, Twilio, langchain, Prisma, Jest, ESLint, and various type definitions."

## Want to see the live site?

View at [relaiy.tech](https://relaiy.tech)

## Project Structure

```bash
├── .gitignore
├── README.md
├── app
│   ├── 404.tsx
│   ├── analytics
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   └── [...all]
│   │   │       └── route.ts
│   │   ├── chat
│   │   │   ├── _schema.ts
│   │   │   └── route.ts
│   │   ├── chats
│   │   │   └── route.ts
│   │   ├── cost
│   │   │   └── route.ts
│   │   ├── createChat
│   │   │   └── route.ts
│   │   ├── finetuning
│   │   │   └── route.ts
│   │   └── getDataPoints
│   │       └── route.ts
│   ├── conversation
│   │   └── [slug]
│   │       └── page.tsx
│   ├── favicon.ico
│   ├── finetuning
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings
│       └── page.tsx
├── backend
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── jest.config.js
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── prisma
│   │   └── schema.prisma
│   ├── src
│   │   ├── app.ts
│   │   ├── db
│   │   │   └── index.ts
│   │   ├── handlers
│   │   │   └── wsMessage.ts
│   │   ├── routes
│   │   │   ├── index.ts
│   │   │   └── twilio.ts
│   │   ├── server.ts
│   │   ├── twilio
│   │   │   └── index.ts
│   │   ├── types
│   │   │   └── llmWebSocket.ts
│   │   └── utils
│   │       ├── mcts.ts
│   │       ├── models.ts
│   │       ├── prompt.ts
│   │       └── threadStatus.ts
│   └── tsconfig.json
├── components.json
├── components
│   ├── agent
│   │   └── inspectagent.tsx
│   ├── analytics
│   │   ├── costbytype.tsx
│   │   ├── costovertime.tsx
│   │   ├── modelusage.tsx
│   │   ├── requestsovertime.tsx
│   │   ├── requeststatus.tsx
│   │   ├── tokensbytype.tsx
│   │   ├── tokensovertime.tsx
│   │   ├── totalusage.tsx
│   │   └── transactionstable.tsx
│   ├── auth
│   │   ├── sign-in-modal.tsx
│   │   └── sign-up-modal.tsx
│   ├── chat
│   │   ├── chat-body.tsx
│   │   └── new-chat-modal.tsx
│   ├── example.tsx
│   ├── icons.tsx
│   ├── magicui
│   │   └── border-beam.tsx
│   ├── nav
│   │   ├── navbar.tsx
│   │   ├── navigation.tsx
│   │   ├── navitem.tsx
│   │   └── sidebar.tsx
│   ├── providers
│   │   └── query-provider.tsx
│   ├── status.tsx
│   ├── table
│   │   ├── columns.tsx
│   │   └── data-table.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── timeembed.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── spinner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── env.d.ts
├── eslint.config.mjs
├── hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── context
│   │   ├── auth-provider.tsx
│   │   └── websocket-provider.tsx
│   ├── dummy-data.ts
│   ├── prisma.ts
│   └── utils.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma
│   └── schema.prisma
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── llmproviders
│   │   ├── anthropic.svg
│   │   ├── aws.svg
│   │   ├── cohere.svg
│   │   ├── deepseek.svg
│   │   ├── google.svg
│   │   ├── groq.svg
│   │   ├── meta.svg
│   │   ├── mistral.svg
│   │   ├── openai.svg
│   │   └── perplexity.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── routing.ts
├── tailwind.config.ts
├── tsconfig.json
└── types
    ├── auth.ts
    ├── chat.ts
    ├── types.d.ts
    └── websocket.ts

```

## Project Summary

- [app](app): Primary app components and features
- [app/api](app/api): API routes and authentication
- [app/conversation](app/conversation): Conversation management and display
- [app/settings](app/settings): Application settings and configurations
- [backend](backend): Backend server with Prisma ORM and routes
- [backend/src/db](backend/src/db): Database handling with Prisma and TypeScript
- [components](components): Reusable UI components library
- [hooks](hooks): React hooks for managing application state

## Stack

- [TypeScript](https://www.typescriptlang.org/): Superset of JavaScript that adds static types
- [Express](https://expressjs.com/): Web framework for Node.js
- [Prisma](https://www.prisma.io/): Database toolkit and ORM
- [Apollo Client (langchain/core)](https://www.apollographql.com/docs/react/): GraphQL client for data fetching
- [Jest (types/jest)](https://jestjs.io/): Unit testing framework
- [Zod](https://zod.dev/): Input validation and data transformation
- [Eslint](https://eslint.org/): Code linter for TypeScript and JS
- [Ts-node](https://typestrong.org/ts-node/): TypeScript execution environment for Node.js

## Setting Up

Insert your environment variables.

## Run Locally

1. Clone relaiy repository:  
```bash  
git clone https://github.com/lryanle/relaiy  
```
2. Install the dependencies with one of the package managers listed below:  
```bash  
pnpm install  
bun install  
npm install  
yarn install  
```
3. Start the development mode:  
```bash  
pnpm dev  
bun dev  
npm run dev  
yarn dev  
```