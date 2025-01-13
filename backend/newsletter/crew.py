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
llm = ChatOpenAI(temperature=0, model="gpt-4o-mini", api_key=OPENAI_API_KEY)  # gpt-4 preferred

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


# Define tasks
get_news_task = tasks.get_news_task(get_news_agents)
analyze_news_task = tasks.analyze_news_task(news_analyzer, [get_news_task])
compile_newsletter_task = tasks.compile_newsletter(
    compiler,
    [analyze_news_task],
    callback_function=None  # We'll handle this dynamically
)

# Initialize Crew process
crew = Crew(
    agents=[editor, get_news_agents, news_analyzer, compiler],
    tasks=[get_news_task, analyze_news_task, compile_newsletter_task],
    process=Process.hierarchical,
    manager_llm=llm,
)


def start_crew(topic: str):
    # Define dynamic inputs
    inputs = {'topic': topic, 'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

    # Update the callback function for the compile task dynamically
    compile_newsletter_task.callback = lambda content: save_with_topic(content, inputs)

    # Pass the topic dynamically using crew.kickoff()
    results = crew.kickoff(inputs=inputs)
    print(results)
    return results




