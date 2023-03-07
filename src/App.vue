<script>
import config from './config';
import debounce from 'debounce';
import { parse } from 'csv-parse/browser/esm/sync';
import 'leaflet/dist/leaflet.css';
import leaflet from 'leaflet';
import EcCouncillors from './components/EcCouncillors.vue';
import EcLogo from './components/EcLogo.vue';
import EcSearch from './components/EcSearch.vue';

let locationIcon;
let map;
let marker;
let postcodes = [];

export default {
  name: 'App',
  components: {
    EcCouncillors,
    EcLogo,
    EcSearch
  },
  data() {
    return {
      currentWardId: '',
      postcode: '',
      started: false,
      wards: [],
      warning: '',
    }
  },
  methods: {

    getPostcodeRecord(postcode) {
      return postcodes.find(p => p.Postcode === postcode);
    },

    scrollToCouncillors(wardName) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const $pos = this
          .$refs[wardName][0]
          .$el;
      if (isLandscape) {
        this.$refs.controls.scrollTo(0, $pos.offsetTop);
      } else {
        const paddingLeft = 16; // Fixes scroll off by 1rem
        this.$refs.councillors.scrollTo($pos.offsetLeft - paddingLeft, 0);
      }
    },

    searchChanged: debounce(function(postcode) {
      this.warning = '';

      if (!postcode) {
        this.resetZoom();
        return;
      }

      if (postcode !== postcode.replace(/[^0-9a-z\s]/gi, '')) {
        this.warning = 'Letters and numbers only, like EH1 1LR';
        return;
      }

      const trimmed = postcode
        .trim()
        .replace(/[^0-9a-z]/gi, '');

      if (
        (trimmed.length === 1 && trimmed.toUpperCase() !== 'E')
        ||
        (trimmed.length > 1 && trimmed.substring(0, 2).toUpperCase() !== 'EH')
      ) {
        this.warning = 'Enter an EH postcode';
        return;
      }

      if (trimmed.length < 6) {
        return;
      }

      if (trimmed.length > 7) {
        this.warning = 'Woops, that\'s too long';
        return;
      }

      const formatted =
        trimmed
          .substr(0, trimmed.length - 3)
          .toUpperCase()
        + ' '
        + trimmed
          .substring(trimmed.length - 3)
          .toUpperCase();

      const record = this.getPostcodeRecord(formatted);

      if (!record) {
        this.warning = 'Couldn\'t find that postcode';
        return;
      }

      this.postcode = record.Postcode;

      let wardLayer = null;
      map.eachLayer(layer => {
        if (layer.feature && layer.feature.properties.Ward_Name === record.Ward) {
          wardLayer = layer;
        }
      });

      if (!wardLayer) {
        alert('Unable to find the correct ward for that postcode.');
      }

      this.showWard(wardLayer);
      this.showPostcode(record.Postcode, record.Latitude, record.Longitude);

      const $input = this.$el.querySelector('input[name="search"]');
      if ($input) {
        $input.blur();
      }

    }, 250),

    showWard(layer) {
      this.clearHighlighted();
      window.console.log(layer);
      this.currentWardId = layer.feature.properties.Ward_Code;
      map.fitBounds(layer.getBounds());
      this.scrollToCouncillors(layer.feature.properties.Ward_Name);
      layer.setStyle({
        fillOpacity: 0.4,
      });
    },

    clearHighlighted() {
      map.eachLayer(layer => {
        if (layer.feature) {
          layer.setStyle({fillOpacity: 0});
        }
      });
      if (marker) {
        map.removeLayer(marker);
      }
    },

    showPostcode(postcode, lat, lon) {
      marker = leaflet
        .marker([lat, lon], {icon: locationIcon})
        .addTo(map);
    },

    resetZoom() {
      this.currentWardId = '';
      this.clearHighlighted();
      map.setView(
        config.map.latlon,
        config.map.zoom
      );
    },
  },
  mounted() {
    var self = this;

    map = leaflet.map('map').setView(
      config.map.latlon,
      config.map.zoom
    );

    leaflet.tileLayer(
      config.map.tiles,
      config.map.tilesConfig
    ).addTo(map);

    locationIcon = leaflet.divIcon({
      html: `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 395.71 395.71"
          >
            <path d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738
              c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388
              C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191
              c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"/>
          </svg>
        `,
      className: 'ec-map-location',
      iconSize: [60, 60],
      iconAnchor: [30, 60],
    });

    fetch(import.meta.env.BASE_URL + config.councillorsUrl)
      .then(r => r.json())
      .then(r => {
        this.wards = r;
      })
      .catch(() => {
        alert('An unexpected error occurred. Unable to load the ward councillors.');
      });

    fetch(import.meta.env.BASE_URL + config.postcodesUrl)
      .then(r => r.text())
      .then(r => {
        postcodes = parse(r, {
          columns: true,
          skip_empty_lines: true
        });
      })
      .catch(() => {
        alert('An unexpected error occurred. Unable to load postcodes.');
      });

    fetch(import.meta.env.BASE_URL + config.map.boundariesUrl)
      .then(r => r.json())
      .then(r => {
        leaflet.geoJSON(
          r.features,
          {
            style() {
              return {
                color: '#E87D78',
                strokeWidth: 1.25,
                fillOpacity: 0,
                fillColor: '#E87D78',
                transition: 'fill-opacity 0.1s',
              }
            },
            onEachFeature(feature, layer) {
              layer.on({
                mouseover(e) {
                  if (feature.properties.Ward_Code === self.currentWardId) {
                    return;
                  }
                  e.target.setStyle({
                    fillOpacity: 0.2,
                  });
                },
                mouseout(e) {
                  if (feature.properties.Ward_Code === self.currentWardId) {
                    return;
                  }
                  e.target.setStyle({
                    fillOpacity: 0
                  });
                },
                click(e) {
                  self.showWard(e.target);
                }
              })
            }
          }
        ).addTo(map);
    })
    .catch(() => {
      alert('An unexpected error occurred. Unable to load the ward boundaries.');
    });
  },
  watch: {
    postcode(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.searchChanged(newVal);
      }
    }
  }
}
</script>

