"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSheetResponse = void 0;
const Names_1 = require("../packages/chores/Names");
const transformSheetResponse = (sheetResponseArr) => {
    const aliases = Names_1.names.map(name => name.alias);
    return sheetResponseArr.map((column) => {
        return column.map((cell) => {
            // Splitting names in a cell by either ', ' or ' and '
            const cellNames = cell.split(/, | and /);
            // Map each name in the cell to its corresponding tgUsername
            const transformedNames = cellNames.map((name) => {
                // Extracting alias from the name string
                const alias = aliases.find(a => name.includes(a));
                if (!alias) {
                    if (name === 'X') {
                        // delete cellNames entry
                        return '';
                    }
                    return name.trim();
                }
                // Find the corresponding user object using the extracted alias
                const userObj = Names_1.names.find(n => n.alias === alias);
                // Replace the alias in the name string with the tgUsername
                return name.replace(alias, (userObj === null || userObj === void 0 ? void 0 : userObj.tgUsername) || 'everyone').trim();
            });
            // Join the transformed names back into a string with ' and '
            return transformedNames.join(' and ');
        });
    });
};
exports.transformSheetResponse = transformSheetResponse;
