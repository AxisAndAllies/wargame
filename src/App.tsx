import React, { useState, ReactChild } from 'react'
import { Box, Flex, Button, Badge, ThemeProvider } from 'theme-ui'
import CombatModal from './components/CombatModal'
import { UnitType, Descript, NumMap } from './game/data'
import mockExports from './game/driver'
import theme from './theme'
import { Map } from './components/Map'

interface AppProps {}

function App({}: AppProps) {
    // Create the count state.
    // const [count, setCount] = useState(0)
    // // Create the counter (+1 every second).
    // useEffect(() => {
    //     const timer = setTimeout(() => setCount(count + 1), 1000)
    //     return () => clearTimeout(timer)
    // }, [count, setCount])

    return (
        <div className="App" style={{ height: '100vh' }}>
            {/* <CombatModal originalCombat={mockExports.mockCombat} /> */}
            <Map />
        </div>
    )
}
export default () => (
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
)
