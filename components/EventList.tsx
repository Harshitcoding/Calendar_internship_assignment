import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Event } from '../types/event'

interface EventListProps {
  date: Date
  events: Event[]
  onClose: () => void
  onDelete: (event: Event) => void
  onEdit: (event: Event) => void
}

const EventList: React.FC<EventListProps> = ({ date, events, onClose, onDelete, onEdit }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Events for {date.toDateString()}</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          <ul className="space-y-2">
            {events.map(event => (
              <li key={event.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{event.name}</h3>
                  <p>{event.startTime} - {event.endTime}</p>
                  {event.description && <p className="text-sm text-gray-500">{event.description}</p>}
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => onEdit(event)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(event)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button onClick={onClose} className="mt-4">Close</Button>
      </CardContent>
    </Card>
  )
}

export default EventList

