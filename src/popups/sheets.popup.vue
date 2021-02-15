<template>
    <div class="ww-popup-spreadsheet-sheets">
        <button class="spreadsheet-sheets__all ww-editor-button -primary" @click="addSheet">Add sheet</button>
        <div class="spreadsheet-sheets__row" v-for="(sheet, index) in settings.privateData.sheets" :key="index">
            <div class="paragraph-m">{{ sheet.name }}</div>
            <button class="ww-editor-button -secondary -small m-auto-left" @click="editSheet(index, sheet)">
                Edit
            </button>
            <div class="spreadsheet-sheets__button-delete m-left" @click="deleteSheet(index)">
                <wwEditorIcon name="delete" small />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SheetsPopup',
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
            settings: {
                privateData: {
                    token: undefined,
                    url: undefined,
                    spreadsheetId: undefined,
                    name: undefined,
                    sheets: [],
                },
            },
        };
    },
    methods: {
        async addSheet() {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'SPREADSHEET_ADD_SHEET_POPUP',
                    data: { settings: this.settings },
                });
                this.settings.privateData.sheets.push(result.sheet);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        async editSheet(index, sheet) {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'SPREADSHEET_EDIT_SHEET_POPUP',
                    data: { settings: this.settings, sheet },
                });
                this.settings.privateData.sheets.splice(index, 1, result.sheet);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        deleteSheet(index) {
            this.settings.privateData.sheets.splice(index, 1);
        },
        async beforeNext() {
            this.options.setLoadingStatus(true);
            try {
                const plugin = wwLib.wwPlugins.pluginSpreadsheet;
                plugin.settings = await wwLib.wwPlugin.saveSettings(
                    plugin.id,
                    plugin.settings.id,
                    this.settings.data,
                    this.settings.privateData
                );

                const oldSheets = this.options.data.settings.privateData.sheets;
                const newSheets = this.options.result.settings.privateData.sheets;
                const deletedSheets = oldSheets.filter(sheet => !newSheets.find(elem => elem.id === sheet.id));
                deletedSheets.forEach(sheet => wwLib.wwPlugin.deleteCmsDataSet(sheet.id));

                wwLib.wwPlugins.pluginSpreadsheet.settings = plugin.settings;
                this.options.data.settings = plugin.settings;
            } catch (err) {
                wwLib.wwLog.error(err);
            }
            this.options.setLoadingStatus(false);
        },
    },
    created() {
        this.settings = _.cloneDeep(this.options.data.settings || this.settings);
        this.options.result.settings = this.settings;
    },
};
</script>

<style scoped lang="scss">
.ww-popup-spreadsheet-sheets {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .spreadsheet-sheets {
        &__all {
            margin: 0 auto var(--ww-spacing-02) auto;
        }
        &__row {
            display: flex;
            align-items: center;
            margin-bottom: var(--ww-spacing-04);
        }
        &__button-delete {
            margin: 0 var(--ww-spacing-03);
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
        margin-left: var(--ww-spacing-03);
    }
}
</style>
