import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Event } from '../types/event'

interface EventFormProps {
  date: Date
  onSave: (event: Event) => void
  onCancel: () => void
  event?: Event | null
}

const EventForm: React.FC<EventFormProps> = ({ date, onSave, onCancel, event }) => {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (event) {
      setName(event.name)
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setDescription(event.description || '')
    } else {
      setName('')
      setStartTime('')
      setEndTime('')
      setDescription('')
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEvent: Event = {
      id: event?.id || Date.now().toString(),
      date: date.toISOString(),
      name,
      startTime,
      endTime,
      description
    }
    onSave(newEvent)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <Input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{event ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}

export default EventForm

