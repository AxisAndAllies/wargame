import type { Layer } from 'leaflet'
import React from 'react'
import { Box, Button, Flex, Text } from 'theme-ui'
import { UnitType, Descript } from './game/data'
import type { Tile, Unit } from './game/game'

const Menu: React.FC<{
    layer: Layer
    tile: Tile
    units: Unit[]
    buyUnit: (type: string, tileId: string) => void
}> = ({ layer, buyUnit, tile, units }) => {
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
                <Box sx={{ wordWrap: 'break-word' }}>
                    {units.map((u) => (
                        <Box>{(u.owner, u.type)}</Box>
                    ))}
                </Box>
                {Object.keys(UnitType).map((type) => (
                    <Box>
                        <Button
                            onClick={(e) => buyUnit(properties.name, type)}
                            my={2}
                            variant="secondary"
                        >
                            Add {Descript[type]}
                        </Button>
                    </Box>
                ))}
            </Flex>
        </Box>
    )
}
export default Menu
