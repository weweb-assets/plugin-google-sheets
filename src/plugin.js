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
        if (!plugin.settings.privateData.token) {
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
            const isFirstTime = !settings.privateData.token;
            await wwLib.wwPopups.open({
                firstPage: settings.privateData.token ? 'GOOGLE_SHEETS_POPUP' : 'GOOGLE_SHEETS_CONFIGURATION_POPUP',
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
