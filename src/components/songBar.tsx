import React from 'react'

/**
 *  description: 歌曲条
 */

export enum SongBarType {
    I = "withIndex",
    C = "common",
}

export interface ISongBarProps {
    id?: string,
    name: string,
    authors: string[],
    album: string,
    exclusive?: boolean
}

export default function SongBar(props: { data: ISongBarProps, key: string, index: number, type?: SongBarType }) {
    const { data, type = SongBarType.C, index } = props
    const { name, authors, album, exclusive } = data
    return (
        <div className="component-bar__song-container">
            {type === SongBarType.I && (
                <div className={"component-bar__song__rank " + (index < 3 ? "component-bar__song__rank--red" : "")}>
                    {index < 9 ? ("0" + (index + 1)) : index + 1}
                </div>
            )}
            <div className={"component-bar__song--sample-container border--solid--1px--gray" + (type === SongBarType.C ? " component-bar__song-container--margin": "")}>
                <div className={"component-bar__song--sample--info" + (type === SongBarType.C ? "" : " component-bar__song--sample--info--narrow")}>
                    <div className="component-bar__song--sample--name">
                        {name}
                    </div>
                    <div className="component-bar__song--sample--authors">
                        {exclusive && <i className="icon--exclusive" />}
                        {authors.join(' / ')}
                        {" - "}
                        {album}
                    </div>
                </div>
                <div className="component-bar__song--sample--start">
                    <span />
                </div>
            </div>
        </div>
    )
}
