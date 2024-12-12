'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EventForm from './EventFrom'
import EventList from './EventList'
import { Event } from '../types/event'

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEventList, setShowEventList] = useState(false)
  const [filter, setFilter] = useState('')
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setShowEventList(true)
  }

  const handleAddEvent = () => {
    if (selectedDate) {
      setEditingEvent(null)
      setShowEventForm(true)
    }
  }

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      const newEvents = events.map(e => e.id === editingEvent.id ? event : e)
      setEvents(newEvents)
    } else {
      setEvents([...events, event])
    }
    setShowEventForm(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = (eventToDelete: Event) => {
    const newEvents = events.filter(event => event.id !== eventToDelete.id)
    setEvents(newEvents)
  }

  const handleEditEvent = (eventToEdit: Event) => {
    setEditingEvent(eventToEdit)
    setShowEventForm(true)
  }

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(filter.toLowerCase()) ||
    event.description?.toLowerCase().includes(filter.toLowerCase())
  )

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isCurrentDay = date.toDateString() === new Date().toDateString()
      const isSelectedDay = selectedDate && date.toDateString() === selectedDate.toDateString()
      const dayEvents = events.filter(event => new Date(event.date).toDateString() === date.toDateString())

      days.push(
        <Button
          key={day}
          variant={isSelectedDay ? "default" : "outline"}
          className={`h-20 ${isCurrentDay ? 'bg-blue-100' : ''} ${day % 7 === 0 || day % 7 === 1 ? 'bg-gray-100' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="flex flex-col items-center">
            <span>{day}</span>
            {dayEvents.length > 0 && (
              <span className="text-xs mt-1 bg-blue-500 text-white rounded-full px-2">
                {dayEvents.length}
              </span>
            )}
          </div>
        </Button>
      )
    }

    return days
  }

  // Get events for the selected date
  const getSelectedDateEvents = () => {
    return selectedDate 
      ? events.filter(event => new Date(event.date).toDateString() === selectedDate.toDateString())
      : []
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePrevMonth}>&lt; Previous</Button>
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <Button onClick={handleNextMonth}>Next &gt;</Button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold">{day}</div>
          ))}
          {renderCalendar()}
        </div>
        <div className="mt-4">
          <Button onClick={handleAddEvent} disabled={!selectedDate}>Add Event</Button>
        </div>
        {showEventForm && selectedDate && (
          <EventForm
            date={selectedDate}
            onSave={handleSaveEvent}
            onCancel={() => {
              setShowEventForm(false)
              setEditingEvent(null)
            }}
            event={editingEvent}
            existingEvents={getSelectedDateEvents()}
          />
        )}
        {showEventList && selectedDate && (
          <EventList
            date={selectedDate}
            events={filteredEvents.filter(event => new Date(event.date).toDateString() === selectedDate.toDateString())}
            onClose={() => setShowEventList(false)}
            onDelete={handleDeleteEvent}
            onEdit={handleEditEvent}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default Calendar