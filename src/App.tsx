import { TileLayer, Marker, Popup, MapContainer, GeoJSON } from 'react-leaflet'
import React, { useState, ReactChild } from 'react'
import { Box, Flex, Button, Badge, ThemeProvider } from 'theme-ui'
import CombatModal from './CombatModal'
import { UnitType, Descript, NumMap } from './game/data'
import mockExports from './game/driver'
import theme from './theme'
import data from './game/110m-map.json'

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

const Menu: React.FC<{ coords: Coords }> = ({ coords }) => {
    return (
        <Box
            backgroundColor="#f6f6f6"
            my="5vh"
            mr={0}
            sx={{
                width: '400px',
                height: '90vh',
                position: 'absolute',
                right: 0,
                border: '1px solid black',
            }}
            p={4}
        >
            {/* <Flex>
                {gameState[coords[0]][coords[1]].units.map((u) => (
                    <Box backgroundColor="tomato">{Descript[u]}</Box>
                ))}
            </Flex> */}

            <Flex py={4} sx={{ flexDirection: 'column' }}>
                {Object.keys(UnitType).map((name) => (
                    <Box>
                        <Button
                            onClick={(e) => addUnitToCell(name, coords)}
                            my={2}
                            backgroundColor="white"
                            color="black"
                            sx={{
                                border: '1px solid black',
                            }}
                        >
                            Add {Descript[name]}
                        </Button>
                    </Box>
                ))}
            </Flex>
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

    const [focusedCell, setFocusedCell] = useState<[number, number]>([0, 0])
    const pos = [39, 90]
    console.log(data)
    return (
        <div className="App" style={{ height: '100vh' }}>
            {/* <CombatModal originalCombat={mockExports.mockCombat} /> */}
            {/* <Menu coords={focusedCell} /> */}
            <div>hello</div>
            <MapContainer
                center={{ lat: pos[0], lng: pos[1] }}
                zoom={4}
                scrollWheelZoom={false}
                style={{ height: '90%' }}
            >
                {/* <TileLayer
                    attribution="https://geojson-maps.ash.ms/"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> */}
                <GeoJSON
                    attribution="https://geojson-maps.ash.ms/"
                    data={data}
                    style={{
                        stroke: false,
                        fill: true,
                        fillColor: '#fff',
                        fillOpacity: 1,
                    }}
                />
                {/* <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
                <div style={{ fontSize: '28px' }}>foo</div>
            </MapContainer>
        </div>
    )
}
export default () => (
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
)
