import { UnitType, Attack, Defense, Descript, Move, CantHit, Cost, MAX_ATTACK } from './data'
import { animalId, numericId, alphanumericId } from 'short-animal-id'
export class Unit {
    pos: Tile
    readonly owner: Player
    readonly type: string
    readonly id: string

    constructor(initialPos: Tile, initialOwner: Player, unitType: string) {
        this.pos = initialPos
        this.owner = initialOwner
        this.type = unitType
        this.id = this.owner.id + '_' + this.type + '_' + alphanumericId(3)
    }

    get isAttacker() {
        return this.pos.owner !== this.owner
    }

    get attack() { return Attack[this.type] }
    get defense() { return Defense[this.type] }
    get descript() { return Descript[this.type] }
    get move() { return Move[this.type] }
    get cost() { return Cost[this.type] }

    get accuracy() {
        return this.attack / MAX_ATTACK
    }

    // accuracy(target: Unit){
    //     const accLookup = Accuracy[this.type]
    //     const multiplier = accLookup[target.type] ?? accLookup['default']/2
    //     return Math.round(multiplier*(this.attack/target.defense)*100)/100
    // }

    canAttack(target: Unit): [boolean, string] {
        if (CantHit[this.type].includes(target.type))
            return [false, 'Cannot attack target type']
        if (Attack[this.type] < Defense[target.type])
            return [false, 'Attack less than target defense']
        return [true, '']
    }

    fire() {
        // returns num of hits
        let numHits = 0
        numHits += roll(this.accuracy) ? 1 : 0
        if (this.type == UnitType.BOM) {
            // bombers roll 2x
            numHits += roll(this.accuracy) ? 1 : 0
        }
        return numHits
    }

    possibleTargets(targets: Unit[]): Unit[] {
        return targets.filter(t => this.canAttack(t)[0] && t.owner !== this.owner)
    }
}

export class City {
    readonly pos: Tile
    constructor(initialPos: Tile) {
        this.pos = initialPos
    }

    get owner() {
        return this.pos.owner
    }

}

export class Fortification {
    readonly pos: Tile
    static readonly cost: number = 100
    turnsRemaining: number
    constructor(initialPos: Tile) {
        this.pos = initialPos
        this.turnsRemaining = 3
    }

    get owner() {
        return this.pos.owner
    }
}

export class Tile {
    x: number;
    y: number;
    type: string;
    value: number;
    owner: Player | null
    num_turns_owned: number = 0

    constructor(initialX: number, initialY: number, type: string, value: number) {
        this.x = initialX;
        this.y = initialY
        this.type = type
        this.value = value
        this.owner = null
    }
}

export class Player {
    readonly type: string;
    money: number
    readonly id: string
    constructor(type: string, money: number) {
        this.type = type
        this.money = money
        this.id = animalId() + numericId()
    }
    trySpendMoney(amount: number): boolean {
        if (this.money > amount) {
            this.money -= amount
            return true
        }
        return false
    }
}

const dist = (a: Tile, b: Tile) => {
    // manhattan dist
    return Math.abs(b.y - a.y) + Math.abs(b.x - a.x)
}

// returns whether a roll is a success (input between 0 --> 1)
const roll = (probSuccess: number) => Math.random() < probSuccess

export class Game {
    readonly tiles: Tile[]
    units: Unit[]
    readonly players: Player[]
    curTurn: number

    constructor(tiles: Tile[], units: Unit[], players: Player[]) {
        // need to generate all this...
        this.tiles = tiles
        this.units = units
        this.players = players
        this.curTurn = 0
    }

    get curPlayer() {
        return this.players[this.curTurn]
    }

    _removeUnits(unitIds: string[]) {
        this.units = this.units.filter(u => !unitIds.includes(u.id))
    }

    queryUnits(tile: Tile, includedOwners: Player[], excludedOwners: Player[] = []) {
        return this.units.filter(u => u.pos == tile && includedOwners.includes(u.owner) && !excludedOwners.includes(u.owner))
    }

    moveUnit(u: Unit, dest: Tile) {
        // TODO: check able to move there
        if (dist(dest, u.pos) > u.move) {
            return false
        }
        u.pos = dest
        return true
    }

    buyUnit(dest: Tile, unitName: string, player = this.curPlayer) {
        const newUnit = new Unit(dest, player, unitName)
        if (player.trySpendMoney(newUnit.cost)) {
            this.units.push(newUnit)
        }
        else {
            console.warn(`Failed to buy ${unitName}, not enough money: ${player.money} < ${newUnit.cost}.`)
        }
    }

    possibleMoves(u: Unit, moveDist: number = u.move) {
        // calculates possible destination tiles to move
        return this.tiles.filter(t => dist(t, u.pos) <= moveDist)
    }

    startBuildingFortification(tile: Tile, player = this.curPlayer) {
        // takes 3 turns
    }

    retreat(player: Player) {

    }

    removeCasualties(player: Player, tile: Tile, unitMap: Record<string, number>) {
        /**
         * unitMap is a map of unitType: number to remove
         * eg. {INF: 3, TANKL: 2, HELI: 4}
         */
        
        const candidates = this.queryUnits(tile, [player])
        const deadIds: string[] = []
        candidates.forEach(u => {
            if(unitMap[u.type] > 0) {
                deadIds.push(u.id)
                unitMap[u.type] -= 1
            }
        })
        this._removeUnits(deadIds)

    }

    getCombatants(t: Tile): { attackers: Unit[], defenders: Unit[] } {
        let attackers = this.queryUnits(t, this.players, [t.owner!])
        let defenders = this.queryUnits(t, [t.owner!])
        return { attackers, defenders }
    }

    resolveCombatRound(t: Tile) {
        let { attackers, defenders } = this.getCombatants(t)
        let attackerHits: Record<string, number> = {}
        let defenderHits: Record<string, number> = {}
        Object.keys(UnitType).forEach(type => {
            attackerHits[type] = 0
            defenderHits[type] = 0
        })
        attackers.forEach(a => {
            let numHits = a.fire()
            attackerHits[a.type] += numHits
            console.log(a.id, numHits, 'hits')
        })
        // defender can take casualties + retreat
        defenders.forEach(a => {
            let numHits = a.fire()
            defenderHits[a.type] += numHits
            console.log(a.id, numHits, 'hits')
        })
        // attacker can take casualties + retreat
        console.log(attackerHits)
        this.pickCasualties(attackers[0].owner, t, defenderHits)
        console.log(defenderHits)
        this.pickCasualties(defenders[0].owner, t, attackerHits)
    }

    resolveCombat(t: Tile) {
        while (attackers.length > 0 && defenders.length > 0) {
            this.resolveCombatRound(t)
            break
        }
    }

    nextTurn() {
        this.curTurn = (this.curTurn += 1) % this.players.length
    }
}

/**

Game flow:

- player gets turn
- spend money
    - build unit
    - build fortification
- move all units
for each tile:
    - resolve combat
    - retreat to friendly tile if defeat
- next turn

 */