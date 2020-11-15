import type { Layer } from 'leaflet'
import React from 'react'
import { Box, Flex, Text } from 'theme-ui'

const Menu: React.FC<{ layer: Layer }> = ({ layer }) => {
    console.log(layer)
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
                <Text sx={{ fontSize: '28px' }}>
                    {layer.feature.properties.name}
                </Text>
                <Box sx={{ wordWrap: 'break-word' }}>
                    {/* {layer.feature.properties.name} */}
                    {/* {JSON.stringify(layer.feature.properties, null, 2)} */}
                </Box>
                {/* {Object.keys(UnitType).map((name) => (
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
                ))} */}
            </Flex>
        </Box>
    )
}
export default Menu
