require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data')

const analyzeImage = async (imageUrl) => {
    const endpoint = process.env.AZURE_COGNITIVE_ENDPOINT;
    const apiKey = process.env.AZURE_COGNITIVE_KEY;
    const url = `${endpoint}/vision/v3.1/analyze?visualFeatures=Categories,Description,Color`;

    try {
        const response = await axios.post(
            url,
            { url: imageUrl },  // Send image URL
            { headers: { 'Ocp-Apim-Subscription-Key': apiKey, 'Content-Type': 'application/json' } }
        );

        console.log("Analysis Result:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
};

// Test with an image
analyzeImage("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Shaki_waterfall.jpg/800px-Shaki_waterfall.jpg");

