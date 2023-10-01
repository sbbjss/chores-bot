import { authorize } from '../auth/GoogleAuth';
import { google } from 'googleapis';
import { transformSheetResponse } from '../../helpers/transform-sheet-response';

type ChoresSheetData = {
    [key: string]: {
        assignee: string | string[];
    }
}

export async function getSheetData(): Promise<ChoresSheetData> {
    const auth = await authorize();

    if (!auth) {
        throw new Error('Authorization failed');
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = 'Sheet1!A2:H9'; // Adjust the range according to your sheet

    try {
        const response = await sheets?.spreadsheets.values.get({
            spreadsheetId,
            range,
        }, {
            params: {
                majorDimension: 'COLUMNS',
            }
        });
        const columns = response?.data.values;
        if (columns && columns.length) {
            let today = new Date().getDay();

            // transform sunday to human-readable day
            if (today === 0) {
                today = 7;
            }

            const transformedResponse = transformSheetResponse(columns);

            let response: ChoresSheetData = {};

            for (let [index, chore] of columns[0].entries()) {
                if (!transformedResponse[today][index]) {
                    continue;
                }

                response[chore] = {
                    assignee: transformedResponse[today][index],
                }
            }

            return response;
        } else {
            console.log('No data found.');
            return {};
        }
    } catch (err) {
        console.error('The API returned an error: ' + err);
        return {};
    }
}