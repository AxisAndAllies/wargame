import type {
    LeafletEventHandlerFnMap,
    PathOptions,
    Layer,
    LatLngTuple,
} from 'leaflet'
import React, { useMemo, useRef, useState } from 'react'
import {
    MapContainer,
    GeoJSON,
    SVGOverlay,
    Circle,
    LayerGroup,
} from 'react-leaflet'
import data from './game/50m-map.json'
import type { Feature } from 'geojson'
import { Text } from 'theme-ui'
import Menu from './Menu'

export const Map = () => {
    const pos = [39, 90]
    const mapRef = useRef(null)
    const [focusedLayer, setFocusedLayer] = useState<Layer | null>(null)

    const curBounds: LatLngTuple = useMemo(() => {
        // console.log('ee', focusedLayer?.getBounds())
        return [
            [51.49, -0.01],
            [51.51, -0.07],
        ]
    }, [focusedLayer])

    const resetLayerStyle = (layer: Layer) => {
        layer?.setStyle({
            // color: '#444',
            // weight: 1,
            fillColor: mapColors.base,
        })
    }

    const eventHandlers: LeafletEventHandlerFnMap = {
        click: (e) => {
            resetLayerStyle(focusedLayer!)
            e.propagatedFrom.setStyle({
                // color: '#999',
                // weight: 3,
                fillColor: mapColors.highlight,
            })
            setFocusedLayer(e.propagatedFrom)
        },
        mouseover: (e) => {
            if (focusedLayer == e.layer) {
                return
            }
            e.propagatedFrom.setStyle({
                // color: '#999',
                // weight: 3,
                fillColor: mapColors.dark,
            })
        },
        mouseout: (e) => {
            if (focusedLayer == e.layer) {
                return
            }
            resetLayerStyle(e.propagatedFrom)
        },
    }

    return (
        <>
            {focusedLayer && <Menu layer={focusedLayer} />}
            <MapContainer
                center={{ lat: pos[0], lng: pos[1] }}
                zoom={4}
                scrollWheelZoom={true}
                style={{ height: '90%', zIndex: 1 }}
            >
                {/* <TileLayer
                    attribution="https://geojson-maps.ash.ms/"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> */}
                <GeoJSON
                    attribution="https://geojson-maps.ash.ms/"
                    data={data}
                    style={style || computedStyle}
                    eventHandlers={eventHandlers}
                    ref={mapRef}
                />

                {focusedLayer && (
                    <>
                        <LayerGroup>
                            <Circle
                                center={focusedLayer?.getBounds().getCenter()}
                                pathOptions={{ color: 'purple' }}
                                radius={50_000}
                            />
                            <Circle
                                center={focusedLayer?.getCenter()}
                                pathOptions={{ color: '#ffa7ff' }}
                                radius={50_000}
                            />
                            {/* <Circle
                                center={getCentroid2(
                                    getLargestChunk(
                                        focusedLayer?.feature.geometry
                                            .coordinates
                                    )
                                )}
                                pathOptions={{ color: '#ff5983' }}
                                radius={50_000}
                            /> */}
                            {focusedLayer?.feature.geometry.type ==
                                'MultiPolygon' && (
                                <>
                                    {focusedLayer?.feature.geometry.coordinates.map(
                                        (coord) => (
                                            <Circle
                                                center={getAvg(coord[0])}
                                                pathOptions={{
                                                    color: '#fffc59',
                                                }}
                                                radius={50_000}
                                            />
                                        )
                                    )}
                                    {focusedLayer?.feature.geometry.coordinates.map(
                                        (coord) => (
                                            <Circle
                                                center={getCentroid2(coord[0])}
                                                pathOptions={{
                                                    color: '#ffbf59',
                                                }}
                                                radius={50_000}
                                            />
                                        )
                                    )}
                                </>
                            )}
                        </LayerGroup>
                        <SVGOverlay
                            attributes={{ stroke: 'red' }}
                            bounds={curBounds}
                        >
                            <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="blue"
                            />
                            <circle r="5" cx="10" cy="10" fill="red" />
                            <text x="50%" y="50%" stroke="white">
                                text
                            </text>
                        </SVGOverlay>
                    </>
                )}
            </MapContainer>
            {/* <Text>
                {JSON.stringify(mapRef.current?.leafletElement?.getBounds())}
            </Text> */}
        </>
    )
}

const mapColors = { base: '#5c8b70', highlight: '#a7cab6', dark: '#485f5b' }

function getColor(d: number) {
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
const style: PathOptions = {
    stroke: true,
    fill: true,
    fillColor: mapColors.base,
    fillOpacity: 0.5,
    color: '#444',
    weight: 1,
}

function computedStyle(feature: Feature) {
    // console.log(feature)
    return {
        fillColor: getColor(feature.properties?.gdp_md_est),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
    }
}

const getLargestChunk = (coords: [number][][]) => {
    coords = coords.sort((a, b) => b[0].length - a[0].length)
    let maxCoords = coords[0]
    if (maxCoords.length == 1) maxCoords = maxCoords[0]
    // coords.map((c) => {
    //     console.log(c.length, maxCoords.length)
    //     if (c.length > maxCoords.length) maxCoords = c
    // })
    return maxCoords
}

var getAvg = function (arr: [number, number][]): [number, number] {
    let res = arr.reduce(
        function (x, y) {
            return [x[0] + y[0] / arr.length, x[1] + y[1] / arr.length]
        },
        [0, 0]
    )
    return res
}

const getCentroid2 = (arr: [number, number][]): [number, number] => {
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
    let res = [
        cxTimes6SignedArea / sixSignedArea,
        cyTimes6SignedArea / sixSignedArea,
    ]
    return res
}
