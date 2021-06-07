<template>
    <div class="g-sheets-settings-summary">
        <wwEditorIcon name="document" class="g-sheets-settings-summary__icon"></wwEditorIcon>
        <span class="caption-m">{{ settings.privateData.name }}</span>
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    computed: {
        isValid() {
            const { url, spreadsheetId, name } = this.settings.privateData;
            return url && spreadsheetId && name;
        },
    },
    watch: {
        isValid: {
            immediate: true,
            handler(value) {
                this.$emit('update-is-valid', value);
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.g-sheets-settings-summary {
    display: flex;
    align-items: center;
    &__icon {
        margin-right: var(--ww-spacing-02);
    }
}
</style>
