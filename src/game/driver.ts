import {UnitType} from './data'
import {Unit, Player, Game, Tile} from './board'

const attack = (attacker: string, defenders: string[]) => {
    // can't let defender pick casualties b/c they have different defense values, so attacker must choose what to attack
}

const p1 = new Player('bob', 20)
const p2 = new Player('alice', 20)

const tile1 = new Tile(1,1,'tile1', 5);

tile1.owner = p1;

let units: Unit[] = []
const a = [new Unit(tile1, p1, UnitType.INF), 
    new Unit(tile1, p1, UnitType.INF),
    new Unit(tile1, p1, UnitType.INF),
    new Unit(tile1, p1, UnitType.FIG),
    new Unit(tile1, p1, UnitType.BOM)]
const b = [new Unit(tile1, p2, UnitType.INFH), 
    new Unit(tile1, p2, UnitType.INFH), 
    new Unit(tile1, p2, UnitType.TANKL),
    new Unit(tile1, p2, UnitType.TANKH),
    new Unit(tile1, p2, UnitType.HELI)]
units = [...units, ...a, ...b]
let game = new Game([tile1], units, [p1,p2])
// console.log(game.units)
// game.units.forEach(u => console.log(u.id, u.cost, '-->', game.queryUnits(tile1, game.players, [u.owner]).filter(enemy => u.canAttack(enemy)[0]).map(enemy => `${enemy.id} (${u.accuracy(enemy)})`)))
// game.resolveCombat(tile1)

const mockExports = {
    mockTile: tile1,
    mockGame: game
}
export default mockExports
