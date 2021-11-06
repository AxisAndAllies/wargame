```
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
    - attacker can retreat anytime, but can't fire for that round
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
```
