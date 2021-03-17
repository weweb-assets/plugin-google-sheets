<template>
    <div class="ww-popup-google-sheets-sheet">
        <label class="google-sheets-sheet__label caption-s" for="name-sheet">
            Name
            <div class="google-sheets-sheet__label-required">required</div>
        </label>
        <wwEditorSelect
            class="google-sheets-sheet__input"
            :options="allSheets"
            v-model="sheet.name"
            placeholder="Select a sheet"
            large
        />
        <label class="google-sheets-sheet__label caption-s" for="dimension-sheet">
            Titles are in
            <div class="google-sheets-sheet__label-required">required</div>
        </label>
        <wwEditorSelect
            class="google-sheets-sheet__input"
            :options="dimensionsOptions"
            v-model="sheet.dimensions"
            placeholder="Select a dimension"
            large
            :disabled="!sheet.spreadsheetId"
        />
        <img
            class="google-sheets-sheet__dimension-preview"
            v-if="sheet.dimensions === 'COLUMNS'"
            src="https://cdn.weweb.io/public/images/google_sheets_columns.png"
        />
        <img
            class="google-sheets-sheet__dimension-preview"
            v-else
            src="https://cdn.weweb.io/public/images/google_sheets_rows.png"
        />
        <label class="google-sheets-sheet__label caption-s" for="display-by-sheet">
            Display by
            <div class="google-sheets-sheet__label-required">optional</div>
        </label>
        <input
            type="text"
            name="display-by-sheet"
            class="google-sheets-sheet__input caption-m ww-editor-input -large"
            :placeholder="'Enter a value in ' + (sheet.dimensions === 'ROWS' ? 'row 1' : 'column A')"
            v-model="sheet.displayBy"
        />
    </div>
</template>

<script>
import { GET_GOOGLE_SPREADSHEET_META } from '../graphql';

export default {
    name: 'SheetPopup',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            dimensionsOptions: [
                { value: 'ROWS', label: 'First row', default: true },
                { value: 'COLUMNS', label: 'First column' },
            ],
            allSheets: [],
            settings: {
                privateData: {},
            },
            sheet: {
                id: wwLib.wwUtils.getUid(),
                name: undefined,
                dimensions: 'ROWS',
                displayBy: undefined,
            },
        };
    },
    watch: {
        isSetup() {
            this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
        },
    },
    computed: {
        isSetup() {
            return !!this.sheet.name;
        },
    },
    methods: {
        async getSpreadsheetMeta() {
            this.options.setLoadingStatus(true);
            try {
                const { data } = await wwLib.$apollo.query({
                    query: GET_GOOGLE_SPREADSHEET_META,
                    variables: {
                        designId: wwLib.wwWebsiteData.getDesign().info.id,
                        pluginId: wwLib.wwPlugins.pluginGoogleSheets.id,
                        settingsId: this.settings.id,
                        spreadsheetId: this.settings.privateData.spreadsheetId,
                    },
                });
                const { sheets } = data.getGoogleSpreadsheetMeta.data;
                this.allSheets = sheets.map(sheet => {
                    return {
                        value: sheet.properties.title,
                        label: sheet.properties.title,
                    };
                });
            } catch (err) {
                wwLib.wwLog.error(err);
                wwLib.wwNotification.open({
                    text: {
                        en: "The spreadsheet couldn't be found",
                    },
                    color: 'red',
                });
            }
            this.options.setLoadingStatus(false);
        },
    },
    mounted() {
        this.getSpreadsheetMeta();
    },
    created() {
        this.settings = this.options.data.settings || this.settings;
        this.sheet = this.options.data.sheet || this.sheet;
        this.options.result.sheet = this.sheet;
        this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
    },
};
</script>

<style scoped lang="scss">
.ww-popup-google-sheets-sheet {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .google-sheets-sheet {
        &__label {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: var(--ww-color-dark-500);
            margin-bottom: var(--ww-spacing-01);
            &-required {
                margin-left: auto;
                color: var(--ww-color-dark-400);
            }
        }
        &__link {
            color: var(--ww-color-blue-500);
            margin-left: var(--ww-spacing-02);
        }
        &__input {
            margin-bottom: var(--ww-spacing-03);
        }
        &__select {
            min-width: 65px;
            margin-left: var(--ww-spacing-02);
        }
        &__row {
            display: flex;
            align-items: center;
            &.-space-between {
                justify-content: space-between;
                padding: 0 var(--ww-spacing-05);
            }
        }
        &__dimension-preview {
            border: 1px solid var(--ww-color-blue-500);
            border-radius: var(--ww-border-radius-01);
            margin-bottom: var(--ww-spacing-03);
            width: 60%;
        }
        &__button-delete {
            margin-right: var(--ww-spacing-03);
            cursor: pointer;
            transition: color 0.3s ease;
            &:hover {
                color: var(--ww-color-red-500);
            }
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-left {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
