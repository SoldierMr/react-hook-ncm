import React from 'react'
import Label from '@components/label'
import SongBlock, { SongBlockType, ISongBlockProps } from '@/components/SongBlock'
import SongBar, { ISongBarProps } from '@components/songBar'
import Logo from '@components/logo'

/*
    description: 推荐音乐和最新音乐
*/

export interface IHotMusicSongLists {
    name: string,
    coverImgUrl: string,
    id: number,
    playCount: number
}

export interface IHotMusicNewSongs {
    name: string,
    song: { artists: {name: string}[], album: {name: string}, exclusive: boolean },
    id: string
}

interface IHotMusicProps {
    songList: IHotMusicSongLists[],
    newSongs: IHotMusicNewSongs[],
    rh: any
}

export default function HotMusic(props: IHotMusicProps) {
    const { songList, newSongs, rh } = props
    const standardLists = songList.map((v: any): ISongBlockProps => ({
        type: SongBlockType.C,
        name: v.name,
        picUrl: v.coverImgUrl,
        playCount: v.playCount
    }))

    const standardSongs = newSongs.map((v: IHotMusicNewSongs): ISongBarProps => ({
        id: v.id,
        name: v.name,
        authors: v.song.artists.map((v) => v.name),
        album: v.song.album.name,
        exclusive: v.song.exclusive
    }))

    const handleClick = (id: string | undefined): void => {
        rh.push(`/song?id=${id}`)
    }

    return (
        <div className="body-content--hot-lists">
            <Label title="推荐歌单" />
            <div className="body-content_songs--common">
                {standardLists.map((v: ISongBlockProps, index: number) => {
                    return <SongBlock key={v.type + v.name} data={v} index={index} />
                })}
            </div>
            <Label title="最新音乐" />
            <React.Fragment>
                {standardSongs.map((v: ISongBarProps, index: number) => {
                    return (
                        <div key={v.album + v.name + "div"} onClick={() => { handleClick(v.id) }}>
                            <SongBar key={v.album + v.name} data={v} index={index} />
                        </div>
                    )
                })}
            </React.Fragment>
            <footer className="footer--hot_songs">
                <Logo />
                <div className="footer--hot_songs--open--app">
                    打开App，发现更多音乐 >
                </div>
            </footer>
        </div>
    )
}