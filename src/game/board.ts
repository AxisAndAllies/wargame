import {UnitType, Attack, Defense, Descript, Move, Accuracy, CantHit} from './data'
import {animalId, numericId, alphaNumericId} from 'short-animal-id'
export class Unit {
    pos: Tile
    readonly owner: Player
    readonly name: string
    readonly id: string

    constructor(initialPos: Tile, initialOwner: Player, unitType: string) {
        this.pos = initialPos
        this.owner = initialOwner
        this.name = unitType
        this.id = this.owner.id + '_' + this.name + '_' + alphaNumericId()
    }

    get isAttacker() {
        return this.pos.owner !== this.owner
    }

    get attack(){return Attack[name]}
    get defense(){return Defense[name]}
    get descript(){return Descript[name]}
    get move(){return Move[name]}
    accuracy(target: Unit){
        let accLookup = Accuracy[name]
        return accLookup[target.name] ?? accLookup['default']
    }
    
    canAttack(target: Unit): [boolean, string] {
        if (CantHit[name].includes(target.name))
            return [false, 'Cannot attack target type']
        if (Attack[name] < Defense[target.name])
            return [false, 'Attack less than target defense']
        return [true, '']
    }

    possibleTargets(targets: Unit[]): Unit[] {
        return targets.filter(t => this.canAttack(t)[0] && t.owner !== this.owner)
    }
}

export class City {
    pos: Tile
    constructor(initialPos: Tile) {
        this.pos = initialPos
    }

    get owner() {
        return this.pos.owner
    }

}

export class Fortification {
    pos: Tile
    cost: number
    turnsRemaining: number
    constructor(initialPos: Tile) {
        this.pos = initialPos
        this.cost = 100
        this.turnsRemaining = 3
    }

    get owner() {
        return this.pos.owner
    }
}

export class Tile {
    x: number;
    y: number;
    name: string;
    value: number;
    owner: Player | null
    num_turns_owned: number = 0
   
    constructor(initialX: number, initialY: number, name: string, value: number) {
        this.x = initialX;
        this.y = initialY
        this.name = name
        this.value = value
        this.owner = null
    }
}

export class Player {
    readonly name: string;
    money: number
    readonly id: string
    constructor(name: string, money: number) {
        this.name = name
        this.money = money
        this.id = animalId() + numericId()
    }
}

const dist = (a: Tile, b: Tile) => {
    // manhattan dist
    return Math.abs(b.y - a.y) + Math.abs(b.x - a.x)
}

export class Game {
    tiles: Tile[]
    units: Unit[]
    players: Player[]
    curTurn: number

    constructor(tiles:Tile[], units: Unit[], players: Player[]) {
        // need to generate all this...
        this.tiles = tiles
        this.units = []
        this.players = players
        this.curTurn = 0
    }

    get curPlayer() {
        return this.players[this.curTurn]
    }

    moveUnit(u: Unit, dest: Tile) {
        // TODO: check able to move there
        u.pos = dest
    }

    spendMoney() {

    }

    possibleMoves(u: Unit, moveDist: number = u.move) {
        // calculates possible destination tiles to move
        return this.tiles.filter(t => dist(t, u.pos) <= moveDist)
    }

    tick() {

    }

    startBuildingFortification(tile: Tile) {
        // takes 3 turns
    }

    resolveCombat(t: Tile) {
        const unitsOnTile = this.units.filter(u => u.pos == t)
        let attacking = this.curTurn
    }

    nextTurn() {
        this.curTurn = (this.curTurn += 1)%this.players.length
    }
}

/**

Game flow:

- player gets turn
- spend money
    - build unit
    - build fortification
- move unit
for each tile:
    - resolve combat
    - retreat to friendly tile if defeat
- next turn

 */