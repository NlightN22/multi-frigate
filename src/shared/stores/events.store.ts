import { makeAutoObservable } from "mobx";

interface Filters {
    hostId?: string
    cameraId?: string
    period?: [Date | null, Date | null]
    startTime?: string
    endTime?: string
}

export class EventsStore {
    filters: Filters = {}

    constructor() {
        makeAutoObservable(this);
        this.loadFiltersFromURL();
    }

    loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        this.filters.hostId = params.get('hostId') || undefined;
        this.filters.cameraId = params.get('cameraId') || undefined;
        const startDate = params.get('startDate');
        const endDate = params.get('endDate');
        if (startDate && endDate) {
            this.filters.period = [new Date(startDate), new Date(endDate)]
        }
        this.filters.startTime = params.get('startTime') || undefined
        this.filters.endTime = params.get('endTime') || undefined
    }

    setHostId(hostId: string, navigate: (path: string) => void) {
        this.filters.hostId = hostId;
        this.updateURL(navigate)
    }

    setCameraId(cameraId: string, navigate: (path: string) => void) {
        this.filters.cameraId = cameraId;
        this.updateURL(navigate)
    }

    setPeriod(period: [Date | null, Date | null], navigate: (path: string) => void) {
        this.filters.period = period;
        this.updateURL(navigate)
    }

    setStartTime(startTime: string, navigate: (path: string) => void) {
        this.filters.startTime = startTime
        this.updateURL(navigate)
    }

    setEndTime(endTime: string, navigate: (path: string) => void) {
        this.filters.endTime = endTime
        this.updateURL(navigate)
    }

    updateURL(navigate: (path: string) => void) {
        const params = new URLSearchParams();
        if (this.filters.hostId) params.set('hostId', this.filters.hostId);
        if (this.filters.cameraId) params.set('cameraId', this.filters.cameraId);
        if (this.filters.period) {
            const [startDate, endDate] = this.filters.period;
            if (startDate instanceof Date && !isNaN(startDate.getTime())) {
                params.set('startDate', startDate.toISOString());
            }
            if (endDate instanceof Date && !isNaN(endDate.getTime())) {
                params.set('endDate', endDate.toISOString());
            }
        }

        if (this.filters.startTime) params.set('startTime', this.filters.startTime)
        if (this.filters.endTime) params.set('endTime', this.filters.endTime)

        navigate(`?${params.toString()}`);
    }

    isPeriodSet() {
        if (this.getStartDay() && this.getEndDay()) return true
        return false
    }

    getStartDay() {
        if (this.filters.period) {
            const [startDate, endDate] = this.filters.period;
            if (startDate instanceof Date && !isNaN(startDate.getTime())) {
                return startDate
            }
        }
        return null
    }

    getEndDay() {
        if (this.filters.period) {
            const [startDate, endDate] = this.filters.period;
            if (endDate instanceof Date && !isNaN(endDate.getTime())) {
                return endDate
            }
        }
        return null
    }

}