<template>
    <div class="g-sheets-collection-edit">
        <wwEditorFormRow label="Sheet" required>
            <wwEditorSelect
                :options="allSheets"
                :model-value="sheet.name"
                placeholder="Select a sheet"
                large
                @update:modelValue="setProp('name', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow label="Titles are in" required>
            <wwEditorSelect
                :options="dimensionsOptions"
                :model-value="sheet.dimensions"
                placeholder="Select a dimension"
                large
                @update:modelValue="setProp('dimensions', $event)"
            />
        </wwEditorFormRow>
        <img
            v-if="sheet.dimensions === 'COLUMNS'"
            class="g-sheets-collection-edit__dimension-preview"
            src="https://cdn.weweb.io/public/images/google_sheets_columns.png"
        />
        <img
            v-else
            class="g-sheets-collection-edit__dimension-preview"
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
    emits: ['update:config'],
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
    computed: {
        sheet() {
            return {
                name: undefined,
                dimensions: 'ROWS',
                ...this.config,
            };
        },
    },
    mounted() {
        this.getSheets();
    },
    methods: {
        setProp(key, value) {
            this.$emit('update:config', { ...this.sheet, [key]: value });
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
