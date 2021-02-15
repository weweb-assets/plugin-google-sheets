<template>
    <div class="ww-popup-spreadsheet-sheet">
        <label class="spreadsheet-sheet__label caption-s" for="name-sheet">
            Name
            <div class="spreadsheet-sheet__label-required">required</div>
        </label>
        <wwEditorSelect
            class="spreadsheet-sheet__input"
            :options="allSheets"
            v-model="sheet.name"
            placeholder="Select a sheet"
            large
        />
        <label class="spreadsheet-sheet__label caption-s" for="dimension-sheet">
            Dimension
            <div class="spreadsheet-sheet__label-required">required</div>
        </label>
        <wwEditorSelect
            class="spreadsheet-sheet__input"
            :options="dimensionsOptions"
            v-model="sheet.dimensions"
            placeholder="Select a dimension"
            large
            :disabled="!sheet.spreadsheetId"
        />
        <label class="spreadsheet-sheet__label caption-s" for="display-by-sheet">
            Display by
            <div class="spreadsheet-sheet__label-required">optional</div>
        </label>
        <input
            type="text"
            name="display-by-sheet"
            class="spreadsheet-sheet__input caption-m ww-editor-input -large"
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
                { value: 'ROWS', label: 'Rows', default: true },
                { value: 'COLUMNS', label: 'Columns' },
            ],
            allSheets: [],
            settings: {
                privateData: {
                    token: undefined,
                    url: undefined,
                    spreadsheetId: undefined,
                    name: undefined,
                    sheets: [],
                },
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
        'sheet.name'() {
            this.options.setButtonState('SAVE', this.sheet.name ? 'ok' : 'disabled');
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
                        pluginId: wwLib.wwPlugins.pluginSpreadsheet.id,
                        settingsId: this.settings.id,
                        spreadsheetId: this.settings.privateData.spreadsheetId,
                    },
                });
                const { properties, sheets } = data.getGoogleSpreadsheetMeta.data;
                this.sheet.name = properties.title;
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
                        en: "The spreadsheet coun't be found",
                    },
                    color: 'red',
                });
            }
            this.options.setLoadingStatus(false);
        },
    },

    created() {
        this.settings = this.options.data.settings || this.settings;
        this.sheet = this.options.data.sheet || this.sheet;
        this.options.result.sheet = this.sheet;
        this.options.setButtonState('SAVE', this.sheet.name ? 'ok' : 'disabled');
    },
    mounted() {
        this.getSpreadsheetMeta();
    },
};
</script>

<style scoped lang="scss">
.ww-popup-spreadsheet-sheet {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .spreadsheet-sheet {
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
