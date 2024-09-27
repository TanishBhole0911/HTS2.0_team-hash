'use client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from '../features/store'
import { store } from '../features/store'

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}