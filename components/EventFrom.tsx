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
  existingEvents: Event[]
}

const EventForm: React.FC<EventFormProps> = ({ 
  date, 
  onSave, 
  onCancel, 
  event, 
  existingEvents 
}) => {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

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

  const isTimeOverlap = (newStartTime: string, newEndTime: string) => {
    return existingEvents.some(existingEvent => {
      // Skip comparison if we're editing the same event
      if (event && existingEvent.id === event.id) return false;

      // Convert times to minutes for easy comparison
      const newStart = timeToMinutes(newStartTime)
      const newEnd = timeToMinutes(newEndTime)
      const existingStart = timeToMinutes(existingEvent.startTime)
      const existingEnd = timeToMinutes(existingEvent.endTime)

      // Check for overlap
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      )
    })
  }

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate end time is after start time
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      setError('End time must be after start time')
      return
    }

    // Check for time conflicts
    if (isTimeOverlap(startTime, endTime)) {
      setError('This time slot conflicts with an existing event')
      return
    }

    const newEvent: Event = {
      id: event?.id || Date.now().toString(),
      date: date.toISOString(),
      name,
      startTime,
      endTime,
      description
    }
    
    // Clear any previous errors
    setError('')
    onSave(newEvent)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded mb-4">
          {error}
        </div>
      )}
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