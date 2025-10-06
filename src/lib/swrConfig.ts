import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 2000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    loadingTimeout: 10000,
    refreshInterval: 0,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    fallbackData: undefined,
    compare: (a, b) => {
        if (a === b) return true;
        if (!a || !b) return false;
        return JSON.stringify(a) === JSON.stringify(b);
    },
};
