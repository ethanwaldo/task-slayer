import { HfInference } from "@huggingface/inference";

/**
 * AI Service
 * Responsible for generating monster names, flavor text, and images.
 */

export const generateMonsterData = async (taskDescription) => {
    console.log(`Generating AI data for task: ${taskDescription}`);
    
    try {
        const apiKey = process.env.HUGGING_FACE;
        if (!apiKey) throw new Error("Missing Hugging Face API key");

        const hf = new HfInference(apiKey);

        const prompt = `You are a creative monster designer for a dark fantasy game. Return ONLY a raw JSON object and nothing else. No markdown formatting.
Based on the task "${taskDescription}", create a monster. Also categorize this task into one primary stat: STR (physical/labor), INT (mental/study), AGI (errands/chores), CON (endurance/habits), or CHA (social). Output JSON format: { "name": "Monster Name", "flavorText": "Short funny/scary description", "type": "Monster Type", "visualPrompt": "Detailed visual description for an image generator", "primaryStat": "STR" }`;

        const textResponse = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                { role: "system", content: "You are a JSON returning API." },
                { role: "user", content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.7
        });

        let generatedText = textResponse.choices[0].message.content;
        
        // Clean up markdown formatting if the model still included it
        generatedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        // Sometimes the model might trail off or include extra text after the JSON
        const jsonEndIndex = generatedText.lastIndexOf("}");
        const jsonStartIndex = generatedText.indexOf("{");
        if (jsonEndIndex !== -1 && jsonStartIndex !== -1) {
            generatedText = generatedText.substring(jsonStartIndex, jsonEndIndex + 1);
        }

        let monsterJSON;
        try {
            monsterJSON = JSON.parse(generatedText);
        } catch (parseError) {
            console.error("Failed to parse JSON:", generatedText);
            throw new Error("Invalid JSON from LLM");
        }

        console.log("Monster text generated:", monsterJSON.name);

        // Image Generation
        const imageBlob = await hf.textToImage({
            model: "black-forest-labs/FLUX.1-schnell",
            inputs: `${monsterJSON.visualPrompt}, dark fantasy video game concept art, high quality, highly detailed, dramatic lighting, plain dark background`,
            parameters: { negative_prompt: "blurry, low quality, cartoon" }
        });

        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:${imageBlob.type};base64,${buffer.toString('base64')}`;

        return {
            name: monsterJSON.name,
            flavorText: monsterJSON.flavorText,
            type: monsterJSON.type,
            imageUrl: base64Image,
            primaryStat: monsterJSON.primaryStat || "INT",
            hp: 100
        };

    } catch (e) {
        console.error("AI Generation Error:", e);
        // Fallback monster
        return {
            name: `Error Beast`,
            flavorText: `Failed due to: ${e.message}`,
            hp: 100,
            type: "Anomaly",
            primaryStat: "INT",
            imageUrl: null
        };
    }
};
