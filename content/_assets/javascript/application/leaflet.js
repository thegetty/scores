import "leaflet/dist/leaflet.css"
import "maplibre-gl"
import "@maplibre/maplibre-gl-leaflet"
import { geojsonFeature } from "./geojson.js"

const mapContainer = document.getElementById('leafletmap')

if (mapContainer) {

  mapContainer.style.visibility = 'hidden'

  const map = L.map('leafletmap').setView([39.4, -39.2], 3);

  // https://gist.github.com/geog4046instructor/80ee78db60862ede74eacba220809b64
  // replace Leaflet's default blue marker with a custom icon
  function createCustomIcon (feature, latlng) {
    let myIcon = L.icon({
      iconUrl: '/publications/scores/_assets/images/icons/marker.png',
      iconSize:     [30, 55], // width and height of the image in pixels
      iconAnchor:   [15, 55], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
    })
    return L.marker(latlng, { icon: myIcon })
  }

  // https://docs.stadiamaps.com/guides/switching-your-maps-from-raster-to-vector-tiles/
  // Use vector tiles
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

  const mapLinks = document.querySelectorAll('.maplink')

  if (mapLinks.length > 0) {
    // mapLink.addEventListener('click', (e) => {
    //   e.preventDefault(); // Prevent the default link behavior
    //   map.setView([40.7128, -74.0060], 12); // New York City coordinates and zoom level
    // });

    // Handle the link clicks
    mapLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior
        const coords = link.getAttribute('data-coordinates').split(',');
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
        const zoom = parseInt(coords[2], 10);
        map.setView([lat, lng], zoom);
      });
    });

  };

  mapContainer.style.visibility = 'visible';
  if (mapContainer.style.visibility === true) mapContainer.resize();
  if (mapContainer.style.visibility === true) map.resize();
  
}
