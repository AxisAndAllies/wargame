import { settings } from 'cluster'
import React, { useState, useEffect, ReactChild } from 'react'
import { flex } from 'styled-system'
import { Box, Flex, ThemeProvider } from 'theme-ui'
//@ts-ignore
import theme from './theme'

interface AppProps {}

const Cell = ({ children }: { children: ReactChild }) => {
    const clickHandler = (e: MouseEvent) => {
        console.log(e)
    }
    const [hover, setHover] = useState(false)
    return (
        <Box
            m={0}
            p={4}
            sx={{ border: hover ? '1px solid black' : '1px dotted gray' }}
            onClick={clickHandler}
            onMouseOver={(e) => setHover(true)}
            onMouseLeave={(e) => setHover(false)}
        >
            {children}
        </Box>
    )
}

function App({}: AppProps) {
    // Create the count state.
    const [count, setCount] = useState(0)
    // Create the counter (+1 every second).
    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), 1000)
        return () => clearTimeout(timer)
    }, [count, setCount])
    // Return the App component.

    const createMatrix = (x: number, y: number) =>
        new Array(x).fill(0).map(() => new Array(y).fill(0))

    const [arr, setArr] = useState(createMatrix(10, 20))

    return (
        <div className="App">
            <Box>
                {arr.map((row, i) => (
                    <Flex key={`row${i}`}>
                        {row.map((e, j) => (
                            <Cell key={`cell${j}`}>{JSON.stringify(e)}</Cell>
                        ))}
                    </Flex>
                ))}
            </Box>
        </div>
    )
}

export default () => (
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
)
