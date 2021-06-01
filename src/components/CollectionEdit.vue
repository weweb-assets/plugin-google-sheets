<template>
    <div class="g-sheets-collection-edit">
        <wwEditorFormRow label="Sheet" required>
            <wwEditorSelect
                :options="allSheets"
                :value="sheet.name"
                @input="setProp('name', $event)"
                placeholder="Select a sheet"
                large
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Titles are in" required>
            <wwEditorSelect
                :options="dimensionsOptions"
                :value="sheet.dimensions"
                @input="setProp('dimensions', $event)"
                placeholder="Select a dimension"
                large
            />
        </wwEditorFormRow>
        <img
            class="g-sheets-collection-edit__dimension-preview"
            v-if="sheet.dimensions === 'COLUMNS'"
            src="https://cdn.weweb.io/public/images/google_sheets_columns.png"
        />
        <img
            class="g-sheets-collection-edit__dimension-preview"
            v-else
            src="https://cdn.weweb.io/public/images/google_sheets_rows.png"
        />
        <wwLoader :loading="isSheetsLoading" />
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    data() {
        return {
            allSheets: [],
            isSheetsLoading: false,
            dimensionsOptions: [
                { value: 'ROWS', label: 'First row', default: true },
                { value: 'COLUMNS', label: 'First column' },
            ],
        };
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
            return !!this.sheet.name && !!this.sheet.dimensions;
        },
        sheet() {
            return {
                name: undefined,
                dimensions: 'ROWS',
                ...this.config,
            };
        },
    },
    methods: {
        setProp(key, value) {
            this.$emit('update-config', { ...this.sheet, [key]: value });
        },
        async getSheets() {
            try {
                this.isSheetsLoading = true;
                const { sheets } = await this.plugin.getSpreadsheetMeta();
                this.allSheets = sheets.map(sheet => ({
                    value: sheet.properties.title,
                    label: sheet.properties.title,
                }));
            } catch (err) {
                wwLib.wwNotification.open({
                    text: 'Unable to pull your sheets, please make sure the plugin is still connected to your account.',
                    color: 'red',
                });
            } finally {
                this.isSheetsLoading = false;
            }
        },
    },
    mounted() {
        this.getSheets();
    },
};
</script>

<style scoped lang="scss">
.g-sheets-collection-edit {
    display: flex;
    flex-direction: column;
    &__dimension-preview {
        border: 1px solid var(--ww-color-blue-500);
        border-radius: var(--ww-border-radius-01);
        margin-bottom: var(--ww-spacing-03);
        width: 100%;
    }
}
</style>
