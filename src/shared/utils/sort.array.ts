/**
 * Function get array and sort it by index of key
 * @param uniqueValue Name of table head, to change image on it
 * @param objectIndex Index of head, must be equal to idex of array object
 * @param arrayData Array data
 * @param reverse If you need to reverse array
 * @returns uniqueValue and sorted array
 */
export function sortArrayByObjectIndex<T extends object>(
    objectIndex: number,
    arrayData: T[],
    callBack: (arrayData: T[], key: string | number | symbol) => void,
    reverse?: boolean,
) {
    if (arrayData.length === 0) throw Error('handleSort failed, array is empty')
    const keys = Object.keys(arrayData[0])
    const key = keys[objectIndex]
    callBack(arrayData, key as keyof T)
}

export function sortByKey<T, K extends keyof T>(array: T[], key: K): T[] {
    return array.sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];

        const stringValueA = String(valueA).toLowerCase();
        const stringValueB = String(valueB).toLowerCase();

        if (stringValueA < stringValueB) return -1;
        if (stringValueA > stringValueB) return 1;
        return 0;
    });
}