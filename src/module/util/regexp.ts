export function escape(string: string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export default {
    escape
}