import React from 'react'

/**
 *  description：标签块，纯展示模块
 */

export default function Label(props: {title: string}) {
    const { title } = props

    return (
        <div className="component-label__container">
            {title}
        </div>
    )
}