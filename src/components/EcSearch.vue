<script>
export default {
  props: ['search', 'warning'],
  emits: ['update:search'],
}
</script>

<template>
  <div class="ec-search">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/>
    </svg>
    <input
      type="search"
      name="search"
      placeholder="Find by postcode"
      :value="search"
      @input="$emit('update:search', $event.target.value)"
    >
    <div v-if="warning" class="ec-warning">
      {{ this.warning }}
    </div>
  </div>
</template>

<style lang="postcss">
@import '../assets/css/variables.css';

.ec-search {
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    width: 1rem;
    height: auto;
    transform: translateY(-50%);

    path {
      fill: var(--color-link-light);
    }
  }

  input {
    width: 100%;
    padding: 0.5rem 0 0.5rem 2rem;
    border: var(--input-border);
    border-radius: var(--input-radius);
    background: transparent;
    color: var(--input-color);
    font-family: var(--font-family);
  }

  &:hover input,
  input:focus {
    border: var(--input-focus-border);
    outline: var(--input-focus-outline);
  }
}

.ec-search:focus-within {
  svg path {
    fill: var(--color-link);
  }
}

.ec-warning {
  position: absolute;
  top: 100%;
  left: 1.5rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.2em;
  color: var(--color-text-on-bg-action);
  background: var(--color-bg-action);
  border-radius: var(--border-radius);

  &:after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 0.5rem;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.5rem solid var(--color-bg-action);
  }
}
</style>