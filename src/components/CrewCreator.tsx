import React, { useState } from 'react';
import { Input, MultiSelect, Button } from '@/components/ui/input';
import CodeEditor from '@monaco-editor/react';

interface Agent {
  id: string;
  role: string;
  // Add other agent properties as needed
}

interface Task {
  id: string;
  description: string;
  // Add other task properties as needed
}

interface CrewConfig {
  name: string;
  agentIds: string[];
  taskIds: string[];
  process: string;
  inputs: Record<string, string>;
}

export function CrewCreator({ agents, tasks }: { agents: Agent[], tasks: Task[] }) {
  const [config, setConfig] = useState<CrewConfig>({
    name: '',
    agentIds: [],
    taskIds: [],
    process: 'sequential',
    inputs: {}
  });

  const handleExecute = async () => {
    const response = await fetch('/api/crews/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    
    if (response.ok) {
      const { crew_id } = await response.json();
      // Open WebSocket connection for real-time updates
      const ws = new WebSocket(`ws://localhost:8000/crew-updates/${crew_id}`);
      ws.onmessage = (event) => {
        console.log('Crew update:', event.data);
      };
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Create Crew</h3>
      <div className="space-y-4">
        <Input 
          placeholder="Crew Name" 
          value={config.name}
          onChange={e => setConfig({...config, name: e.target.value})}
        />
        
        <MultiSelect
          label="Agents"
          options={agents.map(a => ({ value: a.id, label: a.role }))}
          selected={config.agentIds}
          onChange={ids => setConfig({...config, agentIds: ids})}
        />
        
        <MultiSelect
          label="Tasks"
          options={tasks.map(t => ({ value: t.id, label: t.description }))}
          selected={config.taskIds}
          onChange={ids => setConfig({...config, taskIds: ids})}
        />
        
        <CodeEditor 
          height="300px"
          defaultLanguage="json"
          value={JSON.stringify(config, null, 2)}
          onChange={value => setConfig(JSON.parse(value || '{}'))}
        />
        
        <Button onClick={handleExecute}>Execute Crew</Button>
      </div>
    </div>
  );
} 