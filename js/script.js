// js/script.js
async function sendData() {
    let errors = [];
    // Get the value of the webhook input
    let webhook = document.getElementById("webhookInput").value;

    // Check if the webhook is empty
    if (webhook.trim() === '') {
        errors.push("Webhook cannot be blank.");
    }

    // Get the file input field for the content
    let fileInput = document.getElementById("contentFile");

    // Check if a file has been uploaded
    if (!fileInput.files || fileInput.files.length === 0) {
        errors.push("Content file must be uploaded.");
    } else {
        // Get the file from the file input
        let file = fileInput.files[0];
        
        // Call getProductDetails to process the file
        const productDetails = await getProductDetails(file);
        if (productDetails) {
            // Use productDetails object here
            sendDiscordEmbed(webhook, productDetails);
        } else {
            console.log("Failed to fetch product details.");
        }
    }

    // If there are errors, display them
    if (errors.length > 0) {
        sendError(errors);
        return; // Exit the function early
    }
}
async function sendDiscordEmbed(webhookUrl, productDetails) {
    let price = "Unlock this item for FREE";

    if(productDetails.price > 0){
        price = `Unlock this item for ${productDetails.price} Minecoins`
    }
    const embed = {
        title: productDetails.title,
        description: productDetails.description,
        color: 0xFFDC16, // Hex color code
        author: {
            name: productDetails.creatorName
        },
        footer: {
            text: price
        },
        url: productDetails.storeURL, // URL for the embed
        image: {
            url: productDetails.imageURL // URL of the image to be displayed in the embed
        }
    };

    console.log("Sending Embed", embed);

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (response.ok) {
            console.log('Discord embed sent successfully.');
        } else {
            console.error('Failed to send Discord embed:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error sending Discord embed:', error);
    }
}

async function getProductDetails(contentFile) {
    try {
        // Read the content of the file as JSON
        const content = await readFileAsJSON(contentFile);
        
        // Extract required fields from the JSON data
        const productDetails = {
            id: content.id,
            title: content.title["en-US"],
            description: content.description["en-US"],
            storeURL: `https://www.minecraft.net/en-us/marketplace/pdp?id=${content.id}`,
            creatorName: content.displayProperties.creatorName,
            price: content.displayProperties.price
        };

        // Download image and update imageURL
        const imageUrl = extractThumbnailImage(content.images);
        const imageFilename = path.join('imageDump', `${productDetails.id}.jpg`);
        await downloadImage(imageUrl, imageFilename);
        productDetails.imageURL = imageFilename;

        return productDetails;
    } catch (error) {
        console.error("Error parsing product details:", error);
        alert("Error parsing product details:", error.message);
        return null; // Return null if an error occurs
    }
}

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function downloadImage(imageUrl, filename) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    const fileStream = fs.createWriteStream(filename);
    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
}

function extractThumbnailImage(images) {
    // Filter the images array to find the image with the tag "Thumbnail"
    const thumbnailImage = images.find(image => image.type === "Thumbnail");

    // If a thumbnail image is found, return its URL
    if (thumbnailImage) {
        return thumbnailImage.url;
    } else {
        // If no thumbnail image is found, return null or an empty string
        return null; // You can also return an empty string or handle the absence of a thumbnail image in your application logic
    }
}

// Function to read the content of a file as JSON
function readFileAsJSON(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function(event) {
            try {
                let jsonData = JSON.parse(event.target.result);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}

function sendError(messages) {
    if (messages.length === 0) {
        return; // No messages to display
    }

    let errorMessage = "Errors:\n";
    for (let i = 0; i < messages.length; i++) {
        errorMessage += "- " + messages[i] + "\n";
    }
    alert(errorMessage);
}

function openJSON(){
    let errors = [];
    // Get the value of the webhook input
    let contentId = document.getElementById("contentIDInput").value;

    // Check if any input field is blank
    if (contentId.trim() === '') {
        errors.push("ID cannot be blank.");
    }

    // If there are errors, display them
    if (errors.length > 0) {
        sendError(errors);
        return; // Exit the function early
    }
    window.open(`https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id=${contentId}`, '_blank');
}