import { UnitType, Attack, Defense, Descript, Move, CantHit, Cost, MAX_ATTACK, NumMap, Hit } from './data'
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

    static canBeAttackedBy(attackerType: string, unitType: string) {
        return !CantHit[attackerType].includes(unitType) && Attack[attackerType] >= Defense[unitType]
    }

    static getAttackableUnitTypes(unitType: string) {
        // return all unit types this unit can attack
        return Object.keys(UnitType).filter(type => Unit.canBeAttackedBy(unitType, type))
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


export class Combat {

    readonly game: Game
    readonly tile: Tile
    turn: CombatRole
    hasFired: boolean
    attacker: Player
    defender: Player
    // keeps track of units left to remove that were hit
    pendingHits: Hit[]= []
    // track units that were marked as dead
    markedDead: NumMap={}

    constructor(game: Game, tile: Tile, attacker: Player) {
        this.game = game
        this.tile = tile
        this.turn = CombatRole.ATTACKER
        this.attacker = attacker
        this.defender = tile.owner!
        this.hasFired = false
    }

    get isAttackerTurn() {
        return this.turn == CombatRole.ATTACKER
    }

    get curPlayer() {
        return this.isAttackerTurn ? this.attacker : this.defender
    }


    recordHits() {
        let { attackers, defenders } = this.getCombatants()
        if (attackers.length == 0) {return}
        if (defenders.length == 0) {return}
        if (Object.keys(this.pendingHits).length > 0) {
            return
        }
        let hits: Hit[];
        if (this.isAttackerTurn) {
            hits = Combat.getHitsFrom(attackers)
        }
        else {
            hits = Combat.getHitsFrom(defenders)
        }
        this.pendingHits = hits;
        this.hasFired = true
    }

    nextTurn(){
        if (Object.keys(this.pendingHits).length > 0) {
            return
        } 
        // remove marked dead
        this.game.removeCasualties(this.curPlayer, this.tile, this.markedDead)
        this.turn = (this.isAttackerTurn ? CombatRole.DEFENDER : CombatRole.ATTACKER)
        this.hasFired = false
        this.markedDead = {}

    }

    removeHits(unitMap: NumMap) {
        // TODO: support arbitrary unittype

        // update markedDead
        Object.entries(unitMap)
        .filter(([type, num]) => num > 0)
        .map(([type, num]) => {
            this.markedDead[type] = (this.markedDead[type] || 0) + num
        })

        // update pending hits
        const sum = sumDict(unitMap)
        this.pendingHits[0].numHits -= sum
        if (this.pendingHits[0].numHits <= 0) {
            this.pendingHits.shift()
        }
    }

    getCombatants(): { attackers: Unit[], defenders: Unit[] } {
        const t= this.tile
        let attackers = this.game.queryUnits(t, [this.attacker], [t.owner!])
        let defenders = this.game.queryUnits(t, [t.owner!])
        return { attackers, defenders }
    }

    retreat(){
        // remove marked dead
        this.game.removeCasualties(this.curPlayer, this.tile, this.markedDead)
    }

    static getHitsFrom(units: Unit[]): Hit[] {
        const hitsMap = Game.mapUnits(units, u => u.fire())
        const result = Object.entries(hitsMap)
        .map(([type, numHits]) => ({type, numHits }))
        // sort by selectivity ascending, then by attack ascending
        .sort((a,b) => Unit.getAttackableUnitTypes(a.type).length - Unit.getAttackableUnitTypes(b.type).length 
        || Attack[a.type] - Attack[b.type])
        return result
    }

}

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

    static mapUnits(_units: Unit[], fn: (unit: Unit)=> number, stripEmptyKeys=true): NumMap {
        let tmp: NumMap = {}
        _units.forEach(u => {
            tmp[u.type] = (tmp[u.type] ?? 0) + fn(u)
        })
        if (stripEmptyKeys) {
            Object.keys(tmp).forEach(key => !tmp[key] && delete tmp[key])
        }
        return tmp
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

    retreat(player: Player, tile: Tile) {
        if (tile.owner == player) {
            // defender retreat
        }
        else {
            // attacker retreat
            tile.owner = player
        }
    }

    removeCasualties(player: Player, tile: Tile, unitMap: NumMap) {
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

    startCombat(t: Tile) {
        let attackers = this.queryUnits(t, this.players, [t.owner!])
        return new Combat(this, t, attackers[0].owner)
    }


    nextTurn() {
        this.curTurn = (this.curTurn += 1) % this.players.length
    }
}


const dist = (a: Tile, b: Tile) => {
    // manhattan dist
    return Math.abs(b.y - a.y) + Math.abs(b.x - a.x)
}

export const sumDict = (dict: NumMap) => Object.values(dict).reduce((acc,val) => acc + val, 0)

// returns whether a roll is a success (input between 0 --> 1)
const roll = (probSuccess: number) => Math.random() < probSuccess
export enum CombatRole {
    ATTACKER, DEFENDER
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