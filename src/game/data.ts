
export type NumMap = Record<string, number>
export type StrMap = Record<string, string>
export type Hit = {type: string, numHits: number, actionable?: number}

export const UnitType: Record<string, string> = {
    INF: "INF",
    INFH: "INFH",
    APC: "APC",
    ARTI: "ARTI",
    AA: "AA",
    TANKL: "TANKL",
    TANKH: "TANKH",
    HELI: "HELI",
    FIG: "FIG",
    BOM: "BOM",
}

export const Descript: StrMap = {
    INF: "infantry",
    INFH: "heavy infantry",
    APC: "armored personel carrier",
    ARTI: "artillery",
    AA: "anti-air",
    TANKL: "light tank",
    TANKH: "heavy tank",
    HELI: "helicopter",
    FIG: "fighter",
    BOM: "bomber",
}

export const Defense: NumMap = {
    INF: 1,
    INFH: 1,
    APC: 2,
    ARTI: 1,
    AA: 2,
    TANKL: 3,
    TANKH: 5,
    HELI: 3,
    FIG: 2,
    BOM: 2,
}

export const Attack: NumMap = {
    INF: 2,
    INFH: 3,
    APC: 3,
    ARTI: 3,
    AA: 4,
    TANKL: 5,
    TANKH: 7,
    HELI: 4,
    FIG: 5,
    BOM: 8,
}
export const MAX_ATTACK = 10;

export const Move: NumMap = {
    INF: 2,
    INFH: 2,
    APC: 4,
    ARTI: 1,
    AA: 2,
    TANKL: 3,
    TANKH: 3,
    HELI: 5,
    FIG: 5,
    BOM: 6,
}

// export const Accuracy: Record<string, NumMap> = {
//     INF: {default: .6},
//     INFH: {default: .6},
//     APC: {default: .6},
//     ARTI: {default: .25},
//     AA: {default: .6, BOM: .3, FIG: .3, HELI: .3},
//     TANKL: {default: .6},
//     TANKH: {default: .6},
//     HELI: {default: .6},
//     FIG: {default: .4},
//     BOM: {default: .5},
// }

export const Cost: NumMap = {
    INF: 1,
    INFH: 2,
    APC: 4,
    ARTI: 3,
    AA: 3,
    TANKL: 5,
    TANKH: 8,
    HELI: 5,
    FIG: 10,
    BOM: 15,
}


const HIGH_AIR_UNITS = [UnitType.FIG, UnitType.BOM]

export const CantHit: Record<string, string[]>= {
    INF: HIGH_AIR_UNITS,
    INFH: HIGH_AIR_UNITS,
    APC: HIGH_AIR_UNITS,
    ARTI: [UnitType.BOM, UnitType.FIG, UnitType.HELI],
    AA: [],
    TANKL: HIGH_AIR_UNITS,
    TANKH: HIGH_AIR_UNITS,
    HELI: HIGH_AIR_UNITS,
    FIG: [],
    BOM: [UnitType.BOM, UnitType.FIG, UnitType.HELI],
}

/*
UNIQUENESS

bomber can hit 2 targets

air units can go through hostile territories, attacking + taking AA fire, and go back in friendly territory

to be able to HIT something, you must have attack >= their defense, AND they can't be in the "CantHit" list

you can choose to "fortify" an area, which takes 3 turns + costs $$$, but on completion gives -25% accuracy penalty to attackers
    - (eg. 80% accuracy --> 60% accuracy, or 50% accuracy --> 37.5% accuracy)
    - enemy can use fortifications if they capture

cities gives -25% accuracy penalty to attackers to all attackers

IN combat:
    - each "round" consists of attacker fire, followed by defender fire
    - defender can retreat anytime, but can't fire for that round

TODO:
factories?? (or can just produce in cities?)
APC can carry 2 INF or INFH
artillery can fire into adjacent regions without moving in, although would expose themselves to counter-battery fire
AA has accuracy depending on what it's hitting?
units are only resupplied when connected to resupply lines that enemies can destroy, after which they have 3 fights worth of ammo?

*/

/**ISSUES

even if sorting hits by most selective --> least selective, can still game the system?
- also sort by least attack --> most attack tiebreaker
eg. 1 INFH hit, 1 AA hit, you have 1 tankl, 1 fig
    - ideally would be both hit (infh --> tankl, aa --> fig)
    - but in actuality, can do (aa --> tanlk), in which case fig lives since inf can't attack fig

- also possible to end up in scenario where neither can hit each other (eg. bomber, heli)

*/