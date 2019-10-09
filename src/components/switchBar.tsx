import React from 'react'

/**
 *  description: 歌曲块
 */

interface ISwitchBarClickCB {
    (e: string): void
}

export default function SwitchBar(props: { titles: string[], click: ISwitchBarClickCB, current: string, toggled: boolean }) {
    const { titles, click, current, toggled } = props
    
    return (
        <div className="component-bar__switch-container border--solid--1px--gray">
            {titles.map((v: string) => {
                return <div className={v === current ? "component-bar__switch-item component-bar__switch-item--selected": "component-bar__switch-item"} key={v} onClick={() => click(v)}>
                    <div className="component-bar__switch-item--cover">
                        <span>{v}</span>
                    </div>
                </div>
            })}
        </div>
    )
}