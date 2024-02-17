export function valueIsNotEmpty(value: any) {
    if (value) {
        return true
    } else if( typeof value === 'boolean') return true
    return false
}