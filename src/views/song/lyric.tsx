import React, { useState, useEffect } from 'react';
import useStateRequest, {IUseStateReturn} from '@hooks/useStateRequest'

interface ILyricProps {
    id: string,
    start: boolean,
    songName: string,
    songFrom: string,
    singer: string
}

const Lyric: React.SFC<ILyricProps> = function (props) {
    const { id, start, songName, songFrom, singer } = props;
    const name = songName + (songFrom ? `（${songFrom}）` : "");
    const { data, isLoading, isError, doFetch } : IUseStateReturn= useStateRequest();
    const lyric = data && data.lrc && data.lrc.lyric;


    const [list, setList] = useState([]);
    const [setTimeDuration, setSetTimeDuration] = useState(0);
    let [duration, setDuration] = useState(0);

    let durationLabel = 0;

    const lyricHandler = (ly: string): any[] => {
        let lyAr = ly.split('[');
        let res: any[] = [];
        lyAr.map(v => {
            let arr = v.split(']');
            // @ts-ignore
            if (arr[1] != false) {
                let time: string[] = arr[0].split('.');
                let time2: string[] = time[0].split(':');
                res.push([Number(time2[0]) * 60 * 1000 + Number(time2[1]) * 1000 + Number(time[1]), arr[1]])
            }
        });
        res.shift();
        if (list.length === 0) {
            // @ts-ignore
            setList([{data: res[0][1]}, {data: res[1][1]}, {data: res[2][1]}]);
        }
        return res
    };

    let lyricData = lyric && lyricHandler(lyric) || [];

    let getCurrent = (duration: number) => {
        let mylist: any[] = [];
        if (lyricData.length !== 0) {
            for (let i = 0; i < lyricData.length; i++) {
                if (lyricData[i][0] > duration) {
                    if (i === 0) {
                        break
                    }
                    if (i === 1) {
                        mylist.push({current: true, data: lyricData[i - 1][1]});
                        mylist.push({data: lyricData[i][1]});
                        mylist.push({data: lyricData[i + 1][1]});
                        break
                    }
                    mylist.push({data: lyricData[i - 2][1]});
                    mylist.push({current: true, data: lyricData[i-1][1]});
                    if (lyricData[i]) {
                        mylist.push({data: lyricData[i][1]});
                    }
                    break
                }
            }
            // @ts-ignore
            setList(mylist);
        }
        setDuration(duration);
    };

    const judgeTime = () => {
        duration = duration + (Date.now() - durationLabel);
        durationLabel = Date.now();
        getCurrent(duration)
    };

    /*
        get lyric start
     */
    const getSongs: (id: string) => void = (id) => {
        doFetch({
            method: 'get',
            url: `lyric?id=${id}`
        });
    };

    useEffect((): void => {
        getSongs(id);
    }, [id]);
    /*
        get lyric end
    */

    useEffect((): void => {
        if (start) {
            durationLabel = Date.now();
            judgeTime();
            let si: any = setInterval(judgeTime, 500);
            setSetTimeDuration(si)
        }

        if (!start) {
            if (durationLabel) {
                setDuration(duration + (Date.now() - durationLabel));
            }
            clearInterval(setTimeDuration)
        }
    }, [start]);

    return (
        <div className="song__detail--lyric">
            <h2>{name || "加载中..."}</h2>
            <div className="song__detail--lyric__rock">
                {list.length === 0 && <p>歌词加载中...</p>}
                {list.length > 0 && list.map((v: any, key: number) => (
                    <p key={v.data + key} style={v.current ? {color: "white"} : {}}>{v.data}</p>
                ))}
            </div>
        </div>
    );
};

export default Lyric