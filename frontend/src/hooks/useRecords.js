import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'nexus-records'

const SEED_DATA = [
  { id: '1', name: 'Alice Johnson', category: 'Research', status: 'Active', date: '2024-01-15', description: 'Lead researcher on quantum computing project.' },
  { id: '2', name: 'Bob Martinez', category: 'Operations', status: 'Pending', date: '2024-02-03', description: 'Overseeing supply chain optimization.' },
  { id: '3', name: 'Carol White', category: 'Finance', status: 'Active', date: '2024-02-10', description: 'Q1 budget analysis and forecasting.' },
  { id: '4', name: 'David Kim', category: 'Research', status: 'Closed', date: '2024-01-28', description: 'Machine learning model evaluation.' },
  { id: '5', name: 'Eva Singh', category: 'Operations', status: 'Active', date: '2024-03-01', description: 'Logistics and distribution optimization.' },
  { id: '6', name: 'Frank Lee', category: 'HR', status: 'Pending', date: '2024-03-05', description: 'Onboarding program redesign initiative.' },
  { id: '7', name: 'Grace Chen', category: 'Finance', status: 'Active', date: '2024-03-10', description: 'Investment portfolio rebalancing.' },
  { id: '8', name: 'Henry Park', category: 'HR', status: 'Active', date: '2024-03-12', description: 'Performance review cycle coordination.' },
  { id: '9', name: 'Isla Turner', category: 'Research', status: 'Pending', date: '2024-03-15', description: 'Market expansion feasibility study.' },
  { id: '10', name: 'James Wilson', category: 'Operations', status: 'Closed', date: '2024-02-20', description: 'Vendor contract renegotiation completed.' },
]

export function useRecords() {
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA))
      return SEED_DATA
    } catch {
      return SEED_DATA
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  const addRecord = useCallback((data) => {
    const newRecord = {
      ...data,
      id: Date.now().toString(),
      date: data.date || new Date().toISOString().split('T')[0],
    }
    setRecords(prev => [newRecord, ...prev])
    return newRecord
  }, [])

  const updateRecord = useCallback((id, data) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...data } : r))
  }, [])

  const deleteRecord = useCallback((id) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  }, [])

  const getRecord = useCallback((id) => {
    return records.find(r => r.id === id)
  }, [records])

  return { records, addRecord, updateRecord, deleteRecord, getRecord }
}
