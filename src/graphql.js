import gql from 'graphql-tag';

export const GET_GOOGLE_AUTORIZE = gql`
    query GetGoogleAutorize($designId: String!, $pluginId: String!, $settingsId: String!) {
        getGoogleAutorize(designId: $designId, pluginId: $pluginId, settingsId: $settingsId) {
            success
            data
        }
    }
`;

export const GET_GOOGLE_PROFILE = gql`
    query GetGoogleProfile($designId: String!, $pluginId: String!, $settingsId: String!) {
        getGoogleProfile(designId: $designId, pluginId: $pluginId, settingsId: $settingsId) {
            success
            data
        }
    }
`;

export const GET_GOOGLE_SPREADSHEET_META = gql`
    query GetGoogleSpreadsheetMeta(
        $designId: String!
        $pluginId: String!
        $settingsId: String!
        $spreadsheetId: String!
    ) {
        getGoogleSpreadsheetMeta(
            designId: $designId
            pluginId: $pluginId
            settingsId: $settingsId
            spreadsheetId: $spreadsheetId
        ) {
            success
            data
        }
    }
`;
