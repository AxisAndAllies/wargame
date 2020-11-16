import { Circle, LayerGroup, SVGOverlay } from 'react-leaflet'
import React, { useMemo } from 'react'
import type { LatLngTuple, Layer } from 'leaflet'
import {
    getScale,
    getPlayerColor,
    getValue,
    getAvg,
    getLargestChunk,
} from './utils'

export const getCenter = (layer: Layer) => {
    const { geometry } = layer.feature
    let center =
        geometry.type == 'MultiPolygon'
            ? getAvg(getLargestChunk(geometry.coordinates)).reverse()
            : layer.getBounds().getCenter()
    // console.log(center)
    return center
}

const convertBounds = (center: LatLngTuple) => {
    let a = [center[0] - 3, center[1] - 3]
    let b = [center[0] + 3, center[1] + 3]
    return [a, b]
}

const Center = ({ layer }: { layer: Layer }) => {
    const { geometry, properties } = layer.feature
    const getRadius = () => getScale(layer) * 10_000
    const center = useMemo(() => {
        return getCenter(layer)
    }, [properties.name])
    const value = getValue(geometry)

    return (
        <>
            <LayerGroup>
                {/* <Circle
                                center={layer?.getCenter()}
                                pathOptions={{ color: '#ffa7ff' }}
                                radius={50_000}
                            />
                            <Circle
                                center={turf
                                    .pointOnFeature(layer?.feature)
                                    .geometry.coordinates.reverse()}
                                pathOptions={{ color: '#273dff' }}
                                radius={100_000}
                            /> */}
                {/* <Rectangle bounds={layer?.getBounds()} /> */}
                {getScale(layer) > 1 && (
                    <Circle
                        center={center}
                        pathOptions={{
                            color: getPlayerColor(layer) || 'black', //'#c3284f',
                        }}
                        radius={getRadius()}
                    />
                )}
                <SVGOverlay
                    attributes={{ stroke: 'red' }}
                    bounds={
                        geometry.type == 'MultiPolygon'
                            ? convertBounds(getCenter(layer))
                            : layer.getBounds()
                    }
                >
                    {/* <rect x="0" y="0" width="100%" height="100%" fill="blue" /> */}
                    {/* <circle r="5" cx="10" cy="10" fill="red" /> */}
                    <text x="50%" y="50%" stroke="black">
                        {value}
                    </text>
                </SVGOverlay>
            </LayerGroup>
            {/* <SVGOverlay attributes={{ stroke: 'red' }} bounds={curBounds}>
                <rect x="0" y="0" width="100%" height="100%" fill="blue" />
                <circle r="5" cx="10" cy="10" fill="red" />
                <text x="50%" y="50%" stroke="white">
                    text
                </text>
            </SVGOverlay> */}
        </>
    )
}

// const allTerritories = ({ geometry }) => (
//     // shows all territories of a country (eg. remote islands)
//     <>
//         {geometry.coordinates.map((coord) => (
//             <>
//                 <Circle
//                     center={getAvg(coord[0]).reverse()}
//                     pathOptions={{
//                         color: '#fffc59',
//                     }}
//                     radius={50_000}
//                 />
//                 <Circle
//                     center={getCentroid2(coord[0]).reverse()}
//                     pathOptions={{
//                         color: '#ffbf59',
//                     }}
//                     radius={50_000}
//                 />
//             </>
//         ))}
//     </>
// )

export default Center
