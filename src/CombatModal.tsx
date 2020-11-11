import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Input, Label, Text } from 'theme-ui'
import { Game, Unit } from './game/board'
import { Descript, NumMap, UnitType } from './game/data'
import mockExports from './game/driver'

const UnitStack = ({
    units,
    onSubmit,
}: {
    units: Unit[]
    onSubmit: (unitMap: NumMap) => void
}) => {
    const [selected, setSelected] = useState<NumMap>({})
    const maxMap = useMemo(() => Game.mapUnits(units, (u) => 1), [units])
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
                            variant="secondary"
                            mx={2}
                            onClick={() => {
                                setTypeVal(t, selected[t] - 1)
                            }}
                            disabled={selected[t] == 0}
                        >
                            -
                        </Button>
                        <Button
                            variant="secondary"
                            mx={2}
                            onClick={() => {
                                setTypeVal(t, selected[t] + 1)
                            }}
                            disabled={selected[t] == maxMap[t]}
                        >
                            +
                        </Button>

                        <Button
                            variant="secondary"
                            mx={2}
                            onClick={() => {
                                setTypeVal(t, maxMap[t])
                            }}
                        >
                            All
                        </Button>
                    </Box>
                    <Text ml={4} sx={{ fontSize: '18px' }}>
                        <strong>
                            {selected[t]}/{maxMap[t]}
                        </strong>{' '}
                        {Descript[t]}
                    </Text>
                </Flex>
            ))}
            <Box my={4} />
            <Button
                onClick={() => {
                    onSubmit(selected)
                }}
                mx={2}
                variant="secondary"
            >
                Submit
            </Button>
        </>
    )
}

const CombatModal = () => {
    // stub
    let _game = mockExports.mockGame
    let combat = mockExports.mockCombat
    let { attackers, defenders } = _game.getCombatants(mockExports.mockTile)
    const [hits, setHits] = useState<NumMap>({})
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
                <Button
                    variant="secondary"
                    onClick={() => {
                        combat.recordHits()
                        setHits(combat.pendingHits)
                    }}
                >
                    Fire
                </Button>
                <Box my={4} />
                <Box>{JSON.stringify(combat.pendingHits)}</Box>
            </Box>
        </Flex>
    )
}
export default CombatModal
