import React, { useEffect, useState, useCallback } from 'react'
import { useMappedState, useDispatch } from '@store'
import useStoreRequest from '@hooks/useStoreRequest'
import SwitchBar from '@components/switchBar'
import HotMusic from '@views/home/hotMusic'

import Board from '@views/home/board'
import Search from '@views/home/search'
import config from '../../config'

/**
 *  description: 首页内容部分
 */

interface IBodyProps {
    toggled: boolean,
    rh: any
}

const Body: React.SFC<IBodyProps> = (props) => {
    const [titles, setTitles] = useState(["推荐音乐", "热歌榜", "搜索"])
    const [current, setCurrent] = useState("推荐音乐");
    const { toggled, rh } = props;
    const { doRequest } = useStoreRequest()
    const doRequest_newSongs = useStoreRequest().doRequest
    const dispatch = useDispatch()

    const { hotListLastUpdated, hotLists, newListLastUpdated, newLists } = useMappedState(
        useCallback(
            (state: any) => ({
                hotListLastUpdated: state.songList.lastUpdated_hotLists,
                hotLists: state.songList.hosLists,
                newListLastUpdated: state.songList.lastUpdated_newLists,
                newLists: state.songList.newLists
            }),
            [],
        )
    )

    const click = (v: string): void => {
        setCurrent(v)
        let pHeight = document.getElementsByClassName("header")[0].clientHeight
        let lineHeight = document.getElementsByClassName("component-bar__switch-container")[0].clientHeight

        let skBoddy2: any = document.getElementsByClassName("sk-boddy-2")[0]
        if (v === titles[1]) {
            let skBoddy: any = document.getElementsByClassName("sk-boddy")[0]
            skBoddy.style.display = "none"
            skBoddy2.style.display = "block"
            skBoddy2.style.marginTop = (lineHeight - (window.pageYOffset > pHeight ? pHeight : window.pageYOffset)) + 'px'
        } else {
            skBoddy2.style.display = "none"
        }

        if(window.pageYOffset > pHeight) {
            window.scrollTo(0, pHeight)
        }
    }

    const getHotSongLists = (): void => {
        if (hotLists.length && hotListLastUpdated && Date.now() - hotListLastUpdated < config.searchLimit * 60 * 1000) return
        doRequest(
            {
                method: 'get',
                url: 'top/playlist/highquality?limit=6'
            },
            {
                callback: (data: {playlists: any[]}) => dispatch({type: 'get_hot_lists', hotLists: data.playlists})
            }
        )
    }

    const getNewSongs = (): void => {
        if (newLists.length && newListLastUpdated && Date.now() - newListLastUpdated < config.searchLimit * 60 * 1000) return
        doRequest_newSongs(
            {
                method: 'get',
                url: 'personalized/newsong'
            },
            {
                callback: (data: {result: any[]}) => dispatch({type: 'get_new_songs', newLists: data.result})
            }
        )
    }

    function getContent(type: string): void {
        type === titles[0] && getHotSongLists()
        type === titles[0] && getNewSongs()
    }

    useEffect((): void => {
        getContent(current)
    }, [current])

    const ifLoaded = hotLists.length > 0 && newLists.length > 0
    if (ifLoaded) {
        document.getElementsByClassName("sk-boddy")[0].classList.add("disappear")
    }
    const switchOptions = {
        key: 'switch-bar',
        titles,
        current,
        click,
        toggled
    }
    return (
        <section>
            {ifLoaded && <SwitchBar {...switchOptions} />}
            {current === '推荐音乐' && ifLoaded && (
                <HotMusic songList={hotLists} newSongs={newLists} rh={rh} />
            )}
            {current === "热歌榜" && <Board rh={rh} />}
            {current === "搜索" && <Search />}
        </section>
    )
}

export default Body