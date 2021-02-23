<template>
    <div class="ww-popup-google-sheets-webhooks">
        <div class="google-sheets-webhooks__row" v-for="(sheet, index) in settings.privateData.sheets" :key="index">
            <div class="paragraph-m">{{ sheet.name }}</div>
            <button class="ww-editor-button -primary -green -small m-auto-left" @click="copyCode(sheet)">
                <wwEditorIcon class="ww-editor-button-icon -left" name="copy-paste" small />
                Copy url
            </button>
            <a class="ww-editor-button -secondary -small m-left" :href="settings.privateData.url" target="_blank">
                <wwEditorIcon class="ww-editor-button-icon -left" name="open-out" small />
                Setup webhook
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WebhooksPopup',
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
    methods: {
        async copyCode(sheet) {
            const designId = wwLib.wwWebsiteData.getInfo().id;
            await wwLib
                .getManagerWindow()
                .navigator.clipboard.writeText(
                    `https://data.weweb.io/designs/${designId}/cms_data_set/${sheet.id}/callback`
                );
            wwLib.wwNotification.open({
                text: {
                    en: 'Code copied to clipboard',
                },
                color: 'green',
            });
        },
    },
    created() {
        this.settings = this.options.data.settings;
    },
};
</script>

<style scoped lang="scss">
.ww-popup-google-sheets-webhooks {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .google-sheets-webhooks {
        &__row {
            display: flex;
            align-items: center;
            margin-bottom: var(--ww-spacing-04);
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
