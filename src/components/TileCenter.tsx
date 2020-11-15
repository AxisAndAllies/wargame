import { Circle, LayerGroup, SVGOverlay } from 'react-leaflet'
import React, { useMemo } from 'react'
import type { LatLngTuple, Layer } from 'leaflet'
import { getScale, getPlayerColor } from './MapStyles'

const Center = ({ layer }: { layer: Layer }) => {
    const { geometry, properties } = layer.feature
    if (getScale(layer) <= 1) return null
    const getRadius = () => getScale(layer) * 10_000
    const center = useMemo(() => {
        return geometry.type == 'MultiPolygon'
            ? getAvg(getLargestChunk(geometry.coordinates)).reverse()
            : layer.getBounds().getCenter()
    }, [layer])

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
                <Circle
                    center={center}
                    pathOptions={{
                        color: getPlayerColor(layer) || 'black', //'#c3284f',
                    }}
                    radius={getRadius()}
                />
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

const getLargestChunk = (coords: [LatLngTuple[]][]) => {
    let maxCoords = coords.sort((a, b) => b[0].length - a[0].length)[0]
    let res = maxCoords[0]
    // coords.map((c) => {
    //     console.log(c.length, maxCoords.length)
    //     if (c.length > maxCoords.length) maxCoords = c
    // })
    return res
}

var getAvg = function (arr: LatLngTuple[]): LatLngTuple {
    let res = arr.reduce(
        function (x, y) {
            return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length]
        },
        [0, 0]
    )
    return res
}

const getCentroid2 = (arr: LatLngTuple[]): LatLngTuple => {
    // from https://stackoverflow.com/questions/22796520/finding-the-center-of-leaflet-polygon
    let twoTimesSignedArea = 0
    let cxTimes6SignedArea = 0
    let cyTimes6SignedArea = 0

    let length = arr.length

    let x = function (i: number) {
        return arr[i % length][0]
    }
    let y = function (i: number) {
        return arr[i % length][1]
    }

    for (let i = 0; i < arr.length; i++) {
        let twoSA = x(i) * y(i + 1) - x(i + 1) * y(i)
        twoTimesSignedArea += twoSA
        cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA
        cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA
    }

    let sixSignedArea = 3 * twoTimesSignedArea
    let res: LatLngTuple = [
        cxTimes6SignedArea / sixSignedArea,
        cyTimes6SignedArea / sixSignedArea,
    ]
    return res
}

export default Center
