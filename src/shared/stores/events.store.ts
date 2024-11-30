import { makeAutoObservable } from "mobx";
import { eventsQueryParams } from "../../pages/EventsPage";
import { NavigateOptions } from "react-router-dom";

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
    }

    loadFiltersFromPage(
        paramHostId: string | undefined,
        paramCameraId: string | undefined,
        paramStartDate: string | undefined,
        paramEndDate: string | undefined,
        paramStartTime: string | undefined,
        paramEndTime: string | undefined) {
        this.filters.hostId = paramHostId
        this.filters.cameraId = paramCameraId
        if (paramStartDate && paramEndDate) {
            this.filters.period = [new Date(paramStartDate), new Date(paramEndDate)]
        }
        this.filters.startTime = paramStartTime
        this.filters.endTime = paramEndTime
    }

    setHostId(hostId: string, navigate: (path: string, options?: NavigateOptions) => void) {
        this.filters.hostId = hostId;
        this.updateURL(navigate)
    }

    setCameraId(cameraId: string, navigate: (path: string, options?: NavigateOptions) => void) {
        this.filters.cameraId = cameraId;
        this.updateURL(navigate)
    }

    setPeriod(period: [Date | null, Date | null], navigate: (path: string, options?: NavigateOptions) => void) {
        this.filters.period = period;
        this.updateURL(navigate)
    }

    setStartTime(startTime: string, navigate: (path: string, options?: NavigateOptions) => void) {
        this.filters.startTime = startTime
        this.updateURL(navigate)
    }

    setEndTime(endTime: string, navigate: (path: string, options?: NavigateOptions) => void) {
        this.filters.endTime = endTime
        this.updateURL(navigate)
    }

    updateURL(navigate: (path: string, options?: NavigateOptions) => void) {
        const params = new URLSearchParams();
        if (this.filters.hostId) params.set(eventsQueryParams.hostId, this.filters.hostId);
        if (this.filters.cameraId) params.set(eventsQueryParams.cameraId, this.filters.cameraId);
        if (this.filters.period) {
            const [startDate, endDate] = this.filters.period;
            if (startDate instanceof Date && !isNaN(startDate.getTime())) {
                params.set(eventsQueryParams.startDate, startDate.toISOString());
            }
            if (endDate instanceof Date && !isNaN(endDate.getTime())) {
                params.set(eventsQueryParams.endDate, endDate.toISOString());
            }
        }

        if (this.filters.startTime) params.set(eventsQueryParams.startTime, this.filters.startTime)
        if (this.filters.endTime) params.set(eventsQueryParams.endTime, this.filters.endTime)

        navigate(`?${params.toString()}`, { replace: true });
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