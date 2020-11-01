
export const Unit: Record<string, string> = {
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
    INFH: 2,
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
    INF: {default: .8},
    INFH: {default: .8},
    APC: {default: .8},
    ARTI: {default: .33},
    AA: {default: .8, BOM: .25, FIG: .25, HELI: .5},
    TANKL: {default: .8},
    TANKH: {default: .8},
    HELI: {default: 1},
    FIG: {default: .5},
    BOM: {default: .5},
}


const HIGH_AIR_UNITS = [Unit.FIG, Unit.BOM]

export const CantHit: Record<string, string[]>= {
    INF: HIGH_AIR_UNITS,
    INFH: HIGH_AIR_UNITS,
    APC: HIGH_AIR_UNITS,
    ARTI: [Unit.BOM, Unit.FIG, Unit.HELI],
    AA: [],
    TANKL: HIGH_AIR_UNITS,
    TANKH: HIGH_AIR_UNITS,
    HELI: HIGH_AIR_UNITS,
    FIG: [],
    BOM: [Unit.BOM, Unit.FIG, Unit.HELI],
}

/*
artillery can fire into adjacent regions without moving in, although would expose themselves to counter-battery fire
AA is .2 accuracy vs air, .8 vs ground
all units can go through hostile territories, attacking + taking AA fire, and go back in friendly territory
to be able to HIT something, you must have attack >= their defense, AND they can't be in the "CantHit" list


TODO:
factories
*/