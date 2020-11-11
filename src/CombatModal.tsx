import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Text } from 'theme-ui'
import { Combat, Game, sumDict, Unit } from './game/board'
import { Descript, Hit, NumMap, UnitType } from './game/data'

const UnitStack = ({
    units,
    attackerType,
    onSubmit,
    maxHits = 0,
}: {
    units: Unit[]
    attackerType?: string
    maxHits?: number
    onSubmit: (unitMap: NumMap) => void
}) => {
    const [selected, setSelected] = useState<NumMap>({})
    const maxMap = useMemo(() => Game.mapUnits(units, (u) => 1), [units])
    const isValid = (type: string) =>
        Boolean(attackerType) && Unit.canBeAttackedBy(attackerType!, type)
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
                        userSelect: 'none',
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
                        <strong>{selected[t]}</strong>
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
                    <Text ml={4} sx={{ fontSize: '18px' }}>
                        <strong>{maxMap[t] - selected[t]}</strong> {Descript[t]}
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
                disabled={sumDict(selected) < maxHits}
                hidden
            >
                Submit
            </Button>
        </>
    )
}

const TextUnitStack = ({ unitMap }: { unitMap: NumMap }) => {
    return (
        <Box py={2}>
            {Object.keys(unitMap).map((t) => (
                <Text
                    sx={{ fontSize: '18px', userSelect: 'none' }}
                    py={2}
                    key={t}
                >
                    <strong>{unitMap[t]}</strong> {Descript[t]}
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
    const [pendingHits, setPendingHits] = useState<Hit[]>(combat.pendingHits)
    const [markedDead, setMarkedDead] = useState<NumMap>(combat.markedDead)
    const [hasFired, setHasFired] = useState(combat.hasFired)
    const [firstHit, setFirstHit] = useState<Hit>()

    /**
     * TODO[!!!!!]: need to handle case where
     * no defender units can get hit,
     * then skip firstHit
     */
    useEffect(() => {
        setFirstHit(pendingHits[0])
    }, [pendingHits[0]])

    const submitHits = (map: NumMap) => {
        if (!firstHit) return
        combat.removeHits(map)
        setPendingHits(combat.pendingHits)
        // need the following line to work and idk why
        setCombatants(combat.getCombatants())
        setMarkedDead(combat.markedDead)
    }
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
                                attackerType={firstHit?.type}
                                maxHits={firstHit?.numHits}
                                onSubmit={submitHits}
                            />
                        ) : (
                            <TextUnitStack
                                unitMap={Game.mapUnits(attackers, (u) => 1)}
                            />
                        )}
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Text sx={{ fontSize: '1.5em' }}>Defenders</Text>
                        {combat.isAttackerTurn ? (
                            <UnitStack
                                units={defenders}
                                attackerType={firstHit?.type}
                                maxHits={firstHit?.numHits}
                                onSubmit={submitHits}
                            />
                        ) : (
                            <TextUnitStack
                                unitMap={Game.mapUnits(defenders, (u) => 1)}
                            />
                        )}
                    </Box>
                </Flex>
                <Button
                    variant="secondary"
                    onClick={() => {
                        combat.recordHits()
                        setPendingHits(combat.pendingHits)
                        setHasFired(combat.hasFired)
                    }}
                    mx={2}
                    disabled={combat.hasFired}
                >
                    Fire
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        combat.retreat()
                    }}
                    disabled={Boolean(firstHit?.type)}
                    mx={2}
                >
                    Retreat
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        combat.nextTurn()
                        setHasFired(combat.hasFired)
                    }}
                    disabled={Boolean(firstHit?.type) || !hasFired}
                    mx={2}
                >
                    Next Turn
                </Button>
                <Box my={4} />
                <Box>
                    {firstHit && (
                        <Text sx={{ fontSize: '1.5em' }}>
                            {Descript[firstHit.type!]} hits:{' '}
                            <strong>{firstHit.numHits}</strong>
                        </Text>
                    )}
                </Box>
                <Box>
                    {pendingHits.map(({ type, numHits }, ind) => (
                        <>
                            {ind > 0 && (
                                <Text
                                    color="gray"
                                    my={2}
                                    key={`${type}_${ind}`}
                                >
                                    {Descript[type]} hits: {numHits}
                                </Text>
                            )}
                        </>
                    ))}
                </Box>
                <Box sx={{ color: 'red' }}>
                    <TextUnitStack unitMap={markedDead} />
                </Box>
            </Box>
        </Flex>
    )
}
export default CombatModal
