import asyncio
import logging
import uuid
from fastapi import FastAPI, WebSocket, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

from crewai import Agent, Task, Crew


def get_available_models():
    """Query Ollama for available models"""
    from ollama import Client
    client = Client(host='http://localhost:11434')
    return [model['model'] for model in client.list()['models']]

app = FastAPI()

# Request data models
class AgentConfig(BaseModel):
    role: str
    goal: str
    backstory: str
    model: str

class TaskConfig(BaseModel):
    description: str
    expected_output: str
    agent_id: str

class CrewConfig(BaseModel):
    name: str
    agent_ids: List[str]
    task_ids: List[str]
    process: str = "sequential"
    inputs: Dict[str, str] = {}

# Execution status model and in-memory stores
class ExecutionState(BaseModel):
    status: str = "pending"
    output: Optional[str] = None
    error: Optional[str] = None

active_crews: Dict[str, ExecutionState] = {}
agent_templates: Dict[str, Agent] = {}
task_templates: Dict[str, Task] = {}

@app.get("/models")
def get_models():
    return get_available_models()

@app.post("/agents")
def create_agent(config: AgentConfig):
    agent = Agent(
        role=config.role,
        goal=config.goal,
        backstory=config.backstory,
        llm=config.model
    )
    agent_id = str(uuid.uuid4())
    agent_templates[agent_id] = agent
    return {"id": agent_id}

@app.post("/tasks")
def create_task(task: TaskConfig):
    if task.agent_id not in agent_templates:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent = agent_templates[task.agent_id]
    task_instance = Task(
        description=task.description,
        expected_output=task.expected_output,
        agent=agent
    )
    task_id = str(uuid.uuid4())
    task_templates[task_id] = task_instance
    return {"id": task_id}

@app.post("/crews/execute")
async def execute_crew(crew: CrewConfig):
    crew_id = str(uuid.uuid4())
    active_crews[crew_id] = ExecutionState(status="running")
    try:
        agents = [agent_templates[a_id] for a_id in crew.agent_ids]
        tasks = [task_templates[t_id] for t_id in crew.task_ids]
        crew_instance = Crew(
            agents=agents,
            tasks=tasks,
            process=crew.process,
            verbose=True
        )
        result = await crew_instance.kickoff(inputs=crew.inputs)
        active_crews[crew_id].status = "completed"
        active_crews[crew_id].output = result
    except Exception as e:
        logging.exception("Error executing crew:")
        active_crews[crew_id].status = "error"
        active_crews[crew_id].error = str(e)
    return {"crew_id": crew_id}

@app.get("/crews/{crew_id}")
def get_crew_status(crew_id: str):
    state = active_crews.get(crew_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Crew not found")
    return state

@app.websocket("/crew-updates/{crew_id}")
async def websocket_endpoint(websocket: WebSocket, crew_id: str):
    await websocket.accept()
    try:
        while True:
            state = active_crews.get(crew_id)
            if state is None:
                await websocket.send_json({"error": "Crew not found"})
                break
            await websocket.send_json({
                "status": state.status,
                "output": state.output,
                "error": state.error
            })
            await asyncio.sleep(1)
    except Exception as e:
        logging.error("WebSocket error", exc_info=e)
        await websocket.close()