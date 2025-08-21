import { cartReducer, addItem, removeItem, clear } from './cartSlice';

const initialState = { items: [] as Array<{flightId:string; seat:string; price:number}> };

test('addItem adds a ticket', () => {
    const next = cartReducer(initialState, addItem({ flightId: 'FL001', seat: '1A', price: 300 }));
    expect(next.items).toHaveLength(1);
    expect(next.items[0]).toEqual({ flightId: 'FL001', seat: '1A', price: 300 });
});

test('addItem does not duplicate the same seat on the same flight', () => {
    const s1 = cartReducer(initialState, addItem({ flightId: 'FL001', seat: '1A', price: 300 }));
    const s2 = cartReducer(s1, addItem({ flightId: 'FL001', seat: '1A', price: 300 }));
    expect(s2.items).toHaveLength(1);
});

test('removeItem removes only target ticket', () => {
    const s1 = {
        items: [
            { flightId: 'FL001', seat: '1A', price: 300 },
            { flightId: 'FL001', seat: '1B', price: 300 },
        ],
    };
    const s2 = cartReducer(s1, removeItem({ flightId: 'FL001', seat: '1A' }));
    expect(s2.items).toHaveLength(1);
    expect(s2.items[0].seat).toBe('1B');
});

test('clear empties the cart', () => {
    const s1 = { items: [{ flightId: 'FL001', seat: '1A', price: 300 }] };
    const s2 = cartReducer(s1, clear());
    expect(s2.items).toHaveLength(0);
});
