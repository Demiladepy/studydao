# How to Get Your Google API Key (FREE!)

## ✅ Good News: Google Gemini is FREE!

Unlike OpenAI, Google Gemini:
- ✅ **No payment method required**
- ✅ **Generous free tier** (60 requests per minute)
- ✅ **No quota issues**
- ✅ **Works immediately**

---

## 🔑 Get Your API Key (2 Minutes)

### Step 1: Go to Google AI Studio
Visit: **[https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)**

Or search for "Google AI Studio API Key"

### Step 2: Sign In
- Use your personal Google account
- No special setup needed

### Step 3: Create API Key
1. Click **"Create API Key"**
2. Choose an existing Google Cloud project or create a new one
3. Click **"Create API key in new project"** (easiest option)

### Step 4: Copy Your Key
- The key will look like: `AIzaSy...` (39 characters)
- **Copy it immediately!**

### Step 5: Update Your `.env` File
Open `c:\Users\User\Desktop\nothing\studydao\.env` and replace:

```env
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
```

With your actual key:

```env
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 6: Save & Restart
1. Save the `.env` file
2. Your dev server should auto-reload
3. Test your chat - it works! 🎉

---

## 📊 Free Tier Limits

**Gemini 2.0 Flash (Your Model):**
- **Requests per minute:** 60 (plenty for StudyDAO!)
- **Requests per day:** 1,500
- **Tokens per minute:** 1,000,000
- **Cost:** FREE ✨

**For comparison:**
- Average chat message = 1 request
- You can send 60 messages per minute
- 1,500 messages per day
- More than enough for development!

---

## 🔒 Security Note

⚠️ **Keep your API key secure:**
- Don't commit it to Git (already in `.gitignore`)
- Don't share it publicly
- If exposed, delete it and create a new one

---

## 🆚 Comparison: Google vs OpenAI

| Feature | Google Gemini | OpenAI |
|---------|---------------|---------|
| **Cost** | FREE | Requires payment |
| **Setup** | Instant | Need credit card |
| **Quota** | 1,500/day free | Pay per use |
| **Speed** | Very fast | Very fast |
| **Quality** | Excellent | Excellent |

---

## 🎯 Quick Links

- **Get API Key:** [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Manage Keys:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Documentation:** [Gemini API Docs](https://ai.google.dev/docs)

---

## ✅ What to Do Now

1. Click [this link](https://makersuite.google.com/app/apikey)
2. Create your API key
3. Update your `.env` file
4. Test your StudyDAO chat
5. Enjoy! 🎓

No payment required. No quota issues. Just works! ✨
