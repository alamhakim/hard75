function getDayOfWeek(date) {
    try {
        return date.getDay();
    } catch (error) {
        reportError(error);
        return 0;
    }
}

function addDays(date, days) {
    try {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
    } catch (error) {
        reportError(error);
        return date;
    }
}