<template>
  <div class="app">
    <div class="controls" ref="controls">
      <div class="header">
        <div class="logo">
          <ec-logo @click="started = false" />
        </div>
        <div class="search">
          <ec-search
            v-model:search="postcode"
            :warning="warning"
          />
        </div>
      </div>
      <div
        v-if="wards.length"
        class="councillors"
        ref="councillors"
      >
        <h2 class="sr-only">Councillors</h2>
        <template v-for="ward in wards" :key="ward.name">
          <ec-councillors
            :councillors="ward.councillors"
            :name="ward.name"
            :number="ward.number"
            :ref="ward.name"
          />
        </template>
      </div>
    </div>
    <div id="map" class="map" />
    <div v-if="!started" class="modal__bg">
      <div class="modal">
        <h1>
          👋 Hiya!
        </h1>
        <p>
          This is a little something I made for my portfolio
           in early 2023. The data may be out of date. Find your current ward councillors at
          <a href="https://democracy.edinburgh.gov.uk/mgMemberIndex.aspx" target="_blank" rel="noopener noreferrer">edinburgh.gov.uk</a>.
        </p>
        <p>
          If you don't know any Edinburgh postcodes, try EH1 1HZ, EH7 4DB or EH15 1AA.
        </p>
        <button @click="started = true">
          Ok, got it!
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
@import 'modern-css-reset';
@import 'assets/css/fonts.css';
@import 'assets/css/variables.css';

html,
body {
  font-family: var(--font-family);

}

a {
  font-weight: 700;
  color: var(--color-link);
  text-decoration: underline;

  &:hover {
    color: var(--color-link-light);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  padding-right: 0.5rem;
  width: 100vw;
  height: 4rem;
  background: var(--color-bg);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.logo {
  height: 3.5rem;
  margin: 0.25rem;
  margin-inline-end: auto;
}

.councillors {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  margin: 0;
  padding: 1rem;
  width: 100vw;
  background: var(--color-bg);
  box-shadow: 0 0 40px rgba(0,0,0,0.3);
  overflow-x: scroll;
  scroll-behavior: smooth;
  scroll-margin-inline-start: 1rem;
  scroll-margin-inline-end: 1rem;
  z-index: 1;
}

.map {
  position: absolute;
  top: 4rem;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  background: var(--color-bg-accent);
  color: var(--color-text-on-accent);
}

.leaflet-tile-container {

  & img {
    filter: grayscale(65%);
  }
}

.modal__bg {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 3;
}

.modal {
  width: 30rem;
  max-width: 90%;
  padding: 2rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  box-shadow: 0 0 3rem rgba(0,0,0,0.5);

  & h1 {
    font-size: var(--text-lg);
    line-height: var(--text-lg-line);
    font-weight: var(--text-weight-bold);
  }

  & p {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  & button {
    display: block;
    width: 100%;
    margin-top: 3rem;
    padding: 0.5rem 1rem;
    background: var(--color-bg-action);
    color: var(--color-text-on-bg-action);
    border: none;
    border-radius: var(--border-radius);

    &:hover {
      background: var(--color-bg-action-hover);
    }

    &:focus {
      outline-offset: 2px;
    }
  }
}

@media (orientation: landscape) {

  .app {
    display: grid;
    grid-template-columns: var(--sidebar-min-width) auto;
  }

  .controls {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--color-bg);
    overflow: scroll;
    box-shadow: 0 0 40px rgba(0,0,0,0.3);
    scroll-behavior: smooth;
  }

  .header {
    position: fixed;
    display: flex;
    z-index: 2;
    width: var(--sidebar-min-width);
    height: 4rem;
  }

  .councillors {
    position: relative;
    top: auto;
    left: auto;
    bottom: auto;
    display: block;
    width: auto;
    height: auto;
    margin-top: 4rem;
    box-shadow: none;
    overflow: visible;
  }

  .map {
    position: relative;
    top: 0;
    z-index: 0;
  }

  @media (min-width: 1000px) {
    .app {
      grid-template-columns: var(--sidebar-width) auto;
    }

    .header  {
      width: var(--sidebar-width);
    }
  }

  @media (min-width: 1400px) {
    .app {
      grid-template-columns: var(--sidebar-max-width) auto;
    }

    .header  {
      width: var(--sidebar-max-width);
    }
  }
}
</style>
