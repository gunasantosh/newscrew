import os

def save_file(content, topic="newsletter", file_extension=".md"):
    """
    Save the content to a file dynamically named based on the topic.

    Args:
        content (str): The content to save to the file.
        topic (str): The topic name used as the base file name.
        file_extension (str): The file extension (default is .md).
    """
    directory = "output"
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Replace spaces and special characters in the topic to create a valid filename
    sanitized_topic = "".join(char if char.isalnum() else "_" for char in topic)
    file_name = f"{sanitized_topic}{file_extension}"

    file_path = os.path.join(directory, file_name)
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content.__str__())

    print(f"File saved to: {file_path}")
