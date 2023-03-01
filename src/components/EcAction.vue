<script>
export default {
    props: {
        disabled: Boolean,
    }
}
</script>

<template>
    <component
        :is="disabled ? 'button' : 'a'"
        class="ec-councillor-action"
        :disabled="disabled ? 'disabled' : null"
    >
        <slot />
    </component>
</template>

<style lang="postcss">
@import '../assets/css/variables.css';

.ec-councillor-action {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.85rem;
    height: 2rem;
    color: var(--color-text-on-bg-action);
    background: transparent;
    border: none;

    & svg {
        width: 0.75rem;
        height: auto;

        & path {
            fill: var(--color-text-on-bg-action);
        }
    }

    + .ec-councillor-action {
        border-left: 1px solid #db3228;
    }

    &:hover {
        background: var(--color-bg-action-hover);
    }

    &:focus {
        outline: 1px solid var(--color-text-on-bg-action);
        outline-offset: -2px;
    }

    &:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
    }

    &:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }
}

.ec-councillor-action:disabled {
    background: #cab0b0;

    & path {
        fill: #ae7470;
    }

    &:hover {
        background: #cab0b0;
    }
}

.ec-councillor-action-email svg {
    width: 0.85rem;
}

</style>