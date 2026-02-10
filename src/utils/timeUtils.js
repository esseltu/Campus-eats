const dayMap = {
    'sun': 0, 'sunday': 0,
    'mon': 1, 'monday': 1,
    'tue': 2, 'tuesday': 2,
    'wed': 3, 'wednesday': 3,
    'thu': 4, 'thursday': 4,
    'fri': 5, 'friday': 5,
    'sat': 6, 'saturday': 6
};

// Helper to check if spot is open based on openHours string "HH:MM - HH:MM" and daysOpen string
export const isOpenNow = (openHours, daysOpen, dateObj = new Date()) => {
    if (!openHours) return false;

    // Clean inputs (remove quotes if present)
    const cleanHours = openHours.replace(/['"]/g, '').trim();
    const cleanDays = daysOpen ? daysOpen.replace(/['"]/g, '').trim() : null;

    const now = dateObj;
    
    // 1. Check Days first
    if (cleanDays && cleanDays !== 'Daily') {
        const today = now.getDay(); // 0 = Sunday, 1 = Monday, ...
        const normalizedDays = cleanDays.toLowerCase();
        
        if (normalizedDays.includes('-')) {
            const [startStr, endStr] = normalizedDays.split('-').map(d => d.trim());
            // Extract first 3 chars to match map keys if needed, but map has full names too
            const startKey = Object.keys(dayMap).find(key => startStr.startsWith(key));
            const endKey = Object.keys(dayMap).find(key => endStr.startsWith(key));
            
            if (startKey && endKey) {
                const start = dayMap[startKey];
                const end = dayMap[endKey];
                
                if (start <= end) {
                    // Standard range: Mon - Fri (1 - 5)
                    if (today < start || today > end) return false;
                } else {
                    // Wrap around: Fri - Mon (5 - 1) -> 5,6,0,1
                    // Open if today >= start (5,6) OR today <= end (0,1)
                    if (today < start && today > end) return false;
                }
            }
        }
    }

    // 2. Check Time
    try {
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHours * 60 + currentMinutes;

        const [start, end] = cleanHours.split('-').map(t => t.trim());
        if (!start || !end) return false;

        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;

        return currentTime >= startTime && currentTime <= endTime;
    } catch (e) {
        console.error("Error parsing hours:", e);
        return false;
    }
};
