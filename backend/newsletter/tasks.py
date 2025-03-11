from crewai import Task
from datetime import datetime

class NewsletterTasks:
    def get_news_task(self, agent):
        return Task(
            description=( """
                Fetch the top {topic} news stories published within the last week. 
                Using the current time {time} as a reference, retrieve only the most impactful articles.
                Avoid any repeated calls or delegation loops by processing each article once. """
            ),
            agent=agent,
            async_execution=True,
            expected_output=("""
                A list of the top {topic} news stories with their titles, URLs, and a brief summary.\n
                Example Output:\n
                [\n
                    {{\n
                        'title': '',\n
                        'url': 'https://example.com/',\n
                        'summary': '',\n
                    }},\n
                    {{...}}\n
                ] """
            ),
        )

    def analyze_news_task(self, agent, context):
        return Task(
            description=("""
                Analyze each news story provided in the context. For exactly 9 articles, produce a detailed analysis that includes a succinct summary and a bulleted list of 5 key insights. 
                Format the analysis in markdown and include the article's title and source URL as context. 
                Ensure that the process is executed in a single pass without initiating additional recursive calls.
             """
            ),
            agent=agent,
            async_execution=False,
            context=context,
             expected_output=("""
                For each of the 5 news stories, output a markdown section that includes:\n
                - The article title and source URL\n
                - A concise summary of the article\n
                - A bulleted list of 5 key points highlighting the insights\n
                Ensure the markdown is clean and ready for newsletter integration."""  
            ),
        )

    def compile_newsletter(self, agent, context, callback_function):
        return Task(
            description=("""
                Compile the analyzed news articles into a cohesive, polished newsletter in markdown. 
                The newsletter should start with a clear header introducing the {topic}, followed by 5 distinct sections—each dedicated to one article. 
                Each section must include the article's title, the summarized content, 5 key bullet points, and the source URL. 
                Ensure that the markdown is generated in one single pass,with no recursive delegation or '```' characters."""
                
            ),
            agent=agent,
            context=context,
            callback=callback_function,
            expected_output=("""
                A final markdown newsletter that includes:\n
                1. A header for the {topic} newsletter\n
                2. For each of the 5 articles:\n
                   - The article title\n
                   - A concise summary\n
                   - A bulleted list of 5 key insights\n
                   - The source URL\n
                Important Note:
                1) The final output should not contain "```" (backticks) characters.\n
                2) The newsletter should be visually appealing and easy to read.\n"""
            ),
        )
