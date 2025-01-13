from crewai import Agent
from newsletter.tools.search_tools import SearchTool


class NewsletterAgents:
    def editor_agent(self):
        return Agent(
            role="Editor",
            goal="Ensures the quality of the {topic} newsletter",
            backstory="""You ensure the newsletter is engaging and informative for viewers""",
            allow_delegation=True,
            verbose=True,
            max_iter=5,
        )

    def get_news_agent(self):
        return Agent(
            role="Automated News Fetcher",
            goal="You will retrieve the top {topic} news stories for the day.",
            backstory="""You will look for the most impactful articles about {topic}.""",
            tools=[SearchTool.search_google],
            verbose=True,
            memory=True,
            allow_delegation=True,
        )

    def analyze_news(self):
        return Agent(
            role="News Analyst for {topic}",
            goal="You will analyze the {topic} news stories making them engaging and explain them in a way that is accessible to nontechnical audiences formatted in markdown.",
            backstory="""
                        Your role is to analyze the research,
					analysis, and strategic insights.
                    """,
            tools=[SearchTool.search_google],
            verbose=True,
            allow_delegation=True,
        )

    def newsletter_compiler(self):
        return Agent(
            role="Newsletter Compiler",
            goal="Compile the simplified news stories into a final newsletter format.",
            backstory="""Arrange the stories in a visually appealing newsletter format.""",
            verbose=True,
            allow_delegation=True,
        )
