import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Input, Label, Text } from 'theme-ui'
import type { Unit } from './game/board'
import { NumMap, UnitType } from './game/data'
import mockExports from './game/driver'

const UnitStack = ({
    units,
    onSubmit,
}: {
    units: Unit[]
    onSubmit: (unitMap: NumMap) => void
}) => {
    const [selected, setSelected] = useState<NumMap>({})
    const maxMap = useMemo(() => {
        let tmp: NumMap = {}
        Object.keys(UnitType).forEach((type) => {
            tmp[type] = units.filter((u) => u.type == type).length
            if (tmp[type] == 0) {
                delete tmp[type]
            }
        })
        return tmp
    }, [units])
    const setTypeVal = (unitType: string, val: number) => {
        setSelected((prevState) => ({
            ...prevState,
            [unitType]: val,
        }))
    }
    useEffect(() => {
        Object.keys(UnitType).forEach((type) => {
            setTypeVal(type, 0)
        })
    }, [units])

    const buttonStyle = {
        backgroundColor: 'white',
        color: 'black',
        border: '1px solid black',
        padding: '',
        boxShadow: '3px 5px #999',
        '&:hover': {
            boxShadow: '3px 5px #555',
            border: '1px solid blue',
        },
        '&:active': {
            boxShadow: '2px 2px #999',
            transform: `translate(1px, 3px)`,
        },
        '&:disabled': {
            opacity: '30%',
        },
    }
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
                    key={t}
                >
                    <Box>
                        <Button
                            sx={buttonStyle}
                            mx={2}
                            onClick={() => {
                                setTypeVal(t, selected[t] - 1)
                            }}
                            disabled={selected[t] == 0}
                        >
                            -
                        </Button>
                        <Button
                            sx={buttonStyle}
                            mx={2}
                            onClick={() => {
                                setTypeVal(t, selected[t] + 1)
                            }}
                            disabled={selected[t] == maxMap[t]}
                        >
                            +
                        </Button>

                        <Button
                            sx={buttonStyle}
                            mx={2}
                            onClick={() => {
                                setTypeVal(t, maxMap[t])
                            }}
                        >
                            All
                        </Button>
                    </Box>
                    <Text ml={4}>
                        {selected[t]}/{maxMap[t]}x {t}
                    </Text>
                </Flex>
            ))}
            <Box my={2} />
            <Button
                onClick={() => {
                    onSubmit(selected)
                }}
            >
                Submit
            </Button>
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
                        <UnitStack
                            units={attackers}
                            onSubmit={(submitted: NumMap) => {
                                console.log(submitted)
                            }}
                        />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Text sx={{ fontSize: '1.5em' }}>Defenders</Text>
                        <UnitStack
                            units={defenders}
                            onSubmit={(submitted: NumMap) => {
                                console.log(submitted)
                            }}
                        />
                    </Box>
                </Flex>
                <Box>footer</Box>
            </Box>
        </Flex>
    )
}
export default CombatModal
