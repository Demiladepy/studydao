# How to Get Your OpenAI API Key

## The Problem

Your current API key in `.env` is a placeholder:
```
OPENAI_API_KEY=sk-mnop5678mnop5678mnop5678mnop5678mnop5678
```

This is **NOT a valid OpenAI API key**, which is why you're getting the error "Failed to process message".

## Solution: Get a Real OpenAI API Key

### Step 1: Create an OpenAI Account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email or Google/Microsoft account
3. Verify your email if required

### Step 2: Add Payment Method (Required)
⚠️ **Important**: OpenAI requires a payment method to use the API
1. Go to [https://platform.openai.com/account/billing/overview](https://platform.openai.com/account/billing/overview)
2. Click "Add payment method"
3. Add a credit/debit card
4. You can set spending limits to control costs

### Step 3: Get Your API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name (e.g., "StudyDAO")
4. **Copy the key immediately** - you won't be able to see it again!
5. The key will look like: `sk-proj-...` or `sk-...` (much longer than the placeholder)

### Step 4: Update Your .env File
1. Open `c:\Users\User\Desktop\nothing\studydao\.env`
2. Replace the placeholder key with your real key:
   ```env
   OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
   ```
3. Save the file

### Step 5: Restart Your Dev Server
The server should automatically reload, but if not:
1. Stop the current server (Ctrl+C in terminal)
2. Run `npm run dev` again

## Cost Information

### gpt-4o-mini Pricing (Current Model)
- **Input**: $0.150 per 1M tokens (~750,000 words)
- **Output**: $0.600 per 1M tokens (~750,000 words)

### Estimated Costs for StudyDAO
- **Per chat message**: ~$0.0001 - $0.0005 (less than a cent)
- **100 messages**: ~$0.01 - $0.05
- **1,000 messages**: ~$0.10 - $0.50

💡 **Tip**: Set a monthly spending limit in your OpenAI account to avoid unexpected charges!

## Alternative: Use a Free Trial

OpenAI often provides **$5 in free credits** for new accounts, which is enough for thousands of messages with gpt-4o-mini.

## Troubleshooting

### Error: "Invalid API key"
- Make sure you copied the entire key (they're very long!)
- Check for extra spaces before or after the key
- Make sure the key starts with `sk-`

### Error: "Insufficient quota"
- You need to add a payment method
- Or you've used up your free credits

### Error: "Rate limit exceeded"
- You're making too many requests too quickly
- Wait a minute and try again
- Consider upgrading your account tier

## Security Note

⚠️ **NEVER commit your API key to Git!**
- The `.env` file should already be in `.gitignore`
- If you accidentally commit it, **immediately** revoke it and create a new one

## Next Steps

1. Get your OpenAI API key from the link above
2. Update your `.env` file
3. Restart the dev server
4. Try chatting with your StudyDAO agent again!

The error message should now be more helpful and tell you exactly what went wrong.
