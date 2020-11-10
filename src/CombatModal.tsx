import React, { useState } from 'react'
import { Box, Button, Flex, Input, Label, Text } from 'theme-ui'
import type { Unit } from './game/board'
import { UnitType } from './game/data'
import mockExports from './game/driver'

const UnitStack = ({
    units,
    onSubmit,
}: {
    units: Unit[]
    onSubmit: (unitMap: Record<string, number>) => void
}) => {
    const { selected, setSelected } = useState({})
    const maxMap: Record<string, number> = {}
    Object.keys(UnitType).forEach((type) => {
        maxMap[type] = units.filter((u) => u.type == type).length
        if (maxMap[type] == 0) {
            delete maxMap[type]
        }
    })

    return (
        <>
            {Object.keys(maxMap).map((t) => (
                <Flex
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                    py={2}
                    pr={4}
                >
                    <Box>
                        <Button
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                border: '1px solid black',
                                padding: '',
                            }}
                            mx={2}
                            onClick={() => {}}
                        >
                            +
                        </Button>
                        <Button
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                border: '1px solid black',
                                padding: '',
                            }}
                            mx={2}
                        >
                            -
                        </Button>
                        <Button
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                border: '1px solid black',
                                padding: '',
                            }}
                            mx={2}
                        >
                            All
                        </Button>
                    </Box>
                    <Text ml={4}>
                        {maxMap[t]}x {t}
                    </Text>
                </Flex>
            ))}
            <Box my={2} />
            <Button>Submit</Button>
        </>
    )
}

const CombatModal = () => {
    // stub
    let _game = mockExports.mockGame
    let { attackers, defenders } = _game.getCombatants(mockExports.mockTile)
    return (
        <Flex
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
                position: 'absolute',
            }}
        >
            <Box
                backgroundColor="#f6f6f6"
                sx={{
                    width: '70vw',
                    height: '70vh',
                    border: '1px solid black',
                }}
                p={4}
            >
                <Flex sx={{ minHeight: '50%' }}>
                    <Box sx={{ width: '50%' }}>
                        <Text sx={{ fontSize: '1.5em' }}>Attackers</Text>
                        <UnitStack units={attackers} onSubmit={() => {}} />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Text sx={{ fontSize: '1.5em' }}>Defenders</Text>
                        <UnitStack units={defenders} onSubmit={() => {}} />
                    </Box>
                </Flex>
                <Box>footer</Box>
            </Box>
        </Flex>
    )
}
export default CombatModal
