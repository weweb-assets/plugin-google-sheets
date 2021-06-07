import Vue from 'vue';
/* wwEditor:start */
import './components/SettingsEdit.vue';
import './components/SettingsSummary.vue';
import './components/CollectionEdit.vue';
import './components/CollectionSummary.vue';
import { GET_GOOGLE_AUTHORIZE, GET_GOOGLE_PROFILE, GET_GOOGLE_SPREADSHEET_META } from './graphql.js';
/* wwEditor:end */

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Plugin API
    \================================================================================================*/
    onLoad() {
        Vue.prototype.$pluginGoogleSheets = this;
    },
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    /* wwEditor:start */
    // eslint-disable-next-line no-unused-vars
    async fetchCollection(_collection) {
        return { data: null, error: null };
    },
    /* wwEditor:end */
    /*=============================================m_ÔÔ_m=============================================\
        Google Sheets API
    \================================================================================================*/
    async authorize() {
        const { data } = await wwLib.$apollo.query({
            query: GET_GOOGLE_AUTHORIZE,
            variables: {
                designId: wwLib.wwWebsiteData.getDesign().info.id,
                pluginId: this.id,
                settingsId: this.settings.id,
            },
            fetchPolicy: 'no-cache',
        });
        return data.getGoogleAuthorize.data;
    },
    async getProfile() {
        const { data } = await wwLib.$apollo.query({
            query: GET_GOOGLE_PROFILE,
            variables: {
                designId: wwLib.wwWebsiteData.getDesign().info.id,
                pluginId: this.id,
                settingsId: this.settings.id,
            },
            fetchPolicy: 'no-cache',
        });
        return data.getGoogleProfile.data;
    },
    /* wwEditor:start */
    async getSpreadsheetMeta(spreadsheetId = null) {
        const { data } = await wwLib.$apollo.query({
            query: GET_GOOGLE_SPREADSHEET_META,
            variables: {
                designId: wwLib.wwWebsiteData.getDesign().info.id,
                pluginId: this.id,
                settingsId: this.settings.id,
                spreadsheetId: spreadsheetId || this.settings.privateData.spreadsheetId,
            },
        });
        return data.getGoogleSpreadsheetMeta.data;
    },
    /* wwEditor:end */
};
