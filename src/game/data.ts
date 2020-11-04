
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

export const Descript: Record<string, string> = {
    INF: "infantry",
    INFH: "heavy infantry (anti-tank, anti-aircraft)",
    APC: "armored personel carrier",
    ARTI: "artillery",
    AA: "anti-air",
    TANKL: "light tank",
    TANKH: "heavy tank",
    HELI: "helicopter",
    FIG: "fighter",
    BOM: "bomber",
}

export const Defense: Record<string, number> = {
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

export const Attack: Record<string, number> = {
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

export const Move: Record<string, number> = {
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

export const Accuracy: Record<string, Record<string, number>> = {
    INF: {default: .6},
    INFH: {default: .6},
    APC: {default: .6},
    ARTI: {default: .25},
    AA: {default: .6, BOM: .2, FIG: .2, HELI: .4},
    TANKL: {default: .6},
    TANKH: {default: .6},
    HELI: {default: .6},
    FIG: {default: .4},
    BOM: {default: .5},
}

export const Cost: Record<string, number> = {
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
artillery can fire into adjacent regions without moving in, although would expose themselves to counter-battery fire

AA has accuracy depending on what it's hitting

bomber can hit 2 targets?

air units can go through hostile territories, attacking + taking AA fire, and go back in friendly territory

to be able to HIT something, you must have attack >= their defense, AND they can't be in the "CantHit" list

you can choose to "fortify" an area, which takes 3 turns + costs $$$, but on completion gives -25% accuracy penalty to attackers
    - (eg. 80% accuracy --> 60% accuracy, or 50% accuracy --> 37.5% accuracy)
    - enemy can use fortifications if they capture

cities gives -25% accuracy penalty to attackers to all attackers

units are only resupplied when connected to resupply lines that enemies can destroy, after which they have 3 fights worth of ammo?

IN combat:
    - each "round" consists of attacker fire, followed by defender fire
    - defender can retreat anytime, but can't fire for that round

TODO:
factories?? (or can just produce in cities?)
APC can carry 2 INF or INFH
*/