import { names } from '../packages/chores/Names';

export const transformSheetResponse = (sheetResponseArr: string[][]) => {
    const aliases = names.map(name => name.alias);

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
                const userObj = names.find(n => n.alias === alias);

                // Replace the alias in the name string with the tgUsername
                return name.replace(alias, userObj?.tgUsername || 'everyone').trim();
            });

            // Join the transformed names back into a string with ' and '
            return transformedNames.join(' and ');
        });
    });
};
