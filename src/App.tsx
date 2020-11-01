import { create } from 'istanbul-reports'
import React, { useState, useEffect, ReactChild, EventHandler } from 'react'
import { Box, Flex, ThemeProvider } from 'theme-ui'
//@ts-ignore
import theme from './theme'

interface AppProps {}

const Cell = ({
    children,
    onClick: clickPropAction,
}: {
    children: ReactChild
    onClick: (e: MouseEvent) => void
}) => {
    const clickHandler = (e: MouseEvent) => {
        console.log(e)
        e.preventDefault()
        clickPropAction(e)
    }
    const [hover, setHover] = useState(false)
    return (
        <Box
            sx={{
                border: hover ? '1px solid black' : '1px dotted gray',
                userSelect: 'none',
                width: '100px',
                height: '100px',
            }}
            //@ts-ignore
            onClick={clickHandler}
            onMouseOver={(e) => setHover(true)}
            onMouseLeave={(e) => setHover(false)}
        >
            {children}
        </Box>
    )
}

const Menu: React.FC<{ info: string }> = ({ info }) => {
    return (
        <Box
            backgroundColor="#f6f6f6"
            my="5vh"
            mr={0}
            sx={{
                width: '600px',
                height: '90vh',
                position: 'absolute',
                right: 0,
                border: '1px solid black',
            }}
            p={2}
        >
            {info}
        </Box>
    )
}

const HEIGHT = 10
const WIDTH = 18
const emptyCellState = () => ({
    units: [],
})
const createMatrix = (x: number, y: number) =>
    new Array(x)
        .fill(emptyCellState())
        .map(() => new Array(y).fill(emptyCellState()))
const gameState = createMatrix(HEIGHT, WIDTH)
console.log(gameState)

function App({}: AppProps) {
    // Create the count state.
    const [count, setCount] = useState(0)
    // Create the counter (+1 every second).
    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), 1000)
        return () => clearTimeout(timer)
    }, [count, setCount])

    const [focusedCell, setFocusedCell] = useState<[number, number]>([0, 0])

    return (
        <div className="App">
            <Menu
                info={JSON.stringify({
                    state: gameState[focusedCell[0]][focusedCell[1]],
                    loc: focusedCell,
                })}
            />
            <Box>
                {gameState.map((row, i) => (
                    <Flex key={`row${i}`}>
                        {row.map((e, j) => (
                            <Cell
                                key={`cell${j}`}
                                onClick={(e) => setFocusedCell([i, j])}
                            >
                                {JSON.stringify([i, j])}
                            </Cell>
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
