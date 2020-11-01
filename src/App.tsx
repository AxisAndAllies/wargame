import React, { useState, useEffect, ReactChild, useMemo } from 'react'
import { Box, Flex, ThemeProvider, Text, Button } from 'theme-ui'
import { Unit, Descript } from './game/data'
import theme from './theme'

interface AppProps {}

type Coords = [number, number]

const HEIGHT = 10
const WIDTH = 18
const emptyCellState = {
    units: [] as string[],
}
const createMatrix = (x: number, y: number) =>
    new Array(x).fill(0).map(() => {
        let res = []
        for (let i = 0; i < y; i++)
            res.push({ units: [] as string[], a: Math.random() })
        return res
    })

const gameState = createMatrix(HEIGHT, WIDTH)

const addUnitToCell = (unit: string, cell: Coords) => {
    gameState[cell[0]][cell[1]] = {
        ...gameState[cell[0]][cell[1]],
        units: [...gameState[cell[0]][cell[1]].units, unit],
    }
}

const Cell = ({
    children,
    isFocused,
    onClick: clickPropAction,
}: {
    children: ReactChild
    isFocused: boolean
    onClick: (e: MouseEvent) => void
}) => {
    const clickHandler = (e: MouseEvent) => {
        // console.log(e)
        clickPropAction(e)
    }
    const [hover, setHover] = useState(false)
    return (
        <Box
            sx={{
                border: isFocused
                    ? '2px solid black'
                    : hover
                    ? '2px dashed blue'
                    : '1px dotted #ccc',
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

const Menu: React.FC<{ coords: Coords }> = ({ coords }) => {
    console.log(Object.keys(Unit))
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
            p={4}
        >
            <Text>{JSON.stringify(gameState[coords[0]][coords[1]])}</Text>
            <Flex py={4} sx={{ flexDirection: 'column' }}>
                {Object.keys(Unit).map((name) => (
                    <Box>
                        <Button
                            onClick={(e) => addUnitToCell(name, coords)}
                            my={2}
                        >
                            Add {Descript[name]}
                        </Button>
                    </Box>
                ))}
            </Flex>
        </Box>
    )
}

function App({}: AppProps) {
    // Create the count state.
    // const [count, setCount] = useState(0)
    // // Create the counter (+1 every second).
    // useEffect(() => {
    //     const timer = setTimeout(() => setCount(count + 1), 1000)
    //     return () => clearTimeout(timer)
    // }, [count, setCount])

    const [focusedCell, setFocusedCell] = useState<[number, number]>([0, 0])

    return (
        <div className="App">
            <Menu coords={focusedCell} />
            <Box>
                {gameState.map((row, i) => (
                    <Flex key={`row${i}`}>
                        {row.map((cell, j) => (
                            <Cell
                                key={`cell${j}`}
                                isFocused={
                                    focusedCell[0] == i && focusedCell[1] == j
                                }
                                onClick={(e) => {
                                    e.preventDefault()
                                    setFocusedCell([i, j])
                                }}
                            >
                                {JSON.stringify(gameState[i][j].units)}
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
