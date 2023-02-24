export default {
    councillorsUrl: '/councillors.json',
    map: {
        boundariesUrl: '/boundaries.geojson',
        latlon: [55.953, -3.1883],
        tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        tilesConfig: {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        },
        zoom: 12
    },
    postcodesUrl: '/postcodes.csv',
}