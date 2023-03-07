<script>
import EcAction from "./EcAction.vue";

export default {
  components: {
    EcAction,
  },
  props: {
    name: String,
    number: Number,
    councillors: Array,
  },
};
</script>

<template>
  <div class="ec-councillors">
    <h3 class="ec-ward-name">
      <span class="ec-ward-name__name">
        {{ name }}
      </span>
      <span class="ec-ward-name__number">
        Ward {{ number }}
      </span>
    </h3>
    <ul class="ec-councillors-list">
      <li
        v-for="councillor in councillors"
        :key="councillor.name"
        class="ec-councillor"
      >
        <img
          class="ec-councillor-image"
          :src="councillor.photo ?? '/images/councillor-no-portrait.png'"
        />
        <div class="ec-councillor-details">
          <h4 class="ec-councillor-name">
            {{ councillor.name }}
          </h4>
          <div class="ec-councillor-party">
            {{ councillor.party }}
          </div>
          <div class="ec-councillor-actions">
            <ec-action
              :disabled="!councillor.phone"
              :aria-label="'Call ' + councillor.name"
              :href="councillor.phone ? 'tel:' + councillor.phone : null"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                />
              </svg>
            </ec-action>
            <ec-action
              :disabled="!councillor.email"
              :aria-label="'Email ' + councillor.name"
              :href="councillor.email ? 'mailto:' + councillor.email : null"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                />
              </svg>
            </ec-action>
            <ec-action
              :disabled="!councillor.url"
              :aria-label="'Visit website for ' + councillor.name"
              rel="noreferrer noopener"
              target="_blank"
              :href="councillor.url"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  d="M288 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h50.7L169.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L384 141.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H288zM80 64C35.8 64 0 99.8 0 144V400c0 44.2 35.8 80 80 80H336c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h80c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"
                />
              </svg>
            </ec-action>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss">
@import "../assets/css/variables.css";

.ec-councillors {
  position: relative;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
}

.ec-ward-name {
  position: sticky;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  line-height: var(--text-sm-line);
  font-weight: var(--text-weight-semibold);
  left: 0;
  width: calc(100vw - 2rem);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--color-link);
}

.ec-ward-name__name {
  white-space: nowrap;
}

.ec-ward-name__number {
  font-size: var(--text-xs);
  line-height: var(--text-xs-line);
  font-weight: var(--text-weight-normal);
  color: var(--color-text-light);
  letter-spacing: 0.025em;
  white-space: nowrap;
  text-transform: uppercase;
}

.ec-councillors-list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ec-councillor {
  display: grid;
  grid-template-columns: 8rem 12rem;
  margin-right: 1rem;
  min-width: 20rem;
  box-shadow: 0 2px 5px #5f050022;
  outline: 1px solid #ff50461c;
  overflow: hidden;

  &:last-child {
    margin-right: 0;
  }
}

.ec-councillor-image {
  width: 8rem;
  height: 8rem;
}

.ec-councillor-details {
  position: relative;
  padding: 0.5rem 1rem;
}

.ec-councillor-name {
  font-weight: var(--text-weight-bold);
  margin-bottom: 0.25rem;
  line-height: 1rem;
}

.ec-councillor-party {
  font-size: var(--text-xs);
  line-height: var(--text-xs-line);
}

.ec-councillor-actions {
  position: absolute;
  display: grid;
  grid-template-columns: 33% 34% 33%;
  bottom: 0.5rem;
  left: 1rem;
  right: 0.5rem;
  background: var(--color-link);
  border-radius: var(--border-radius);
  overflow: hidden;
}

@media (orientation: landscape) {

  .ec-councillors {
    margin-right: 0;
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .ec-ward-name {
    width: 100%;
  }

  .ec-councillors-list {
    display: block;
  }

  .ec-councillor {
    width: 100%;
    grid-template-columns: 40% 60%;
    min-width: auto;
    margin-right: 0;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .ec-councillor-image {
    width: 100%;
    height: auto;
  }

  @media (min-width: 1280px) {
    .ec-councillor {
      grid-template-columns: 8rem auto;
    }

    .ec-councillor-image {
      width: 8rem;
    }
  }

  @media (min-width: 1400px) {

    .ec-ward-name__name {
      font-size: var(--text-xl);
      line-height: var(--text-xl-line);
    }

    .ec-ward-name__number {
      font-size: var(--text-base);
      line-height: var(--text-base-line);
    }

    .ec-councillor {
      grid-template-columns: 10rem auto;
    }

    .ec-councillor-name {
      font-size: var(--text-xl);
      line-height: 1.25rem;
      margin-bottom: 0;
    }

    .ec-councillor-party {
      font-size: var(--text-base);
      line-height: 1.25rem;
    }

    .ec-councillor-image {
      width: 10rem;
    }
  }
}
</style>