import { HfInference } from "@huggingface/inference";

/**
 * AI Service
 * Responsible for generating monster names, flavor text, and images.
 */

export const generateMonsterData = async (taskDescription) => {
    try {
        const apiKey = process.env.HUGGING_FACE;
        if (!apiKey) throw new Error("Missing Hugging Face API key");

        const hf = new HfInference(apiKey);

        const prompt = `You are a creative monster designer for a dark fantasy game. Return ONLY a raw JSON object and nothing else. No markdown formatting.
Based on the task "${taskDescription}", create a monster. Categorize the task into one primary stat: STR (physical/labor), INT (mental/study), AGI (errands/chores), CON (endurance/habits), or CHA (social). Judge the difficulty based on how big the task is: "easy" for trivial tasks, "medium" for normal tasks, "hard" for large tasks, "boss" for massive multi-hour tasks. Give the monster a stat block with values from 1-10. Output JSON format: { "name": "Monster Name", "flavorText": "Short funny/scary description", "type": "Monster Type", "visualPrompt": "Detailed visual description for an image generator", "primaryStat": "STR", "difficulty": "medium", "monsterStats": { "STR": 5, "INT": 5, "AGI": 5, "CON": 5, "CHA": 5 } }`;

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
            difficulty: monsterJSON.difficulty || "medium",
            monsterStats: monsterJSON.monsterStats || { STR: 5, INT: 5, AGI: 5, CON: 5, CHA: 5 },
            hp: 100
        };

    } catch (e) {
        return {
            name: "Unknown Horror",
            flavorText: "A creature of indeterminate origin, shrouded in mystery.",
            hp: 100,
            type: "Anomaly",
            primaryStat: "INT",
            difficulty: "medium",
            monsterStats: { STR: 5, INT: 5, AGI: 5, CON: 5, CHA: 5 },
            imageUrl: null
        };
    }
};
