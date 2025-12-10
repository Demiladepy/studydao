// Simple test script to verify OpenAI API key
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testOpenAIKey() {
    console.log("Testing OpenAI API key...\n");

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error("❌ OPENAI_API_KEY not found in environment variables");
        process.exit(1);
    }

    console.log("✅ API Key found");
    console.log(`   Key starts with: ${apiKey.substring(0, 20)}...`);
    console.log(`   Key length: ${apiKey.length} characters\n`);

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        console.log("🔄 Making test API call to OpenAI...");

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say 'Hello, StudyDAO!'" }
            ],
            max_tokens: 50,
        });

        console.log("✅ SUCCESS! OpenAI API is working!\n");
        console.log("Response:", completion.choices[0].message.content);
        console.log("\n✨ Your API key is valid and working correctly!");

    } catch (error: any) {
        console.error("❌ ERROR: Failed to communicate with OpenAI\n");

        if (error.status === 401) {
            console.error("🔑 Invalid API Key");
            console.error("   - The API key might be incorrect");
            console.error("   - The API key might have been revoked");
            console.error("   - Go to https://platform.openai.com/api-keys to check");
        } else if (error.status === 429) {
            console.error("⏱️  Rate Limit or Quota Exceeded");
            console.error("   - You may have exceeded your usage quota");
            console.error("   - Add a payment method at https://platform.openai.com/account/billing");
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error("🌐 Network Error");
            console.error("   - Cannot connect to OpenAI servers");
            console.error("   - Check your internet connection");
            console.error("   - Check if you're behind a firewall");
        } else {
            console.error("Error details:", error.message);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Response:", error.response.data);
            }
        }

        console.error("\n📋 Full error object:");
        console.error(error);
        process.exit(1);
    }
}

testOpenAIKey();
