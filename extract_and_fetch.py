import os
import sys
import requests

# Function to ensure the imageDump directory exists
def ensure_directory_exists(directory):
    os.makedirs(directory, exist_ok=True)

# Function to fetch and process data for a given ID
def fetch_and_process_data(id, image_dump_dir='imageDump'):
    url = f"https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id={id}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Will raise an exception for 4XX/5XX responses
        data = response.json()
    except requests.RequestException as e:
        print(f"Failed to fetch or parse data for ID {id}: {e}")
        return

    # Extract required fields
    title = data.get('title', {}).get('en-us', 'No title')
    description = data.get('description', {}).get('en-us', 'No description')
    creator_name = data.get('displayProperties', {}).get('creatorName', 'Unknown Creator')
    price = data.get('displayProperties', {}).get('price', 'No price')
    
    print(f"Title: {title}")
    print(f"Description: {description}")
    print(f"Creator Name: {creator_name}")
    print(f"Price: {price}")
    
    # Loop through images and download if type is Thumbnail
    for image in data.get('images', []):
        if image.get('type') == 'Thumbnail':
            image_url = image.get('url')
            download_image(image_url, image_dump_dir)

# Function to download an image from a URL to a specified directory
def download_image(image_url, download_dir):
    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Will raise an exception for 4XX/5XX responses
        image_filename = os.path.basename(image_url)
        image_path = os.path.join(download_dir, image_filename)
        with open(image_path, 'wb') as f:
            f.write(response.content)
        print(f"Image downloaded to {image_path}")
    except requests.RequestException as e:
        print(f"Error downloading image from {image_url}: {e}")

if __name__ == "__main__":
    image_dump_dir = 'imageDump'
    ensure_directory_exists(image_dump_dir)

    # Process each ID passed as command-line arguments
    for id in sys.argv[1:]:
        fetch_and_process_data(id, image_dump_dir)
