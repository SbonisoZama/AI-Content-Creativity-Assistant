require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up Multer for image uploads (support multiple files)
const upload = multer({ dest: 'uploads/' });

// Azure Cognitive Services API Details
const cognitiveKey = process.env.AZURE_COGNITIVE_KEY;
const cognitiveEndpoint = process.env.AZURE_COGNITIVE_ENDPOINT;
const visionUrl = `${cognitiveEndpoint}/vision/v3.1/analyze?visualFeatures=Description`;

// 🔥 Image Upload & AI Captioning Route (Multiple Images)
app.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded.' });
        }

        let captions = [];

        // Loop through uploaded files
        for (const file of req.files) {
            const imagePath = file.path;

            // Read image file
            const imageBuffer = fs.readFileSync(imagePath);

            // Send image to Azure
            const response = await axios.post(visionUrl, imageBuffer, {
                headers: {
                    'Ocp-Apim-Subscription-Key': cognitiveKey,
                    'Content-Type': 'application/octet-stream',
                }
            });

            // Extract AI-generated caption
            const caption = response.data.description.captions[0]?.text || 'No caption generated.';
            captions.push(caption);

            // Cleanup: Delete the uploaded image
            fs.unlinkSync(imagePath);
        }

        // Return all AI-generated captions
        res.json({ captions });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process images.' });
    }
});

app.get("/", (req, res) => {
    res.send("Server is running. Upload images using /upload.");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

