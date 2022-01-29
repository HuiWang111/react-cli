interface ITidyDataOptions {
    removeEmptyArray?: boolean;
}

const defaultTidyOptions: ITidyDataOptions = {
    removeEmptyArray: true
}

export const tidyData = (
    data?: Record<string, any> | null | undefined,
    {
        removeEmptyArray = true
    }: ITidyDataOptions = defaultTidyOptions
): Record<string, any> => {
    if (!data) {
        return {}
    }

    const res = Object.assign({}, data)

    for (const key in res) {
        const typeofRes = typeof res[key]
        if (res[key] == null) {
            delete res[key]
        } else if (typeofRes === 'string') {
            const value = data[key].trim()
            if (!value.length) {
                delete res[key]
            } else {
                res[key] = value
            }
        } else if (Array.isArray(res[key])) {
            if (!res[key].length && removeEmptyArray) {
                delete res[key]
            }
        }
    }

    return res
}

export const omit = (object: Record<string, any>, omitKeys?: string[]): Record<string, any> => {
    if (!omitKeys || !omitKeys.length) {
        return object
    }

    const res: Record<string, any> = {}
    const set = new Set(omitKeys)
    for (const key in object) {
        if (!set.has(key)) {
            res[key] = object[key]
        }
    }

    return res
}
