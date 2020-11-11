import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Text } from 'theme-ui'
import { Combat, Game, sumDict, Unit } from './game/board'
import { Descript, Hit, NumMap, UnitType } from './game/data'

const UnitStack = ({
    unitMap,
    attackerType,
    onSubmit,
    maxHits = 0,
}: {
    unitMap: NumMap
    attackerType?: string
    maxHits?: number
    onSubmit: (unitMap: NumMap) => void
}) => {
    const [selected, setSelected] = useState<NumMap>({})
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
    }, [unitMap])

    return (
        <>
            {Object.entries(unitMap).map(([type, count]) => (
                <Flex
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        userSelect: 'none',
                    }}
                    py={2}
                    pr={4}
                    key={type}
                >
                    <Box
                        sx={{
                            visibility: !isValid(type) ? 'hidden' : 'visible',
                        }}
                    >
                        <Button
                            variant="secondary"
                            mx={2}
                            onClick={() => {
                                setTypeVal(type, selected[type] - 1)
                            }}
                            disabled={selected[type] == 0}
                        >
                            -
                        </Button>
                        <strong>{selected[type]}</strong>
                        <Button
                            variant="secondary"
                            mx={2}
                            onClick={() => {
                                setTypeVal(type, selected[type] + 1)
                            }}
                            disabled={
                                selected[type] == count ||
                                sumDict(selected) + 1 > maxHits
                            }
                        >
                            +
                        </Button>
                        <Button
                            variant="secondary"
                            mx={2}
                            onClick={() => {
                                setTypeVal(type, count)
                            }}
                            sx={{
                                visibility: count < 2 ? 'hidden' : 'inherit',
                            }}
                            disabled={sumDict(selected) + count > maxHits}
                        >
                            All
                        </Button>
                    </Box>
                    <Text ml={4} sx={{ fontSize: '18px' }}>
                        <strong>{count - selected[type]}</strong>{' '}
                        {Descript[type]}
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
    const [markedDead, setMarkedDead] = useState<NumMap>(combat.curMarkedDead)
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

    const refreshData = () => {
        setPendingHits(combat.pendingHits)
        setHasFired(combat.hasFired)
        setMarkedDead(combat.curMarkedDead)
        setCombatants(combat.getCombatants())
    }
    const submitHits = (map: NumMap) => {
        if (!firstHit) return
        combat.removeHits(map)
        refreshData()
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
                                unitMap={Game.mapUnits(attackers, (u) => 1)}
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
                                unitMap={Game.mapUnits(defenders, (u) => 1)}
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
                        refreshData()
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
                        refreshData()
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
                        refreshData()
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
