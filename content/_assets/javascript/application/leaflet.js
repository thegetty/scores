import L from "leaflet"
import "maplibre-gl"
import "@maplibre/maplibre-gl-leaflet"
import { geojsonFeature } from "./geojson.js"
// import maplibreGL from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';

import 'leaflet/dist/leaflet.css'

const map = L.map('leafletmap').setView([39.4, -39.2], 4);

// L.tileLayer('https://cawm.lib.uiowa.edu/tiles/{z}/{x}/{y}.png', {
//     maxZoom: 10,
//     minZoom: 5,
//     attribution: '&copy; <a href="">Ancient World Mapping Center</a>'
// }).addTo(map);

// https://gist.github.com/geog4046instructor/80ee78db60862ede74eacba220809b64
// replace Leaflet's default blue marker with a custom icon
function createCustomIcon (feature, latlng) {
  let myIcon = L.icon({
    iconUrl: '/_assets/images/icons/marker.png',
    iconSize:     [30, 55], // width and height of the image in pixels
    iconAnchor:   [15, 55], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
  })
  return L.marker(latlng, { icon: myIcon })
}

L.maplibreGL({
  style: 'https://tiles.stadiamaps.com/styles/stamen_toner_lite.json', 
  attribution: 'Map tiles by <a href="https://stamen.com/" target="_blank">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>. Data by <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>, under <a href="https://www.openstreetmap.org/copyright" target="_blank">ODbL</a>.',
}).addTo(map);

// https://savaslabs.com/blog/mapping-external-geojson-data
L.geoJSON(geojsonFeature, {
  onEachFeature: function(feature, layer) {
    const heading = feature.properties.heading ? `${feature.properties.heading}` : ''
    const address = feature.properties.address ? `${feature.properties.address}` : ''
    const description = feature.properties.description ? `${feature.properties.description}` : ''
    const popupText = `
      <strong>${heading}</strong><br />
      <em>${address}</em><br />
      ${description}
    `
    layer.bindPopup(popupText); },
  pointToLayer: createCustomIcon
}).addTo(map);