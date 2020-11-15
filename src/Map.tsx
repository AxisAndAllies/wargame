import type { Layer, LeafletEventHandlerFnMap, PathOptions } from 'leaflet'
import React, { useState } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import data from './game/50m-map.json'
import type { Feature } from 'geojson'

export const Map = () => {
    const pos = [39, 90]
    // console.log(data)
    const [focusedLayer, setFocusedLayer] = useState<Layer | null>(null)

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
        <MapContainer
            center={{ lat: pos[0], lng: pos[1] }}
            zoom={4}
            scrollWheelZoom={true}
            style={{ height: '90%' }}
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
            />
        </MapContainer>
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
