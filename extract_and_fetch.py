import os
import re
import requests

# Function to extract IDs from text
def extract_ids(text):
    # This regex might need to be adjusted based on how the IDs are formatted
    return re.findall(r'\b\d+\b', text)

# Function to fetch data for an ID
def fetch_data_for_id(id):
    url = f"https://www.minecraft.net/bin/minecraft/productmanagement.productdetails.json?id={id}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data for ID {id}")
        return None

# Main logic
def main():
    # Example text, replace with dynamic fetching from GitHub issue/comment
    issue_text = "Example issue body with IDs: 12345, 67890."
    ids = extract_ids(issue_text)

    for id in ids:
        data = fetch_data_for_id(id)
        if data:
            # Process your data here, including downloading images
            print(data) # Placeholder for demonstration

if __name__ == "__main__":
    main()
