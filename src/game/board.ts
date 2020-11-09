import {UnitType, Attack, Defense, Descript, Move, CantHit, Cost} from './data'
import {animalId, numericId, alphanumericId} from 'short-animal-id'
export class Unit {
    pos: Tile
    readonly owner: Player
    readonly name: string
    readonly id: string

    constructor(initialPos: Tile, initialOwner: Player, unitType: string) {
        this.pos = initialPos
        this.owner = initialOwner
        this.name = unitType
        this.id = this.owner.id + '_' + this.name + '_' + alphanumericId(3)
    }

    get isAttacker() {
        return this.pos.owner !== this.owner
    }

    get attack(){return Attack[this.name]}
    get defense(){return Defense[this.name]}
    get descript(){return Descript[this.name]}
    get move(){return Move[this.name]}
    get cost(){return Cost[this.name]}

    accuracy(target: Unit){
        return this.attack/10
        // const accLookup = Accuracy[this.name]
        // const multiplier = accLookup[target.name] ?? accLookup['default']/2
        // return Math.round(multiplier*(this.attack/target.defense)*100)/100
    }

    canAttack(target: Unit): [boolean, string] {
        if (CantHit[this.name].includes(target.name))
            return [false, 'Cannot attack target type']
        if (Attack[this.name] < Defense[target.name])
            return [false, 'Attack less than target defense']
        return [true, '']
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
    static readonly cost: number  = 100
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

export class Game {
    readonly tiles: Tile[]
    readonly units: Unit[]
    readonly players: Player[]
    curTurn: number

    constructor(tiles:Tile[], units: Unit[], players: Player[]) {
        // need to generate all this...
        this.tiles = tiles
        this.units = units
        this.players = players
        this.curTurn = 0
    }

    get curPlayer() {
        return this.players[this.curTurn]
    }

    queryUnits(tile: Tile, includedOwners: Player[]=[], excludedOwners: Player[]=[]){
        return this.units.filter(u => u.pos == tile && includedOwners.includes(u.owner) && !excludedOwners.includes(u.owner))
    }

    moveUnit(u: Unit, dest: Tile) {
        // TODO: check able to move there
        u.pos = dest
    }

    buyUnit(dest: Tile, unitName: string, player=this.curPlayer) {
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

    startBuildingFortification(tile: Tile, player=this.curPlayer) {
        // takes 3 turns
    }

    resolveCombat(t: Tile) {
        const unitsOnTile = this.units.filter(u => u.pos == t)
        let attackers = unitsOnTile.filter(u => u.owner != t.owner)
        let defenders = unitsOnTile.filter(u=> u.owner == t.owner)
        while (attackers.length > 0 && defenders.length > 0) {
            // combat
        }
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