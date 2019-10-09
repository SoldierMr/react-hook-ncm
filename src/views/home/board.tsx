import React, { useEffect, useCallback } from 'react'
import useStoreRequest from '@hooks/useStoreRequest'
import { useDispatch, useMappedState } from '@store'
import config from '../../config'
import SongBar, { ISongBarProps, SongBarType } from '@components/songBar'

/**
 *  description: 首页热歌榜
 */

export default function Board(props: { rh: any }) {
    const idx = 1;
    const { rh } = props;
    const { doRequest } = useStoreRequest();
    const dispatch = useDispatch()

    const { lastUpdated_boardSongs, boardSongs } = useMappedState(
        useCallback(
            (state: any) => ({
                lastUpdated_boardSongs: state.songList.lastUpdated_boardSongs,
                boardSongs: state.songList.boardSongs
            }),
            [],
        )
    )

    const board = boardSongs[idx]
    const title = board && board.playlist && board.playlist.name
    const songs = board && board.playlist && board.playlist.tracks && board.playlist.tracks.slice(0, 20) || []

    const standardSongs = songs.map((v: any): ISongBarProps => ({
        id: v.id,
        name: v.name,
        authors: v.ar.map((v: any) => v.name),
        album: v.al.name,
        exclusive: v.no <= 1
    }))

    const getSongs = (type: number): void => {
        if(standardSongs.length) return
        if(standardSongs.length && lastUpdated_boardSongs[idx] && Date.now() - lastUpdated_boardSongs[idx] < config.searchLimit * 60 * 1000) return
        doRequest(
            {
                method: 'get',
                url: `top/list?idx=${type}`
            },
            {
                callback: (data: {playlist: any[]}) => dispatch({type: 'get_board_songs', boardSongs: data, idx: type})
            }
        )
    }

    useEffect(() => {
        getSongs(idx)
    }, [idx])

    const handleClick = (id: string | undefined): void => {
        rh.push(`/song?id=${id}`)
    }

    const loaded = standardSongs.length > 0
    
    if (loaded) {
        document.getElementsByClassName("sk-boddy-2")[0].classList.add("disappear")
    }

    return (
        <div className="body-content__board">
            {loaded && (
                <React.Fragment>
                    <div className="body-content__board--top">
                        <div className="body-content__board--top__title">
                            <div />
                            <div>更新日期：07月31日</div>
                        </div>
                    </div>
                    <React.Fragment>
                        {standardSongs.map((v: ISongBarProps, index: number) => {
                            return (
                                <div key={v.album + v.name + 'div'} onClick={() => {
                                    handleClick(v.id)
                                }}>
                                    <SongBar key={v.album + v.name} data={v} index={index} type={SongBarType.I} />
                                </div>
                            )
                        })}
                    </React.Fragment>
                    <div className="body-content__board--footer">
                        查看完整榜单 >
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}