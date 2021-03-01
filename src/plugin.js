/* wwEditor:start */
import './popups';
/* wwEditor:end */

export default {
    /* wwEditor:start */
    /*=============================================m_ÔÔ_m=============================================\
        Data
    \================================================================================================*/
    settings: {
        data: {},
        privateData: {
            token: undefined,
            url: undefined,
            spreadsheetId: undefined,
            name: undefined,
            sheets: [],
        },
    },
    /* wwEditor:end */
    /*=============================================m_ÔÔ_m=============================================\
        Init
    \================================================================================================*/
    async init() {
        /* wwEditor:start */
        const plugin = wwLib.wwPlugins.pluginGoogleSheets;
        if (plugin.id) plugin.settings = (await wwLib.wwPlugin.getSettings(plugin.id)) || this.settings;
        if (!plugin.settings.privateData.url) plugin.settings.privateData.url = '';
        if (!plugin.settings.privateData.spreadsheetId) plugin.settings.privateData.spreadsheetId = '';
        if (!plugin.settings.privateData.name) plugin.settings.privateData.name = '';
        if (!plugin.settings.privateData.sheets) plugin.settings.privateData.sheets = [];
        if (
            plugin.isNew &&
            (!plugin.settings.privateData.token ||
                !plugin.settings.privateData.url.length ||
                !plugin.settings.privateData.spreadsheetId.length ||
                !plugin.settings.privateData.name.length)
        ) {
            this.sidebarButton();
        }
        /* wwEditor:end */
    },
    /* wwEditor:start */
    /*=============================================m_ÔÔ_m=============================================\
        SIDEBAR POPUP
    \================================================================================================*/
    async sidebarButton() {
        try {
            const { id, settings } = wwLib.wwPlugins.pluginGoogleSheets;
            const isSetup =
                settings.privateData.token &&
                settings.privateData.url.length &&
                settings.privateData.spreadsheetId.length &&
                settings.privateData.name.length;
            const isFirstTime = !settings.privateData.sheets.length;
            await wwLib.wwPopups.open({
                firstPage: isSetup ? 'GOOGLE_SHEETS_POPUP' : 'GOOGLE_SHEETS_CONFIGURATION_POPUP',
                data: {
                    isFirstTime,
                    pluginId: id,
                    settings,
                },
            });
        } catch (err) {
            wwLib.wwLog.error(err);
        }
    },
    /* wwEditor:end */
};
