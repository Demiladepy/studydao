# ADK-TS: What It Was vs What Replaced It

## 🔍 What is ADK-TS?

**ADK-TS** = **Agent Development Kit for TypeScript**
- **Created by:** Google/IQ AI ([@iqai/adk](https://www.npmjs.com/package/@iqai/adk))
- **Purpose:** Build AI agents with tools and function calling
- **Original AI Model:** Google Gemini (gemini-2.0-flash-exp)
- **Status in your app:** ⚠️ Still installed but NO LONGER USED

---

## 📂 File Status: What's Used vs Not Used

### ❌ NOT USED ANYMORE (Old ADK-TS Files)

#### 1. `lib/agent/tools.ts` (408 lines)
**Status:** ❌ Not imported anywhere, INACTIVE

**What it was:**
- Used `createTool()` from `@iqai/adk`
- Defined 5 tools using ADK-TS format:
  - `startTimerTool`
  - `stopTimerTool`
  - `showStatsTool`
  - `setGoalTool`
  - `getMotivationTool`

**Example of ADK-TS format:**
```typescript
import { createTool } from "@iqai/adk";

export const startTimerTool = createTool({
  name: "startTimer",
  description: "Starts a new study session timer",
  schema: z.object({
    userId: z.string(),
    subject: z.string().optional(),
  }),
  fn: async (args) => {
    // Tool implementation
    return { success: true, message: "Timer started!" };
  },
});
```

---

### ✅ CURRENTLY USED (New OpenAI Files)

#### 1. `lib/agent/openai-tools.ts` (NEW FILE)
**Status:** ✅ ACTIVE, imported by API route

**What it does:**
- Defines the same 5 tools but in OpenAI format
- Exports `toolFunctions` (object with actual implementations)
- Exports `openAITools` (array of OpenAI function definitions)

**Example of OpenAI format:**
```typescript
// Function implementation
export const toolFunctions = {
  async startTimer(args: { userId: string; subject?: string }) {
    // Same implementation as before
    return { success: true, message: "Timer started!" };
  },
  // ... other tools
};

// OpenAI function definitions
export const openAITools = [
  {
    type: "function",
    function: {
      name: "startTimer",
      description: "Starts a new study session timer",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string" },
          subject: { type: "string" },
        },
        required: ["userId"],
      },
    },
  },
  // ... other tools
];
```

#### 2. `lib/agent/config.ts` (MODIFIED)
**Before (ADK-TS):**
```typescript
import { AgentBuilder } from "@iqai/adk";

export async function createStudyAgent() {
  const agent = await AgentBuilder.create("studyAccountabilityAgent")
    .withModel("gemini-2.0-flash-exp")
    .withInstruction(`You are a study agent...`)
    .withTools(startTimerTool, stopTimerTool, ...)
    .build();
  
  return agent;
}
```

**After (OpenAI):**
```typescript
import OpenAI from "openai";

export function createStudyAgent() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  return {
    openai,
    systemInstruction: SYSTEM_INSTRUCTION,
  };
}
```

#### 3. `app/api/agent/chat/route.ts` (MAJOR REWRITE)
**Before (ADK-TS):**
```typescript
const { runner } = await createStudyAgent();
const response = await runner.ask(userMessage);
```

**After (OpenAI):**
```typescript
const { openai, systemInstruction } = createStudyAgent();

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: systemInstruction },
    { role: "user", content: userMessage }
  ],
  tools: openAITools,
  tool_choice: "auto",
});

// Handle function calls manually
if (completion.choices[0].message.tool_calls) {
  const toolCall = completion.choices[0].message.tool_calls[0];
  const result = await toolFunctions[toolCall.function.name](args);
  // ... get natural language response
}
```

---

## 🔄 What ADK-TS Was Doing (Before)

### Architecture Flow (OLD):

```
User Message
    ↓
API Route (/api/agent/chat)
    ↓
createStudyAgent() → AgentBuilder (ADK-TS)
    ↓
runner.ask(message) → Sends to Gemini API
    ↓
Gemini processes with tools
    ↓
ADK-TS handles tool execution automatically
    ↓
Returns formatted response
    ↓
Back to user
```

### Key Features ADK-TS Provided:
1. **High-level abstraction** - Simple `.ask()` method
2. **Automatic tool management** - Handled function calling internally
3. **Built-in conversation context** - Managed conversation state
4. **Gemini integration** - Direct connection to Google's AI

---

## 🆕 What OpenAI Does (Now)

### Architecture Flow (NEW):

```
User Message
    ↓
API Route (/api/agent/chat)
    ↓
createStudyAgent() → Returns OpenAI client
    ↓
openai.chat.completions.create() → Direct OpenAI API call
    ↓
OpenAI returns response with tool_calls
    ↓
Manually execute tool functions (toolFunctions)
    ↓
Make follow-up call to get natural language response
    ↓
Back to user
```

### Key Differences:
1. **Low-level control** - Direct API calls, more flexibility
2. **Manual tool handling** - We handle function calling ourselves
3. **Explicit conversation management** - We build messages array
4. **OpenAI integration** - Direct connection to OpenAI's API

---

## 📊 Comparison Table

| Feature | ADK-TS (Old) | OpenAI (New) |
|---------|--------------|--------------|
| **AI Provider** | Google Gemini | OpenAI |
| **Model** | gemini-2.0-flash-exp | gpt-4o-mini |
| **Abstraction Level** | High (AgentBuilder) | Low (Direct API) |
| **Tool Definition** | `createTool()` | Plain objects |
| **Tool Execution** | Automatic | Manual |
| **Setup Complexity** | Low | Medium |
| **Flexibility** | Medium | High |
| **Status** | ❌ Not used | ✅ Active |

---

## 📁 Current File Structure

```
lib/agent/
├── config.ts            ✅ ACTIVE - OpenAI client setup
├── openai-tools.ts      ✅ ACTIVE - Tool definitions & implementations
├── tools.ts             ❌ INACTIVE - Old ADK-TS tools (not used)
├── db-helpers.ts        ✅ ACTIVE - Database helper functions
├── utils.ts             ✅ ACTIVE - Context management
└── README.md            ⚠️  OUTDATED - References ADK-TS

app/api/agent/chat/
└── route.ts             ✅ ACTIVE - Uses OpenAI directly
```

---

## 🧹 Cleanup Options

You can safely remove these if you want:

### 1. Remove ADK-TS dependency
```bash
npm uninstall @iqai/adk
```

### 2. Delete or archive old files
- `lib/agent/tools.ts` (not used anymore)
- `ADK_SETUP_SUMMARY.md` (references old setup)
- `lib/agent/README.md` (contains ADK-TS instructions)

### 3. Keep them for reference
- If you might want to switch back to Gemini
- If you want to compare implementations
- No harm in keeping them (just unused code)

---

## 💡 Why We Switched

1. **Your request** - You wanted to use OpenAI instead of Gemini
2. **More control** - Direct API access gives more flexibility
3. **Wider adoption** - OpenAI has broader ecosystem
4. **Similar functionality** - Both support function calling

---

## ✅ Summary

**ADK-TS was:**
- A high-level framework for building AI agents
- Used Google Gemini models
- Provided automatic tool management
- Required `AgentBuilder` and `createTool()`

**Now replaced by:**
- Direct OpenAI API calls
- Manual but flexible tool handling
- Same functionality with different implementation
- More control over the conversation flow

**Bottom line:** The app does the exact same thing, just using OpenAI instead of ADK-TS/Gemini under the hood!
