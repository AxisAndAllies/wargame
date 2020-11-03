class Unit {
    pos: Tile
    owner: Player

    constructor(initialPos: Tile, initialOwner: Player) {
        this.pos = initialPos
        this.owner = initialOwner
    }

    get isAttacker() {
        return this.pos.owner_player !== this.owner
    }
}

class City {
    pos: Tile
    constructor(initialPos: Tile) {
        this.pos = initialPos
    }

    get owner() {
        return this.pos.owner_player
    }

}

class Fortification {
    pos: Tile
    constructor(initialPos: Tile) {
        this.pos = initialPos
    }

    get owner() {
        return this.pos.owner_player
    }
}

class Tile {
    x: number;
    y: number;
    name: string;
    value: number;
    owner_player: Player | null
    owned_turns: number = 0
   
    constructor(initialX: number, initialY: number, name: string, value: number) {
        this.x = initialX;
        this.y = initialY
        this.name = name
        this.value = value
        this.owner_player = null
    }
}

class Player {
    readonly name: string;
    money: number
    constructor(name: string, money: number) {
        this.name = name
        this.money = money
    }
}

class Game {
    tiles: Tile[]
    units: Unit[]
    players: Player[]
    curTurn: number

    constructor() {
        // need to generate all this...
        this.tiles = []
        this.units = []
        this.players = []
        this.curTurn = 0
    }

    curPlayer() {
        return this.players[this.curTurn]
    }

    moveUnit(u: Unit, dest: Tile) {
        u.pos = dest
    }

    tick() {

    }

    resolveCombat(t: Tile) {
        let unitsOnTile = this.units.filter(u => u.pos == t)
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