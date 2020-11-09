import {UnitType} from './data'
import {Unit, Player, Game, Tile} from './board'

const attack = (attacker: string, defenders: string[]) => {
    // can't let defender pick casualties b/c they have different defense values, so attacker must choose what to attack
}

let p1 = new Player('bob', 20)
let p2 = new Player('alice', 20)

let tile1 = new Tile(1,1,'tile1', 5);



let units: Unit[] = []
units = [...units, ...Object.keys(UnitType).map(t => new Unit(tile1, p1, t))]
units = [...units, ...Object.keys(UnitType).map(t => new Unit(tile1, p2, t))]

let game = new Game([tile1], units, [p1,p2])
// console.log(game.units)
game.units.forEach(u => console.log(u.id, u.cost, '-->', game.queryUnits(tile1, game.players, [u.owner]).filter(enemy => u.canAttack(enemy)[0]).map(enemy => `${enemy.id} (${u.accuracy(enemy)})`)))
