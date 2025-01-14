export default {
    features: {
        datasource: true,
    },
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return (
                    !!settings.privateData.url && !!settings.privateData.spreadsheetId && !!settings.privateData.name
                );
            },
            /* wwEditor:start */
            copilot: {
                description: 'Configure Google Sheets plugin settings',
                returns: 'void',
                schema: {
                    url: {
                        type: 'string',
                        description: 'The URL of the Google Sheets document',
                        bindable: true
                    },
                    spreadsheetId: {
                        type: 'string',
                        description: 'The unique identifier of the spreadsheet',
                        bindable: false
                    },
                    name: {
                        type: 'string',
                        description: 'The name of the spreadsheet',
                        bindable: false
                    }
                }
            }
            /* wwEditor:end */
        },
        collection: {
            edit: () => import('./src/components/CollectionEdit.vue'),
            summary: () => import('./src/components/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.name && !!config.dimensions;
            },
            /* wwEditor:start */
            copilot: {
                description: 'Configure a Google Sheets collection',
                returns: 'void',
                schema: {
                    name: {
                        type: 'string',
                        description: 'The name of the sheet to use as source',
                        bindable: true
                    },
                    dimensions: {
                        type: 'string',
                        description: 'Whether titles are in ROWS or COLUMNS',
                        bindable: true
                    },
                    range: {
                        type: 'string',
                        description: 'The cell range to fetch (e.g. A1:Z1)',
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
    },
};