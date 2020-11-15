import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Badge, Text } from 'theme-ui'
import { Combat, Game, sumDict, Unit } from './game/game'
import { Attack, Defense, Descript, Hit, NumMap, UnitType } from './game/data'

const UnitText = ({ type, count }: { type: string; count: number }) => (
    <Text ml={4} sx={{ fontSize: '18px' }}>
        <strong>{count}</strong> {Descript[type]}: <br></br>
        <Badge mr={2} variant="outline">
            {Attack[type]} att ({Unit.getAccuracy(type) * 100}%)
        </Badge>
        <Badge mr={2} variant="outline">
            {Defense[type]} def
        </Badge>
    </Text>
)

const UnitStack = ({
    unitMap,
    markedDead,
    attackerType,
    onSubmit,
    maxHits = 0,
}: {
    unitMap: NumMap
    markedDead: NumMap
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
            {Object.entries(unitMap)
                .filter(([type, count]) => count > (markedDead[type] || 0))
                .map(([type, count]) => {
                    let maxForType =
                        count - selected[type] - (markedDead[type] || 0)
                    return (
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
                                    visibility: !isValid(type)
                                        ? 'hidden'
                                        : 'visible',
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
                                        selected[type] >=
                                            count - (markedDead[type] || 0) ||
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
                                        visibility:
                                            count < 2 ? 'hidden' : 'inherit',
                                    }}
                                    disabled={
                                        sumDict(selected) +
                                            count +
                                            (markedDead[type] || 0) >
                                        maxHits
                                    }
                                >
                                    All
                                </Button>
                            </Box>
                            <UnitText type={type} count={maxForType} />
                        </Flex>
                    )
                })}
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
            {Object.entries(unitMap).map(([type, count]) => (
                <Box py={2} key={`${type}${count}`}>
                    <UnitText type={type} count={count} />
                </Box>
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
                zIndex: 9999,
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
                                markedDead={markedDead}
                                attackerType={firstHit?.type}
                                maxHits={firstHit?.actionable}
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
                                markedDead={markedDead}
                                attackerType={firstHit?.type}
                                maxHits={firstHit?.actionable}
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
                            <strong>{firstHit.numHits}</strong> (
                            {firstHit.numHits - firstHit.actionable!}{' '}
                            disregarded)
                        </Text>
                    )}
                </Box>
                <Box>
                    {pendingHits.length ? (
                        pendingHits.map(({ type, numHits }, ind) => (
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
                        ))
                    ) : (
                        <Box>No hits remaining.</Box>
                    )}
                </Box>
                <Box sx={{ color: 'red' }}>
                    <TextUnitStack unitMap={markedDead} />
                </Box>
            </Box>
        </Flex>
    )
}
export default CombatModal
