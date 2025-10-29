import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookState = {
    bookItems: BookingItem[]
}

const initialState: BookState = {
    bookItems: []
}

export const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        addBooking: (state, action: PayloadAction<BookingItem>) => {
            const payload = action.payload;
            const idx = state.bookItems.findIndex((item: BookingItem) =>
                item.venue === payload.venue &&
                item.bookDate === payload.bookDate
            );

            if (idx !== -1) {
                state.bookItems[idx] = payload;
            } else {
                state.bookItems.push(payload);
            }
        },
        removeBooking: (state, action: PayloadAction<BookingItem>) => {
            const remainItems = state.bookItems.filter((obj: BookingItem) => {
                return !(
                    obj.nameLastname === action.payload.nameLastname &&
                    obj.tel === action.payload.tel &&
                    obj.venue === action.payload.venue &&
                    obj.bookDate === action.payload.bookDate
                );
            });
            state.bookItems = remainItems;
        }
    }
})

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer