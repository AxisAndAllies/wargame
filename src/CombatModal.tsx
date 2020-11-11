import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Text } from 'theme-ui'
import { Combat, Game, sumDict, Unit } from './game/board'
import { Descript, NumMap, UnitType } from './game/data'

const UnitStack = ({
    units,
    attackerType,
    onSubmit,
    maxHits,
}: {
    units: Unit[]
    attackerType: string
    maxHits: number
    onSubmit: (unitMap: NumMap) => void
}) => {
    const [selected, setSelected] = useState<NumMap>({})
    const maxMap = useMemo(() => Game.mapUnits(units, (u) => 1), [units])
    const isValid = (type: string) =>
        Boolean(attackerType) && Unit.canBeAttackedBy(attackerType, type)
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
                    <Box
                        sx={{
                            visibility: !isValid(t) ? 'hidden' : 'visible',
                        }}
                    >
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
                            disabled={
                                selected[t] == maxMap[t] ||
                                sumDict(selected) + 1 > maxHits
                            }
                        >
                            +
                        </Button>
                        <Button
                            variant="secondary"
                            mx={2}
                            onClick={() => {
                                setTypeVal(t, maxMap[t])
                            }}
                            sx={{
                                visibility:
                                    maxMap[t] < 2 ? 'hidden' : 'inherit',
                            }}
                            disabled={sumDict(selected) + maxMap[t] > maxHits}
                        >
                            All
                        </Button>
                    </Box>
                    <Text ml={4} sx={{ fontSize: '18px', userSelect: 'none' }}>
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
                sx={{
                    visibility: !attackerType ? 'hidden' : 'visible',
                }}
            >
                Submit
            </Button>
        </>
    )
}

const TextUnitStack = ({ units }: { units: Unit[] }) => {
    const maxMap = useMemo(() => Game.mapUnits(units, (u) => 1), [units])

    return (
        <Box py={2}>
            {Object.keys(maxMap).map((t) => (
                <Text
                    sx={{ fontSize: '18px', userSelect: 'none' }}
                    py={2}
                    key={t}
                >
                    <strong>{maxMap[t]}</strong> {Descript[t]}
                </Text>
            ))}
        </Box>
    )
}

const CombatModal = ({ originalCombat }: { originalCombat: Combat }) => {
    const [combat] = useState(originalCombat)
    const [{ attackers, defenders }, setCombatants] = useState(
        combat.getCombatants()
    )
    const [pendingHits, setPendingHits] = useState<NumMap>(combat.pendingHits)
    const [firstHit, setFirstHit] = useState<{
        type?: string
        numHits?: number
    }>({})
    useEffect(() => {
        let type = Object.keys(pendingHits)[0]
        let numHits = pendingHits[type]
        console.log(
            'got first hit',
            { type, numHits },
            sumDict(combat.pendingHits)
        )
        setFirstHit({ type, numHits })
    }, [sumDict(combat.pendingHits)])
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
                        {!combat.isAttackerTurn ? (
                            <UnitStack
                                units={attackers}
                                attackerType={firstHit.type!}
                                maxHits={firstHit.numHits!}
                                onSubmit={(map) => {
                                    combat.removeHitsFor(map, firstHit.type!)
                                    setPendingHits(combat.pendingHits)
                                }}
                            />
                        ) : (
                            <TextUnitStack units={attackers} />
                        )}
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Text sx={{ fontSize: '1.5em' }}>Defenders</Text>
                        {combat.isAttackerTurn ? (
                            <UnitStack
                                units={defenders}
                                attackerType={firstHit.type!}
                                maxHits={firstHit.numHits!}
                                onSubmit={(map) => {
                                    combat.removeHitsFor(map, firstHit.type!)
                                    setPendingHits(combat.pendingHits)
                                    setCombatants(combat.getCombatants())
                                }}
                            />
                        ) : (
                            <TextUnitStack units={defenders} />
                        )}
                    </Box>
                </Flex>
                <Button
                    variant="secondary"
                    onClick={() => {
                        combat.recordHits()
                        setPendingHits(combat.pendingHits)
                    }}
                >
                    Fire
                </Button>
                <Box my={4} />
                <Box>
                    {firstHit.type} hit {firstHit.numHits} times
                </Box>
                <Box>{JSON.stringify(pendingHits)}</Box>
                <Box>{JSON.stringify(combat.pendingHits)}</Box>
            </Box>
        </Flex>
    )
}
export default CombatModal
