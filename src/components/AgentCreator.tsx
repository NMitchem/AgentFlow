import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AnimatedCard, StaggeredContainer } from '@/components/layout/dashboard-layout'
import { motion } from 'framer-motion'

interface Model {
  id: string
  name: string
}

export function AgentCreator() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    role: '',
    goal: '',
    backstory: '',
    model: ''
  })

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data.map((m: string) => ({ id: m, name: m }))))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (response.ok) {
      alert('Agent created successfully!')
      setFormData({ role: '', goal: '', backstory: '', model: '' })
    }
  }

  return (
    <AnimatedCard>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-semibold">Create New Agent</h2>
          <p className="text-gray-600 mt-1">Configure your AI agent's parameters</p>
        </div>

        <StaggeredContainer>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Agent Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="Data Analyst"
                />
              </div>
              
              <div>
                <Label>Model Selection</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({...formData, model: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Agent Configuration</Label>
              <textarea
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                placeholder="Primary objectives and goals..."
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Deploy Agent
            </Button>
          </motion.div>
        </StaggeredContainer>
      </div>
    </AnimatedCard>
  )
} 