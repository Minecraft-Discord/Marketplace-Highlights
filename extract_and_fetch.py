import os
import requests

# Ensure the imageDump directory exists
image_dump_dir = 'imageDump'
os.makedirs(image_dump_dir, exist_ok=True)

# Function to fetch data for an ID and download images
def fetch_data_and_download_images(id):
    url = f"https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id={id}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        images = data.get('images', [])
        
        for image in images:
            image_url = image.get('url')
            if image_url:
                download_image(image_url, image_dump_dir)
    else:
        print(f"Failed to fetch data for ID {id}")

# Function to download image
def download_image(image_url, download_dir):
    try:
        response = requests.get(image_url)
        if response.status_code == 200:
            image_filename = image_url.split('/')[-1]
            image_path = os.path.join(download_dir, image_filename)
            with open(image_path, 'wb') as f:
                f.write(response.content)
            print(f"Image downloaded to {image_path}")
        else:
            print(f"Failed to download image from {image_url}")
    except Exception as e:
        print(f"Error downloading image from {image_url}: {e}")

# Main logic
def main():
    # Placeholder for ID, replace with dynamic fetching
    id = "7c5e4fcf-8a53-47e0-833e-845b1b749709"
    fetch_data_and_download_images(id)

if __name__ == "__main__":
    main()
