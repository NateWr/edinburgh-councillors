<template>
  <div
    class="ec-search"
    :class="{'ec-search--is-focused': isFocused}"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/>
    </svg>
    <input
      type="search"
      name="search"
      placeholder="Find by postcode"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFocused: false
    }
  }
}
</script>


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

.ec-search--is-focused {
  svg path {
    fill: var(--color-link);
  }
}
</style>