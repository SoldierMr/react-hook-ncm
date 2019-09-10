import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import useStoreRequest from '@hooks/useStoreRequest'
import { useMappedState, useDispatch } from '@store'
import SongBlock, { SongBlockType, ISongBlockProps } from '@components/SongBlock'
import config from '../../config'

/**
 * description: 首页引导下载头部
 */

 interface IHeader {
     toggled?: boolean;
     init?: boolean;
     rh: any
 }

 const Header: React.SFC<IHeader> = React.memo(function (props) {
    const idx = 3
    const { rh } = props;
    const headerClass = "header"

    const { doRequest } = useStoreRequest()
    const [skShow, setSkShow] = useState(true)
    const dispatch = useDispatch()

    const { lastUpdated_boardSongs, boardSongs } = useMappedState(
        useCallback(
            (state: any) => ({
                lastUpdated_boardSongs: state.songList.lastUpdate_boardSongs,
                boardSongs: state.songList.boardSongs
            }),
            [idx],
        )
    )

    const board = boardSongs[idx]
    const title = board && board.playlist && board.playlist.name
    const songs = board && board.playlist && board.playlist.tracks && board.playlist.tracks.slice(0, 4) || []
    const ifSongs = songs.length !== 0

    const standardSongs = songs.map((v: any): ISongBlockProps => {
        return {
            type: SongBlockType.S,
            name: v.name,
            picUrl: v.al.picUrl,
            author: v.ar[0].name,
            id: v.id
        }
    })
    const getSongs = (type: number): void => {
        if(standardSongs.length) return
        if (
            standardSongs.length &&
            lastUpdated_boardSongs[idx] &&
            Date.now() - lastUpdated_boardSongs[idx] < config.searchLimit * 60 * 1000
        ) return
        doRequest(
            {
                method: 'get',
                url: `top/list?idx=${type}`
            },
            {
                callback: (data: { playlist: any[] }) => dispatch({type: 'get_board_songs', boardSongs: data, idx: type})
            }
        )
    }

    useEffect(() => {
        getSongs(idx)
    }, [])

    const handleClick = (id: string | undefined): void => {
        rh.push(`/song?id=${id}`)
    }

    // 骨架屏消失
    if (ifSongs && skShow) {
        document.getElementsByClassName("header")[0].classList.add("disappear")
    }

    return (
        <header>
            <div className="header">
                <div className="header__element--toggled--back">
                    <div className="header-logo">
                        {ifSongs && <img src={require('@img/header_logo_3x.png')} />}
                    </div>
                    <div className="header-content">
                        <div className="header-content__description--middle">
                            {title}
                        </div>
                        <div className="header-content_songs--small">
                            {standardSongs.map((v: ISongBlockProps) => {
                                return (
                                    <div key={v.type + v.name + v.author} onClick={() => handleClick(v.id)}>
                                        <SongBlock key={v.type + v.name + v.author} data={v} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <button className="header-button_download--white">{ifSongs && "下载APP"}</button>
                </div>
            </div>
        </header>
    )
 })

 export default Header