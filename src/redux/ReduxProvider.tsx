"use client";
import { Provider as ReactReduxProvider } from "react-redux";
import { store } from "./store"
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
export default function ReduxProvider({ children }: { children: React.ReactNode }) {

    let reduxPersister = persistStore(store)
    return (
        <ReactReduxProvider store={store}>
            <PersistGate loading={null} persistor={reduxPersister}>
                {children}
            </PersistGate>
        </ReactReduxProvider>
    )
}