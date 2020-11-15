import React, { useState, ReactChild } from 'react'
import { Box, Flex, Button, Badge, ThemeProvider } from 'theme-ui'
import CombatModal from './CombatModal'
import { UnitType, Descript, NumMap } from './game/data'
import mockExports from './game/driver'
import theme from './theme'
import { Map } from './Map'

interface AppProps {}

type Coords = [number, number]

const HEIGHT = 8
const WIDTH = 14
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

let gameState = createMatrix(HEIGHT, WIDTH)

const addUnitToCell = (unit: string, cell: Coords) => {
    gameState[cell[0]][cell[1]].units.push(unit)
    // gameState = [...gameState]
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
                width: '150px',
                height: '150px',
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

const UnitGroup = ({ units }: { units: string[] }) => {
    const groups: NumMap = {}
    Object.keys(UnitType).forEach((k) => (groups[k] = 0))
    units.forEach((u) => (groups[u] += 1))
    return (
        <>
            {Object.entries(groups).map(
                ([k, cnt]) =>
                    cnt > 0 && (
                        <Badge
                            backgroundColor="#b5e1ff"
                            color="black"
                            sx={{ fontSize: '16px' }}
                            m={1}
                            p={1}
                        >
                            {`${cnt}x ${k}`}
                        </Badge>
                    )
            )}
        </>
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

    return (
        <div className="App" style={{ height: '100vh' }}>
            {/* <CombatModal originalCombat={mockExports.mockCombat} /> */}
            <Map />
            <div>hello</div>
        </div>
    )
}
export default () => (
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
)
