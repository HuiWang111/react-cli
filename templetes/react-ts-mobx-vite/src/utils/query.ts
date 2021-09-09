import { tidyData, omit } from './tools'

type QueryParams = Record<string, any>

interface IQueryStoreOptions {
    removeEmptyArray?: boolean;
    pageSizePropName?: string;
    pageNumberPropName?: string;
}

const defaultQueryStoreOptions: IQueryStoreOptions = {
    removeEmptyArray: true,
    pageSizePropName: 'pageSize',
    pageNumberPropName: 'pageNumber'
}

export class QueryStore {
    _params: QueryParams
    _initialParams: QueryParams
    _options: IQueryStoreOptions

    constructor(
        initialParams: QueryParams,
        {
            removeEmptyArray = defaultQueryStoreOptions.removeEmptyArray,
            pageSizePropName = defaultQueryStoreOptions.pageSizePropName,
            pageNumberPropName = defaultQueryStoreOptions.pageNumberPropName
        }: IQueryStoreOptions = defaultQueryStoreOptions
    ) {
        this._params = Object.assign({}, initialParams)
        this._initialParams = initialParams
        this._options = {
            removeEmptyArray,
            pageSizePropName,
            pageNumberPropName
        }

        this.merge = this.merge.bind(this)
        this.mergeInit = this.mergeInit.bind(this)
        this.replace = this.replace.bind(this)
        this.reset = this.reset.bind(this)
    }

    merge(params: QueryParams): void {
        this._params = Object.assign({}, this._params, params)
    }

    mergeInit(params: QueryParams): void {
        this._params = Object.assign({}, this._initialParams, params)
    }

    replace(params: QueryParams): void {
        this._params = Object.assign({}, params)
    }

    reset(): void {
        this._params = Object.assign({}, this._initialParams)
    }

    get total(): number | undefined {
        return this._params.total
    }

    get pageSize(): number | undefined {
        return this._params.pageSize
    }

    get current(): number | undefined {
        return this._params.current
    }

    get params(): QueryParams {
        const omited = omit(this._params, ['pageSize', 'current', 'total'])
        const {
            removeEmptyArray,
            pageNumberPropName,
            pageSizePropName
        } = this._options

        return Object.assign(tidyData(omited, { removeEmptyArray }), {
            [pageSizePropName as string]: this._params.pageSize,
            [pageNumberPropName as string]: this._params.current
        })
    }

    get searchParams(): QueryParams {
        return omit(this._params, ['pageSize', 'current', 'total'])
    }
}
