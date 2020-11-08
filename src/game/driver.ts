import {UnitType, Attack, Defense, Descript, Move, Accuracy, CantHit} from './data'
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
game.units.forEach(u => console.log(JSON.stringify(u)))
