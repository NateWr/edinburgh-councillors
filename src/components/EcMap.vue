<template>
  <div :id="id" class="ec-map" />
</template>

<script>
import 'leaflet/dist/leaflet.css';
import config from './../config';
import leaflet from 'leaflet';

export default {
  props: {
    id: String
  },
  mounted() {
    const map = leaflet.map('map').setView(
      config.map.latlon,
      config.map.zoom
    );

    leaflet.tileLayer(
      config.map.tiles,
      config.map.tilesConfig
    ).addTo(map);

    fetch(config.map.boundariesUrl)
      .then(r => r.json())
      .then(r => {
        let self = this;
        leaflet.geoJSON(
          r.features,
          {
            className: 'ec-map-ward',
            onEachFeature(feature, layer) {
              layer.on({
                click() {
                  self.$emit('ward:clicked', feature.properties.Ward_Name);
                }
              })
            }
          }
        ).addTo(map);
    })
    .catch(() => {
      alert('An unexpected error occurred. Unable to load the ward boundaries.');
    });

  }
}
</script>


<style lang="postcss">
@import '../assets/css/variables.css';

.ec-map {
  background: var(--color-bg-accent);
  color: var(--color-text-on-accent);

  .leaflet-tile-container {
    img {
      filter: grayscale(65%);
    }
  }
}

.ec-map-ward {
  stroke: var(--color-link);
  stroke-width: 1.25;
  fill-opacity: 0;
  fill: var(--color-link);
  transition: fill-opacity 0.1s;

  &:hover {
    fill-opacity: 0.1;
  }
}
</style>