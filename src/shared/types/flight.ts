export type Flight = {
    id: string;
    airline: string;
    from: string;
    to: string;
    departureTime?: string;
    arrivalTime?: string;
    price: number;
    terminal?: string;
    gate?: string;
    tickets?: { total?: number; remaining?: number };
};
