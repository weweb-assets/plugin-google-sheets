import settingsPopup from './settings.popup.vue';
import configurationPopup from './configuration.popup.vue';
import sheetsPopup from './sheets.popup.vue';
import sheetPopup from './sheet.popup.vue';
import synchronizationPopup from './synchronization.popup.vue';
import webhooksPopup from './webhooks.popup.vue';

wwLib.wwPopups.addPopup('googleSheetsSettingsPopup', settingsPopup);
wwLib.wwPopups.addPopup('googleSheetsConfigurationPopup', configurationPopup);
wwLib.wwPopups.addPopup('googleSheetsSheetsPopup', sheetsPopup);
wwLib.wwPopups.addPopup('googleSheetsSheetPopup', sheetPopup);
wwLib.wwPopups.addPopup('googleSheetsSynchronizationPopup', synchronizationPopup);
wwLib.wwPopups.addPopup('googleSheetsWebhooksPopup', webhooksPopup);

wwLib.wwPopups.addStory('GOOGLE_SHEETS_POPUP', {
    title: {
        en: 'Google Sheets',
        fr: 'Google Sheets',
    },
    type: 'googleSheetsSettingsPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
});

wwLib.wwPopups.addStory('GOOGLE_SHEETS_CONFIGURATION_POPUP', {
    title: {
        en: 'Google Sheets - Configuration',
        fr: 'Google Sheets - Configuration',
    },
    type: 'googleSheetsConfigurationPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save configuration',
                fr: 'Enregistrer la configuration',
            },
            next: 'GOOGLE_SHEETS_SHEETS_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('GOOGLE_SHEETS_SHEETS_POPUP', {
    title: {
        en: 'Google Sheets - Sheets',
        fr: 'Google Sheets - Sheets',
    },
    type: 'googleSheetsSheetsPopup',
    size: wwLib.wwPopups.SIZES.MEDIUM,
    buttons: {
        SAVE: {
            text: {
                en: 'Save sheets',
                fr: 'Enregistrer les sheets',
            },
            next: 'GOOGLE_SHEETS_SYNCHRONIZATION_POPUP',
        },
    },
});

wwLib.wwPopups.addStory('GOOGLE_SHEETS_ADD_SHEET_POPUP', {
    title: {
        en: 'Google Sheets - Add sheet',
        fr: 'Google Sheets - Ajouter une sheet',
    },
    type: 'googleSheetsSheetPopup',
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

wwLib.wwPopups.addStory('GOOGLE_SHEETS_EDIT_SHEET_POPUP', {
    title: {
        en: 'Google Sheets - Edit sheet',
        fr: 'Google Sheets - Editer la sheet',
    },
    type: 'googleSheetsSheetPopup',
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

wwLib.wwPopups.addStory('GOOGLE_SHEETS_WEBHOOKS_POPUP', {
    title: {
        en: 'Google Sheets - Webhooks',
        fr: 'Google Sheets - Webhooks',
    },
    type: 'googleSheetsWebhooksPopup',
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

wwLib.wwPopups.addStory('GOOGLE_SHEETS_SYNCHRONIZATION_POPUP', {
    title: {
        en: 'Google Sheets - Synchronization',
        fr: 'Google Sheets - Synchronization',
    },
    type: 'googleSheetsSynchronizationPopup',
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
