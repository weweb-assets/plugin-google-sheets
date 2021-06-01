<template>
    <div class="g-sheets-collection-summary">
        <div class="g-sheets-collection-summary__elem caption-s">Sheet: {{ config.name || '-' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    watch: {
        isSetup: {
            immediate: true,
            handler(value) {
                this.$emit('update-is-valid', value);
            },
        },
    },
    computed: {
        isSetup() {
            return !!this.config.name && !!this.config.dimensions;
        },
    },
};
</script>

<style lang="scss" scoped>
.g-sheets-collection-summary {
    &__elem {
        margin-bottom: var(--ww-spacing-01);
    }
}
</style>
