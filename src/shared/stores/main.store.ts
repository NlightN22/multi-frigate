import { makeAutoObservable } from "mobx";
import { NavigateOptions } from "react-router-dom";
import { mainPageParams } from "../../pages/MainPage";
import { isProduction } from "../env.const";


interface Filters {
    hostId?: string | null
    searchQuery?: string | null
    selectedTags: string[]
}

export class MainStore {
    filters: Filters = { selectedTags: []}

    constructor() {
        makeAutoObservable(this)
    }

    loadFiltersFromPage(filters: Filters) {
        if (!isProduction) console.log('MainPage load filters')
        this.filters = filters
    }

    updateURL(navigate: (path: string, options?: NavigateOptions) => void) {
        const params = new URLSearchParams();
        if (this.filters.hostId) params.set(mainPageParams.hostId, this.filters.hostId);
        if (this.filters.searchQuery) params.set(mainPageParams.searchQuery, this.filters.searchQuery);
        if (this.filters.selectedTags) {
            const serializedTags = this.filters.selectedTags.join(",")
            params.set(mainPageParams.selectedTags, serializedTags);
        }
        navigate(`?${params.toString()}`, { replace: true });
    }

    setHostId(hostId: string, navigate: (path: string, options?: NavigateOptions) => void) {
        this.filters.hostId = hostId;
        this.updateURL(navigate)
    }

    setSearchQuery(searchQuery: string, navigate: (path: string, options?: NavigateOptions) => void) {
        this.filters.searchQuery = searchQuery;
        this.updateURL(navigate)
    }

    setSelectedTags(selectedTags: string[], navigate: (path: string, options?: NavigateOptions) => void) {
        if (!isProduction) console.log('MainPage set filters.selectedTags ', selectedTags)
        this.filters.selectedTags = selectedTags ? selectedTags : []
        this.updateURL(navigate)
    }

    getArrayParam = (key: string): string[] => {
        const searchParams = new URLSearchParams(window.location.search);
        const paramValue = searchParams.get(key);
        return paramValue ? paramValue.split(",") : [];
    }
}