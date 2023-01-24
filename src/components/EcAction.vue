<template>
    <component
        :is="disabled ? 'button' : 'a'"
        class="ec-councillor-action"
        :disabled="disabled ? 'disabled' : null"
    >
        <slot />
    </component>
</template>

<script>
export default {
    props: {
        disabled: Boolean,
    }
}
</script>