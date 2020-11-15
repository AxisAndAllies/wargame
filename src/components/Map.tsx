import type { LeafletEventHandlerFnMap, Layer } from 'leaflet'
import React, { useMemo, useRef, useState } from 'react'
import {
    MapContainer,
    GeoJSON,
    SVGOverlay,
    Circle,
    LayerGroup,
    Rectangle,
} from 'react-leaflet'
import data from '../game/50m-map.json'
import type { Feature } from 'geojson'
import { Text } from 'theme-ui'
import Menu from './Menu'
import mockExports from '../game/driver'
import { Tile } from '../game/game'
import Center, { getCenter } from './TileCenter'
import { getPlayerColor, getValue, mapColors, style } from './MapStyles'
// import * as turf from '@turf/turf'
const { mockGame } = mockExports

// process data
data.features.forEach(({ properties, geometry }) => {
    // add tiles
    const value = getValue(geometry)

    const newTile = new Tile(0, 0, '', value, properties.name)
    mockGame.addTile(newTile)
})

export const Map = () => {
    const pos = [39, 90]
    const mapRef = useRef(null)
    const [focusedLayer, setFocusedLayer] = useState<Layer | null>(null)
    const [units, setUnits] = useState(mockGame.units)

    // const curBounds: LatLngTuple = useMemo(() => {
    //     // console.log('ee', focusedLayer?.getBounds())
    //     return [
    //         [51.49, -0.01],
    //         [51.51, -0.07],
    //     ]
    // }, [focusedLayer])

    const centerComponent = useMemo(() => {
        return focusedLayer ? <Center layer={focusedLayer} /> : null
    }, [units.length, focusedLayer])

    const centers = useMemo(() => {
        let res: JSX.Element[] = []
        mapRef.current?.eachLayer((e) => {
            // console.log(getValue(e.feature.geometry))
            res.push(<Center layer={e} />)
        })
        return res.length ? <>{...res}</> : null
    }, [units.length, focusedLayer])

    // const costs = useMemo(() => {
    //     let res: JSX.Element[] = []
    //     mapRef.current?.eachLayer((e) => {
    //         // console.log(getValue(e.feature.geometry))
    //         const value = getValue(e.feature.geometry)
    //         const center = getCenter(e)
    //         console.log(center)
    //         res.push(
    //             <text
    //                 x={center[0] * 4 + 300}
    //                 y={center[1] * 4 + 200}
    //                 stroke="black"
    //                 fontSize="1.5em"
    //             >
    //                 {value}
    //             </text>
    //         )
    //     })
    //     return res.length ? <>{...res}</> : null
    // }, [mapRef.current])

    const resetLayerStyle = (layer: Layer) => {
        layer?.setStyle({
            // color: '#444',
            // weight: 1,
            fillColor: getPlayerColor(layer) || mapColors.base,
            fillOpacity: 0.5,
            color: '#444',
            weight: 1,
        })
    }

    const eventHandlers: LeafletEventHandlerFnMap = {
        click: (e) => {
            resetLayerStyle(focusedLayer!)
            e.propagatedFrom.setStyle({
                fillColor:
                    getPlayerColor(e.propagatedFrom) || mapColors.highlight,
                fillOpacity: 0.3,
                color: 'white',
                weight: 2,
            })
            e.propagatedFrom.bringToFront()
            setFocusedLayer(e.propagatedFrom)
        },
        mouseover: (e) => {
            if (focusedLayer == e.layer) {
                return
            }
            e.propagatedFrom.setStyle({
                // color: '#999',
                fillColor: getPlayerColor(e.propagatedFrom) || mapColors.dark,
                fillOpacity: 0.7,
                color: 'white',
                weight: 2,
            })
            e.propagatedFrom.bringToFront()
        },
        mouseout: (e) => {
            if (focusedLayer == e.layer) {
                return
            }
            resetLayerStyle(e.propagatedFrom)
            e.propagatedFrom.bringToBack()
        },
    }

    return (
        <>
            {focusedLayer && (
                <Menu
                    layer={focusedLayer}
                    tile={mockGame.getTile(
                        focusedLayer.feature.properties.name
                    )}
                    units={mockGame.queryUnits(
                        mockGame.getTile(focusedLayer.feature.properties.name)
                    )}
                    buyUnit={(type: string, tileId: string) => {
                        mockGame.buyUnit(type, tileId)
                        // lol not reactive :/
                        focusedLayer.setStyle({
                            fillColor: getPlayerColor(focusedLayer),
                        })
                        setUnits([...mockGame.units])
                    }}
                    endTurn={mockGame.nextTurn.bind(mockGame)}
                />
            )}
            <MapContainer
                center={{ lat: pos[0], lng: pos[1] }}
                zoom={4}
                scrollWheelZoom={true}
                style={{ height: '90%', zIndex: 1 }}
            >
                <GeoJSON
                    attribution="https://geojson-maps.ash.ms/"
                    data={data}
                    style={style}
                    eventHandlers={eventHandlers}
                    ref={mapRef}
                />

                {centerComponent}
                {centers}
            </MapContainer>
        </>
    )
}
