<template>
    <div class="ww-popup-google-sheets-sheets">
        <button class="google-sheets-sheets__all ww-editor-button -primary" @click="addSheet">Add sheet</button>
        <div class="google-sheets-sheets__row" v-for="(sheet, index) in settings.privateData.sheets" :key="index">
            <div class="paragraph-m">{{ sheet.name }}</div>
            <button class="ww-editor-button -secondary -small m-auto-left" @click="editSheet(index, sheet)">
                Edit
            </button>
            <div class="google-sheets-sheets__button-delete m-left" @click="deleteSheet(index)">
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
                privateData: {},
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
            return this.settings.privateData.tables && this.settings.privateData.tables.length;
        },
    },
    methods: {
        async addSheet() {
            try {
                const result = await wwLib.wwPopups.open({
                    firstPage: 'GOOGLE_SHEETS_ADD_SHEET_POPUP',
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
                    firstPage: 'GOOGLE_SHEETS_EDIT_SHEET_POPUP',
                    data: { settings: this.settings, sheet },
                });
                this.settings.privateData.sheets.splice(index, 1, result.sheet);
            } catch (err) {
                wwLib.wwLog.error(err);
            }
        },
        async deleteSheet(index) {
            const confirm = await wwLib.wwModals.open({
                title: {
                    en: 'Delete data source?',
                    fr: 'Supprimer la source de données?',
                },
                text: {
                    en: 'Are you sure you want to delete the data source?',
                    fr: 'Voulez-vous vraiment supprimer la source de données ?',
                },
                buttons: [
                    {
                        text: {
                            en: 'Cancel',
                            fr: 'Annuler',
                        },
                        color: '-secondary',
                        value: false,
                        escape: true,
                    },
                    {
                        text: {
                            en: 'Delete',
                            fr: 'Supprimer',
                        },
                        color: '-primary -red',
                        value: true,
                        enter: true,
                    },
                ],
            });
            if (!confirm) return;
            this.settings.privateData.sheets.splice(index, 1);
        },
        async beforeNext() {
            this.options.setLoadingStatus(true);
            try {
                const plugin = wwLib.wwPlugins.pluginGoogleSheets;
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

                wwLib.wwPlugins.pluginGoogleSheets.settings = plugin.settings;
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
        this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
    },
};
</script>

<style scoped lang="scss">
.ww-popup-google-sheets-sheets {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .google-sheets-sheets {
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
