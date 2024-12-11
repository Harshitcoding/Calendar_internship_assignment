export function generateCalendarDays(month: number, year: number) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days = []
    const startPadding = firstDay.getDay()
    
    // Add padding days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const paddingDate = new Date(year, month, -i)
      days.push({ date: paddingDate, isPadding: true })
    }
    
    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isPadding: false })
    }
    
    // Add padding days for next month to complete the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isPadding: true })
    }
    
    return days
  }
  
  export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  