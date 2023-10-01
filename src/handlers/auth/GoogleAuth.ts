import path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';

const fs = require('fs').promises;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.resolve(__dirname, 'token.json')
const CREDENTIALS_PATH = path.resolve(__dirname, 'credentials.json')

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
    try {
        const token = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(token);
        return google.auth.fromJSON(credentials) as OAuth2Client;
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 */
async function saveCredentials(client: OAuth2Client): Promise<void> {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.refreshAccessToken(),
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 */
export async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }

    // @ts-ignore
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });

    if (client?.credentials) {
        await saveCredentials(client);
    }
    return client;
}