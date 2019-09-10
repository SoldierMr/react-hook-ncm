import React from 'react'
import makeImgUrl from '@actions/makeImgUrl'

/**
 *  description: 歌曲块
 */

export enum SongBlockType {
     S = 'small',
     C = 'common',
}

export interface ISongBlockProps {
     type: SongBlockType,
     name?: string,
     picUrl: string,
     author?: string,
     description?: string,
     playCount?: number,
     id?: string
}

export default function SongBlock(props: { data: ISongBlockProps, key: string, index?: number }) {
    const { data, index } = props
    const { type, name, picUrl, author, playCount = 0 } = data
    
    return (
        <React.Fragment>
            {type === SongBlockType.S && (
                <div className="component-block__song--small">
                    <img className="component-block__song--small-img" src={makeImgUrl(picUrl)} />
                    <div>{name}</div>
                    <div>{author}</div>
                </div>
            )}
            {type=== SongBlockType.C && (
                <div className="component-block__song--common">
                <img className="component-block__song--common-img" src={makeImgUrl(picUrl)} />
                <p>{name}</p>
                <span>{(playCount / 10000).toFixed(1) + '万'}</span>
                {index === 0 && (<i className="icon--king" />)}
            </div>
            )}
        </React.Fragment>
    )
}