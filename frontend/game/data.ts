//@ts-check

export const Unit = {
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

export const Descript = {
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

export const Defense = {
    INF: 1,
    INFH: 1,
    APC: 2,
    ARTI: 2,
    AA: 2,
    TANKL: 3,
    TANKH: 5,
    HELI: 3,
    FIG: 2,
    BOM: 2,
}

export const Attack = {
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

export const Move = {
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

export const Accuracy = {
    INF: .8,
    INFH: .8,
    APC: .8,
    ARTI: .33,
    AA: {default: .8, BOM: .25, FIG: .25, HELI: .5},
    TANKL: .8,
    TANKH: .8,
    HELI: 1,
    FIG: .5,
    BOM: .5,
}


const HIGH_AIR_UNITS = [Unit.FIG, Unit.BOM]

export const CantHit = {
    INF: HIGH_AIR_UNITS,
    INFH: HIGH_AIR_UNITS,
    APC: HIGH_AIR_UNITS,
    ARTI: HIGH_AIR_UNITS,
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
*/