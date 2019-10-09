import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
axios.defaults.baseURL = process.env.BASEURL

const useStoreRequest = () => {
    interface IFilter {
        url?: string;
        method?: string;
    }
    
    interface IDispatch {
        callback?: any;
    }

    const [filter, setFilter]: [IFilter, any] = useState({})
    const [dispatch, setDispatch]: [IDispatch, any] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (filter.url) {
            const fetchData = async () => {
                setIsError(false)
                setIsLoading(true)

                try {
                    // @ts-ignore
                    const result = await axios(filter)
                    dispatch.callback && dispatch.callback(result.data)
                } catch (error) {
                    setIsError(true)
                }

                setIsLoading(false)
            }
            
            fetchData()
        }

    }, [filter, dispatch])

    const doRequest = (filter: object, dispatch: object) => {
        setFilter(filter)
        setDispatch(dispatch)
    }

    return { isLoading, isError, doRequest }
}

export default useStoreRequest