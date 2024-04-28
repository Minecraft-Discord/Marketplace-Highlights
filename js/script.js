// js/script.js
document.getElementById('contentFile').addEventListener('change', function() {
    var fileInput = document.getElementById('contentFile');
    if (fileInput.files.length > 0) {
        var fileName = fileInput.files[0].name;
        document.getElementById('fileName').textContent = fileName;
    } else {
        document.getElementById('fileName').textContent = "No file chosen";
    }
});

async function sendData() {
  let errors = checkErrors();
  let webhook = document.getElementById("webhookInput").value;

  // If there are errors, display them
  if (errors.length > 0) {
    sendError(errors);
    return; // Exit the function early
  } else {
    const productDetails = await getProductDetailsfromFile();
    sendDiscordEmbed(webhook, productDetails);
  }
}

async function checkErrors() {
  let errors = [];
  // Get the value of the webhook input
  let webhook = document.getElementById("webhookInput").value;

  // Check if the webhook is empty
  if (webhook.trim() === "") {
    errors.push("Webhook cannot be blank.");
  }

  // Get the file input field for the content
  let fileInput = document.getElementById("contentFile");

  // Check if a file has been uploaded
  if (!fileInput.files || fileInput.files.length === 0) {
    errors.push("Content file must be uploaded.");
  }

  return errors;
}

async function getProductDetailsfromFile() {
  // Get the file input field for the content
  let fileInput = document.getElementById("contentFile");
  // Get the file from the file input
  let file = fileInput.files[0];

  // Call getProductDetails to process the file
  const productDetails = await getProductDetails(file);
  if (productDetails) {
    // Use productDetails object here
    console.log("Product Details:", productDetails);
    return productDetails;
  } else {
    console.log("Failed to fetch product details.");
    return false;
  }
}

async function previewData() {
  let errors = checkErrors();

  // If there are errors, display them
  if (errors.length > 0) {
    sendError(errors);
    return; // Exit the function early
  } else {
    const productDetails = await getProductDetailsfromFile();
    buildPreview(productDetails);
  }
}

function buildPreview(productDetails) {

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const formattedDate = `${day} ${month} ${year}`;
    // Get the embed object using the provided function
    const embed = getEmbed(productDetails);
    // Get the discord-embed element
    const embedContainer = document.querySelector(".discord-embed");

    // Create a new div to hold the embed content
    const newEmbedContent = document.createElement("div");
    newEmbedContent.classList.add("author");
    newEmbedContent.textContent = embed.author.name;

    // Convert new lines in field values to <br> tags
    const processedFields = embed.fields
        ? embed.fields.map(field => ({
            ...field,
            value: field.value.replace(/\n/g, '<br>') // Replace new lines with <br> tags
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Replace **text** with <strong>text</strong>
        }))
        : [];

    // Set the content of the embed using the embed object
    embedContainer.innerHTML = `
        <div class="author">${embed.author.name}</div>
        <div class="title"><a href="${embed.url}" target="_blank">${embed.title}</a></div>
        <div class="description">${embed.description}</div>
        ${
            processedFields
                ? processedFields
                    .map(field => `
                        <div class="field">
                            <div class="name">${field.name}</div>
                            <div class="value">${field.value} ${formattedDate}</div>
                        </div>
                    `)
                    .join("")
                : ""
        }
        <div class="image-container">
            <img src="${embed.image.url}" alt="Image">
        </div>
        <div class="footer">${embed.footer.text}</div>
    </div>`;
}



async function sendDiscordEmbed(webhookUrl, productDetails) {
  const embed = getEmbed(productDetails);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ embeds: [embed] }),
    });
    console.log("Sending Embed:", embed);
    if (response.ok) {
      console.log("Discord embed sent successfully.");
    } else {
      console.error(
        "Failed to send Discord embed:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error sending Discord embed:", error);
  }
}

function getEmbed(productDetails) {
  const currentDate = new Date();
  const timestamp = Math.floor(currentDate.getTime() / 1000);
  const localTime = `<t:${timestamp}:D>`;

  let price = "Unlock this item for FREE";

  if (productDetails.price > 0) {
    price = `Unlock this item for ${productDetails.price} Minecoins`;
  }
  const embed = {
    title: productDetails.title,
    description: productDetails.description,
    color: 0xffdc16, // Hex color code
    author: {
      name: "BY " + productDetails.creatorName,
    },
    footer: {
      text: price,
    },
    url: productDetails.storeURL, // URL for the embed
    image: {
      url: productDetails.imageURL, // URL of the image to be displayed in the embed
    },
  };

  // Check if averageRating is defined and not null
  if (
    productDetails.averageRating !== undefined &&
    productDetails.averageRating !== null
  ) {
    // Add the 'fields' section to the embed
    embed.fields = [
      {
        name: `Ratings`,
        value: `**Average Rating**: ${productDetails.averageRating}/5 \n **Total Ratings**: ${productDetails.totalRatingsCount} \nRatings as of ${localTime}`,
        inline: true,
      },
    ];
  }

  return embed;
}

async function getProductDetails(contentFile) {
  // Get the value of the imageoveride input
  let imageOverideInput = document.getElementById("imageOverrideInput").value;

  try {
    // Read the content of the file as JSON
    const content = await readFileAsJSON(contentFile);
    let image = extractThumbnailImage(content.images);

    // Check if the imageOverideInput is not empty
    if (imageOverideInput.trim() !== "") {
      image = imageOverideInput;
    }

    // Extract required fields from the JSON data
    const productDetails = {
      id: content.id,
      title: content.title["en-US"].toUpperCase(),
      description: content.description["en-US"],
      storeURL: `https://www.minecraft.net/en-us/marketplace/pdp?id=${content.id}`,
      imageURL: image,
      creatorName: content.displayProperties.creatorName.toUpperCase(),
      price: content.displayProperties.price,
      averageRating: content.rating?.averageRating,
      totalRatingsCount: content.rating?.totalRatingsCount,
    };

    return productDetails;
  } catch (error) {
    console.error("Error parsing product details:", error);
    alert("Error parsing product details:", error.message);
    return null; // Return null if an error occurs
  }
}

function extractThumbnailImage(images) {
  // Filter the images array to find the image with the tag "Thumbnail"
  const thumbnailImage = images.find((image) => image.type === "Thumbnail");

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
    reader.onload = function (event) {
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

function openJSON() {
  let errors = [];
  // Get the value of the webhook input
  let contentId = document.getElementById("contentIDInput").value;

  // Check if any input field is blank
  if (contentId.trim() === "") {
    errors.push("ID cannot be blank.");
  }

  // If there are errors, display them
  if (errors.length > 0) {
    sendError(errors);
    return; // Exit the function early
  }
  window.open(
    `https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id=${contentId}`,
    "_blank"
  );
}
