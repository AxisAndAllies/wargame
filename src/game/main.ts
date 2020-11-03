import {UnitType, Attack, Defense, Descript, Move, Accuracy, CantHit} from './data'

const getUnit = (name: string) => ({
    name: UnitType[name],
    attack: Attack[name],
    defense: Defense[name],
    descript: Descript[name],
    move: Move[name],
    accuracy: Accuracy[name],
    canAttack: (targetName: string) => {
        if (CantHit[name].includes(targetName))
            return [false, 'Cannot attack target type']
        if (Attack[name] < Defense[targetName])
            return [false, 'Attack less than target defense']
        return [true, '']
    }
})

const attack = (attacker: string, defenders: string[]) => {
    // can't let defender pick casualties b/c they have different defense values, so attacker must choose what to attack
}