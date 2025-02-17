from crewai import Agent, Task, Crew, Process
from langchain_community.tools import DuckDuckGoSearchRun
import os
from pydantic import Field

os.environ['LITELLM_LOG'] = 'DEBUG'
os.environ['api_base']="http://localhost:11434/v1"
from crewai.tools import BaseTool
import litellm
#litellm._turn_on_debug()




class Search(BaseTool):
    """Search the web for information on a given topic"""
    name: str = "Search"
    description: str = "Useful for search-based queries. Use this to find current information about markets, companies, and trends."
    search: DuckDuckGoSearchRun = Field(default_factory=DuckDuckGoSearchRun)

    def _run(self, query: str) -> str:
        """Execute the search query and return results"""
        try:
            return self.search.run(query)
        except Exception as e:
            return f"Error performing search: {str(e)}"

search = Search()

# Configure local models
os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"  # Ollama endpoint
os.environ["OPENAI_MODEL_NAME"] = "deepseek-r1:1.5b"  # Default model for agents
os.environ["OPENAI_API_KEY"] = "your_openai_api_key_here"

# Configure Agents
# 1. Image Classifier Agent (to check if the image is an animal)

classifier_agent = Agent(role="Image Classifier Agent",
    goal="Determine if the image is of an animal or not",
    backstory=""" You have an eye for animals! Your job is to identify whether the input image is of an animal or something else.""",
    llm='ollama/llava:latest')

# 2. Animal Description Agent (to describe the animal in the image)

description_agent = Agent(role="Animal Description Agent {image_path}",
    goal="Describe the animal in the image",
    backstory="""You love nature and animals. Your task is to describe any animal based on an image.""",
    llm='ollama/llava:latest')

# 3. Information Retrieval Agent (to fetch additional info about the animal)

info_agent = Agent(role="Information Agent",
    goal="Give compelling information about a certain animal",
    backstory="""You are very good at telling interesting facts. You don't give any wrong information if you don't know it.""",
    llm='openai/llama3.2:1b')

# Define Interactive Tasks
story_task = Task(
    description="Classify the image ({image_path}) and tell me if it's an animal.",
    expected_output="If it's an animal, say 'animal'; otherwise, say 'not an animal",
    agent=classifier_agent
)

verification_task = Task(
    description="Describe the animal in the image.({image_path})",
    expected_output="Give a detailed description of the animal.",
    agent=description_agent
)
info_task = Task(
    description="Give additional information about the described animal.",
    expected_output="Provide at least 5 interesting facts or information about the animal.",
    agent=info_agent
)

# Configure Crew with Continuous Process

debate_crew = Crew(
    agents=[classifier_agent, description_agent, info_agent],
    tasks=[story_task, verification_task, info_task],
    verbose=True
)

result = debate_crew.kickoff(inputs={'image_path': 'raccoon.jpeg'})
