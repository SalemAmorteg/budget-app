// shared/utils/dateFormat.ts
import { format, formatDistance, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
export function formatDate(date, pattern = 'dd-MMM-yyyy') {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern, { locale: es });
}
export function formatShortDate(date) {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isToday(dateObj))
        return 'Today';
    if (isTomorrow(dateObj))
        return 'Tomorrow';
    return format(dateObj, 'dd MMM', { locale: es });
}
export function formatRelativeDate(date) {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es });
}
export function getDateRange(startDate, endDate) {
    return `${formatDate(startDate, 'dd MMM')} - ${formatDate(endDate, 'dd MMM yyyy')}`;
}
