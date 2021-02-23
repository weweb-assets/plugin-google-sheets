<template>
    <div class="ww-popup-google-sheets-configuration">
        <template v-if="!profile">
            <label class="google-sheets-configuration__label caption-s" for="api-key">
                Connection to Google
                <div class="google-sheets-configuration__label-required">required</div>
            </label>
            <button class="ww-editor-button -primary" @click="authorize">Sign in</button>
        </template>
        <template v-else>
            <label class="google-sheets-configuration__label caption-s" for="api-key"> Connnected as </label>
            <div class="google-sheets-configuration__row google-sheets-configuration__input">
                <img class="google-sheets-configuration__image" :src="profile.picture" alt="" width="30" height="30" />
                <div class="caption-l m-left">{{ profile.name }}</div>
                <button class="ww-editor-button -primary -small m-auto-left" @click="authorize">Switch account</button>
            </div>
            <label class="google-sheets-configuration__label caption-s" for="url-google-sheets">
                Url
                <div class="google-sheets-configuration__label-required">required</div>
            </label>
            <input
                type="text"
                name="url-google-sheets"
                class="google-sheets-configuration__input caption-m ww-editor-input -large"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                v-model="settings.privateData.url"
                @input="setSpreadsheetId"
            />
            <template v-if="isSetup">
                <label class="google-sheets-configuration__label caption-s" for="name-google-sheets">
                    Name
                    <div class="google-sheets-configuration__label-required">optional</div>
                </label>
                <input
                    type="text"
                    name="name-google-sheets"
                    class="google-sheets-configuration__input caption-m ww-editor-input -large"
                    placeholder="Name"
                    v-model="settings.privateData.name"
                    disabled
                />
            </template>
        </template>
    </div>
</template>

<script>
import { GET_GOOGLE_AUTHORIZE, GET_GOOGLE_PROFILE, GET_GOOGLE_SPREADSHEET_META } from '../graphql';

export default {
    name: 'ConfigurationPopup',
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
            interval: undefined,
            isKeyHidden: true,
            profile: undefined,
            settings: {
                privateData: {},
            },
        };
    },
    watch: {
        'settings.privateData.spreadsheetId'() {
            if (this.settings.privateData.spreadsheetId.length) this.getSpreadsheetMeta();
        },
        isSetup() {
            this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
        },
    },
    computed: {
        isSetup() {
            const { url, spreadsheetId, name } = this.settings.privateData;
            return url && url.length && spreadsheetId && spreadsheetId.length && name && name.length;
        },
    },
    methods: {
        async authorize() {
            const { data } = await wwLib.$apollo.query({
                query: GET_GOOGLE_AUTHORIZE,
                variables: {
                    designId: wwLib.wwWebsiteData.getDesign().info.id,
                    pluginId: wwLib.wwPlugins.pluginGoogleSheets.id,
                    settingsId: this.settings.id,
                },
                fetchPolicy: 'no-cache',
            });
            this.profile = undefined;
            window.open(data.getGoogleAuthorize.data.authUrl, '_target');
            this.options.setLoadingStatus(true);
            this.interval = setInterval(this.getProfile, 1000);
        },
        async getProfile() {
            try {
                const { data } = await wwLib.$apollo.query({
                    query: GET_GOOGLE_PROFILE,
                    variables: {
                        designId: wwLib.wwWebsiteData.getDesign().info.id,
                        pluginId: wwLib.wwPlugins.pluginGoogleSheets.id,
                        settingsId: this.settings.id,
                    },
                    fetchPolicy: 'no-cache',
                });
                this.profile = data.getGoogleProfile.data.profile;
                wwLib.wwPlugins.pluginGoogleSheets.settings.privateData.token = data.getGoogleProfile.data.token;
                this.settings.privateData.token = data.getGoogleProfile.data.token;
                this.options.setLoadingStatus(false);
                clearInterval(this.interval);
            } catch (err) {
                this.profile = undefined;
                wwLib.wwLog.error(err);
            }
        },
        async getSpreadsheetMeta() {
            this.options.setLoadingStatus(true);
            try {
                this.settings.privateData.name = '';
                const { data } = await wwLib.$apollo.query({
                    query: GET_GOOGLE_SPREADSHEET_META,
                    variables: {
                        designId: wwLib.wwWebsiteData.getDesign().info.id,
                        pluginId: wwLib.wwPlugins.pluginGoogleSheets.id,
                        settingsId: this.settings.id,
                        spreadsheetId: this.settings.privateData.spreadsheetId,
                    },
                });
                const { properties } = data.getGoogleSpreadsheetMeta.data;
                this.settings.privateData.name = properties.title;
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
        setSpreadsheetId() {
            const spreadsheetIdRegex = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)');
            const found = spreadsheetIdRegex.exec(this.settings.privateData.url);
            this.settings.privateData.spreadsheetId = found && found[1];
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
            } catch (err) {
                wwLib.wwLog.error(err);
            }
            this.options.setLoadingStatus(false);
        },
    },
    async mounted() {
        this.options.setLoadingStatus(true);
        await this.getProfile();
        this.options.setLoadingStatus(false);
    },
    created() {
        this.settings = this.options.data.settings || this.settings;
        this.options.result.settings = this.settings;
        this.options.setButtonState('SAVE', this.isSetup ? 'ok' : 'disabled');
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
};
</script>

<style scoped lang="scss">
.ww-popup-google-sheets-configuration {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .google-sheets-configuration {
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
        &__image {
            border: 2px solid var(--ww-color-blue-500);
            border-radius: 50%;
        }
        &__input {
            margin-bottom: var(--ww-spacing-03);
        }
        &__row {
            display: flex;
            align-items: center;
        }
        &__radio-label {
            margin-left: var(--ww-spacing-02);
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
