import os
from dotenv import load_dotenv
from datetime import datetime

from newsletter.agents import NewsletterAgents
from newsletter.tasks import NewsletterTasks
from crewai import Crew, Process

from langchain_openai import ChatOpenAI
from newsletter.tools.save_file import save_file

# Load environment variables
load_dotenv()

# Initialize agents and tasks
agents = NewsletterAgents()
tasks = NewsletterTasks()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
llm = ChatOpenAI(temperature=0, model="gpt-4o", api_key=OPENAI_API_KEY)  # gpt-4 or 4o preferred

# Define agents
editor = agents.editor_agent()
get_news_agents = agents.get_news_agent()
news_analyzer = agents.analyze_news()
compiler = agents.newsletter_compiler()


def save_with_topic(content, inputs):
    """
    Save the file dynamically using the topic from inputs.
    """
    topic = inputs.get('topic', 'newsletter')
    save_file(content, topic=topic)


def start_crew(topic: str):
    # Define dynamic inputs
    inputs = {'topic': topic, 'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

    # Ensure fresh instances of tasks (to avoid stale context)
    get_news_task = tasks.get_news_task(get_news_agents)
    analyze_news_task = tasks.analyze_news_task(news_analyzer, [get_news_task])
    compile_newsletter_task = tasks.compile_newsletter(
        compiler,
        [analyze_news_task],
        callback_function=lambda content: save_with_topic(content, inputs),
    )

    # Create a new Crew instance for every request
    crew = Crew(
        agents=[editor, get_news_agents, news_analyzer, compiler],
        tasks=[get_news_task, analyze_news_task, compile_newsletter_task],
        process=Process.hierarchical,
        manager_llm=llm,  # Ensure this is a plain LLM instance, not an agent with tools
    )

    # Run Crew with fresh tasks
    print(f"Calling run with topic: {topic}")
    results = crew.kickoff(inputs=inputs)
    print(results)
    return results





