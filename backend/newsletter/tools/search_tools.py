import os
import json

import requests
from langchain.tools import tool


class SearchTool:
    @tool("Search the internet")
    def search_google(query: str):
        """Searches the internet for relevant AI articles."""
        url = "https://google.serper.dev/search"
        payload = json.dumps({"q": query, "num": 5, "tbm": "nws"})
        headers = {
            "X-API-KEY": os.environ.get("SERPER_API_KEY"),
            "content-type": "application/json",
        }
        response = requests.request("POST", url, headers=headers, data=payload)

        if "organic" not in response.json():
            return "Not able to find anything about that topic"
        else:
            results = response.json()["organic"]
            string = []

            for result in results[:5]:
                try:
                    date = result.get("date", "Date is not available.")
                    string.append(
                        "\n".join(
                            [
                                f"Title: {result['title']}",
                                f"Link: {result['link']}",
                                f"Date: {date}",
                                f"Snippet: {result['snippet']}",
                                "\n -----------",
                            ]
                        )
                    )
                except KeyError:
                    next

            return "\n".join(string)
