# Study Accountability Agent - ADK-TS Setup

This directory contains the ADK-TS agent configuration for the Study Accountability Agent.

## Structure

- `config.ts` - Main agent configuration using AgentBuilder
- `tools.ts` - Agent tools (startTimer, stopTimer, showStats, setGoal, getMotivation)
- `utils.ts` - Utility functions for conversation context management

## Installation

ADK-TS is already installed in the project. If you need to reinstall:

```bash
npm install @iqai/adk
```

## Environment Variables

Create a `.env` file in the project root with:

```
GOOGLE_API_KEY=your_google_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## API Usage

The agent is accessible via the API route: `/api/agent/chat`

### Example Request

```typescript
const response = await fetch('/api/agent/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Start a study timer',
    conversationId: 'optional-conversation-id',
  }),
});

const data = await response.json();
console.log(data.response); // Agent's response
```

## Available Tools

1. **startTimer** - Starts a new study session timer
2. **stopTimer** - Stops the current active study session
3. **showStats** - Shows comprehensive study statistics
4. **setGoal** - Sets daily/weekly/monthly study goals
5. **getMotivation** - Gets personalized motivational messages

## Database Models

The agent uses the following Prisma models:
- `StudySession` - Tracks individual study sessions
- `StudyGoal` - Tracks user study goals

Run migrations to create these tables:
```bash
npx prisma migrate dev
```

