# AgentFlow

![alt text](https://imgur.com/a/k3BVfFt)


Open-source platform for building and orchestrating AI agent workflows through a visual interface. Create agent teams, define tasks, and monitor execution in real-time.

## Features

- Visual agent/task creation interface
- Sequential and parallel process orchestration
- Real-time execution monitoring
- Local model integration via Ollama
- Interactive demo workflow

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Ollama running locally

### Installation

1. **Backend Setup**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

2. **Frontend Setup**
```bash
npm install
npm run dev
```

3. **Access UI**
```bash
http://localhost:3000
```

## Core Components

### Agent Creation
Define agents with specific roles and capabilities:
```typescript
const [formData, setFormData] = useState({
  role: '',
  goal: '',
  backstory: '',
  model: ''
});
```

### Workflow Orchestration
Create task sequences through the UI or JSON configuration:
```python
debate_crew = Crew(
  agents=[classifier_agent, description_agent, info_agent],
  tasks=[story_task, verification_task, info_task],
  verbose=True
)
```

### Demo Flow
Test the animal analysis workflow:

## Development

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Start development servers:
```bash
# Backend
uvicorn backend.main:app --reload --port 8000

# Frontend
npm run dev
```

## License

MIT License - see LICENSE for details
