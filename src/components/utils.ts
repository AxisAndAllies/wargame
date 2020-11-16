import type { Layer, PathOptions } from "leaflet"
import mockExports from '../game/driver'

const {mockGame} = mockExports

export const getScale = (layer: Layer) => {
    const { geometry, properties } = layer.feature
    const tile = mockGame.getTile(properties.name)
    const units = mockGame.queryUnits(tile)
    const sumValue = units.reduce((acc, val) => acc + val.cost, 0)
    // let res = Math.sqrt(mockGame.queryUnits(tile).length) * 3 + 1
    // let res = Math.sqrt(sumValue) + 2
    let res = Math.ceil(sumValue / 4) + 1
    return res
}

export const getValue = (geometry) => {
    let res= geometry.type == 'MultiPolygon'
            ? Math.min(16, geometry.coordinates.length)
            : 1
    return res
}

export const getPlayerColor = (layer: Layer) => {
    const { geometry, properties } = layer.feature
    const tile = mockGame.getTile(properties.name)
    const units = mockGame.queryUnits(tile)
    if (!units.length) return null
    return units[0].owner.color
}

export const mapColors = { base: '#5c8b70', highlight: '#b1e9c9', dark: '#485f5b' }

export function getColor(d: number) {
    // return d > 1000
    //     ? '#800026'
    //     : d > 500
    //     ? '#BD0026'
    //     : d > 200
    //     ? '#E31A1C'
    //     : d > 100
    //     ? '#FC4E2A'
    //     : d > 50
    //     ? '#FD8D3C'
    //     : d > 20
    //     ? '#FEB24C'
    //     : d > 10
    //     ? '#FED976'
    //     : '#FFEDA0'

    return d > 1_000_000
        ? '#800026'
        : d > 500_000
        ? '#BD0026'
        : d > 200_000
        ? '#E31A1C'
        : d > 100_000
        ? '#FC4E2A'
        : d > 50_000
        ? '#FD8D3C'
        : d > 20_000
        ? '#FEB24C'
        : d > 10_000
        ? '#FED976'
        : '#FFEDA0'
}
export const style: PathOptions = {
    stroke: true,
    fill: true,
    fillColor: mapColors.base,
    fillOpacity: 0.5,
    color: '#444',
    weight: 1,
}

export function computedStyle(feature: Feature) {
    // console.log(feature)
    return {
        // fillColor: getColor(feature.properties?.gdp_md_est),
        fillColor: getPlayerColor(name),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
    }
}
