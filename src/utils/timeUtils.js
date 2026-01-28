// Helper to check if spot is open based on openHours string "HH:MM - HH:MM"
export const isOpenNow = (openHours) => {
    if (!openHours) return false;
    try {
        const [start, end] = openHours.split('-').map(t => t.trim());
        if (!start || !end) return false;

        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHours * 60 + currentMinutes;

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
