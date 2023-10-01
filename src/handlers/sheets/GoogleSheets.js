"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheetData = void 0;
const GoogleAuth_1 = require("../auth/GoogleAuth");
const googleapis_1 = require("googleapis");
const transform_sheet_response_1 = require("../../helpers/transform-sheet-response");
function getSheetData() {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = yield (0, GoogleAuth_1.authorize)();
        if (!auth) {
            throw new Error('Authorization failed');
        }
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range = 'Sheet1!A2:H9'; // Adjust the range according to your sheet
        try {
            const response = yield (sheets === null || sheets === void 0 ? void 0 : sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            }, {
                params: {
                    majorDimension: 'COLUMNS',
                }
            }));
            const columns = response === null || response === void 0 ? void 0 : response.data.values;
            if (columns && columns.length) {
                let today = new Date().getDay();
                // transform sunday to human-readable day
                if (today === 0) {
                    today = 7;
                }
                const transformedResponse = (0, transform_sheet_response_1.transformSheetResponse)(columns);
                let response = {};
                for (let [index, chore] of columns[0].entries()) {
                    if (!transformedResponse[today][index]) {
                        continue;
                    }
                    response[chore] = {
                        assignee: transformedResponse[today][index],
                    };
                }
                return response;
            }
            else {
                console.log('No data found.');
                return {};
            }
        }
        catch (err) {
            console.error('The API returned an error: ' + err);
            return {};
        }
    });
}
exports.getSheetData = getSheetData;
