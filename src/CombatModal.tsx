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
    const [pendingHits, setPendingHits] = useState<Hit[]>(combat.pendingHits)
    const [firstHit, setFirstHit] = useState<Hit>()

    /**
     * TODO[!!!!!]: need to handle case where
     * no defender units can get hit,
     * then skip firstHit
     */
    useEffect(() => {
        setFirstHit(pendingHits[0])
    }, [pendingHits[0]])
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
                                onSubmit={(map) => {
                                    if (!firstHit) return
                                    combat.removeHitsFor(map)
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
                                attackerType={firstHit?.type}
                                maxHits={firstHit?.numHits}
                                onSubmit={(map) => {
                                    if (!firstHit) return
                                    combat.removeHitsFor(map)
                                    setPendingHits(combat.pendingHits)
                                    // need the following line to work and idk why
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
                    mx={2}
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
            </Box>
        </Flex>
    )
}
export default CombatModal
