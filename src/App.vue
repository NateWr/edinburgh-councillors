<template>
  <div class="app">
    <div class="controls" ref="controls">
      <div class="header">
        <div class="logo">
          <ec-logo href="#" />
        </div>
        <div class="search">
          <ec-search />
        </div>
      </div>
      <div
        v-if="currentWards.length"
        class="councillors"
        ref="councillors"
      >
        <h2 class="sr-only">Councillors</h2>
        <template v-for="ward in currentWards" :key="ward.name">
          <ec-councillors
            :councillors="ward.councillors"
            :name="ward.name"
            :number="ward.number"
            :ref="ward.name"
          />
        </template>
      </div>
    </div>
    <ec-map
      id="map"
      class="map"
      @ward:clicked="openWard"
    />
  </div>
</template>

<script>
import config from './config';
import EcCouncillors from './components/EcCouncillors.vue';
import EcLogo from './components/EcLogo.vue';
import EcMap from './components/EcMap.vue';
import EcSearch from './components/EcSearch.vue';

export default {
  name: 'App',
  components: {
    EcCouncillors,
    EcLogo,
    EcMap,
    EcSearch
  },
  data() {
    return {
      currentWardName: '',
      wards: []
    }
  },
  computed: {
    currentWards() {
      return this.currentWardName
        ? [this.getWard(this.currentWardName)].filter()
        : this.wards;
    }
  },
  methods: {
    getWard(wardName) {
      return this.wards.find(ward => ward.name === wardName)
    },
    openWard(wardName) {
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
    }
  },
  mounted() {
    fetch(config.map.councillorsUrl)
      .then(r => r.json())
      .then(r => {
        this.wards = r;
      })
      .catch(() => {
        alert('An unexpected error occurred. Unable to load the ward councillors.');
      });
  }
}
</script>

<style lang="postcss">
@import 'assets/css/fonts.css';
@import 'assets/css/variables.css';

html,
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
}

.map {
  position: absolute;
  top: 4rem;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
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
    z-index: 1;
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
