import settingsPopup from './settings.popup.vue';
import configurationPopup from './configuration.popup.vue';
import sheetsPopup from './sheets.popup.vue';
import sheetPopup from './sheet.popup.vue';
import synchronizationPopup from './synchronization.popup.vue';
import webhooksPopup from './webhooks.popup.vue';

wwLib.wwPopups.addPopup('spreadsheetSettingsPopup', settingsPopup);
wwLib.wwPopups.addPopup('spreadsheetConfigurationPopup', configurationPopup);
wwLib.wwPopups.addPopup('spreadsheetSheetsPopup', sheetsPopup);
wwLib.wwPopups.addPopup('spreadsheetSheetPopup', sheetPopup);
wwLib.wwPopups.addPopup('spreadsheetSynchronizationPopup', synchronizationPopup);
wwLib.wwPopups.addPopup('spreadsheetWebhooksPopup', webhooksPopup);

wwLib.wwPopups.addStory('SPREADSHEET_POPUP', {
    title: {
        en: 'Spreadsheet',
        fr: 'Spreadsheet',
    },
    type: 'spreadsheetSettingsPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
});

wwLib.wwPopups.addStory('SPREADSHEET_CONFIGURATION_POPUP', {
    title: {
        en: 'Spreadsheet - Configuration',
        fr: 'Spreadsheet - Configuration',
    },
    type: 'spreadsheetConfigurationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save configuration',
                fr: 'Enregistrer la configuration',
            },
            next: 'SPREADSHEET_SHEETS_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('SPREADSHEET_SHEETS_POPUP', {
    title: {
        en: 'Spreadsheet - Sheets',
        fr: 'Spreadsheet - Sheets',
    },
    type: 'spreadsheetSheetsPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save sheets',
                fr: 'Enregistrer les sheets',
            },
            next: 'SPREADSHEET_SYNCHRONIZATION_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('SPREADSHEET_ADD_SHEET_POPUP', {
    title: {
        en: 'Spreadsheet - Add sheet',
        fr: 'Spreadsheet - Ajouter une sheet',
    },
    type: 'spreadsheetSheetPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Add sheet',
                fr: 'Ajouter une sheet',
            },
        },
    },
});

wwLib.wwPopups.addStory('SPREADSHEET_EDIT_SHEET_POPUP', {
    title: {
        en: 'Spreadsheet - Edit sheet',
        fr: 'Spreadsheet - Editer la sheet',
    },
    type: 'spreadsheetSheetPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Edit sheet',
                fr: 'Editer la sheet',
            },
        },
    },
});

wwLib.wwPopups.addStory('SPREADSHEET_WEBHOOKS_POPUP', {
    title: {
        en: 'Spreadsheet - Webhooks',
        fr: 'Spreadsheet - Webhooks',
    },
    type: 'spreadsheetWebhooksPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        DONE: {
            text: {
                en: 'Done',
                fr: 'Done',
            },
        },
    },
});

wwLib.wwPopups.addStory('SPREADSHEET_SYNCHRONIZATION_POPUP', {
    title: {
        en: 'Spreadsheet - Synchronization',
        fr: 'Spreadsheet - Synchronization',
    },
    type: 'spreadsheetSynchronizationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        DONE: {
            text: {
                en: 'Done',
                fr: 'Done',
            },
        },
    },
});
