import type { Layer } from 'leaflet'
import React from 'react'
import { Box, Button, Flex, Text } from 'theme-ui'
import { UnitText } from './CombatModal'
import { UnitType, Descript, Cost } from '../game/data'
import type { Tile, Unit } from '../game/game'

const Menu: React.FC<{
    layer: Layer
    tile: Tile
    units: Unit[]
    endTurn: () => void
    buyUnit: (type: string, tileId: string) => void
}> = ({ layer, buyUnit, tile, units, endTurn }) => {
    console.log(layer)
    const { properties, geometry } = layer.feature
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
                zIndex: 9999,
            }}
            p={4}
        >
            {/* <Flex>
                {gameState[coords[0]][coords[1]].units.map((u) => (
                    <Box backgroundColor="tomato">{Descript[u]}</Box>
                ))}
            </Flex> */}

            <Flex py={4} sx={{ flexDirection: 'column' }}>
                <Text sx={{ fontSize: '28px' }}>{properties.name}</Text>
                <Text sx={{ fontSize: '18px' }}>${tile.value}</Text>
                <Box sx={{ minHeight: '140px' }} my={4}>
                    {Object.keys(UnitType).map((type) => {
                        const num = units.filter((u) => u.type == type).length
                        return num > 0 ? (
                            <Box py={2}>
                                <UnitText type={type} count={num} />
                            </Box>
                        ) : null
                    })}
                </Box>
                {Object.keys(UnitType).map((type) => (
                    <Box>
                        <Button
                            onClick={(e) => buyUnit(properties.name, type)}
                            my={2}
                            variant="secondary"
                        >
                            Buy {Descript[type]} (${Cost[type]})
                        </Button>
                    </Box>
                ))}
                <Button onClick={(e) => endTurn()} my={2} variant="secondary">
                    End Turn
                </Button>
            </Flex>
        </Box>
    )
}
export default Menu
