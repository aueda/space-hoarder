import { createRef, useState, useRef, useEffect, useMemo } from 'react';
import styles from "./PlayField.module.css";
import tilePlayer from './images/tile-player.png';
import tileFloor from './images/tile-floor.png';
import tileWall from './images/tile-wall.png';
import tileCrate from './images/tile-crate.png';
import tileTarget from './images/tile-target.png';

function PlayField(props) {

    const field = useRef("id");

    const [fieldMap, setFieldMap] = useState([]);
 
    const pieceRefs = useMemo(
        () => fieldMap.map(()=> createRef()),
        [fieldMap]);

    const pieceWidth = 32;

    console.log("map: " + props.map);

    const fieldWidth = props.level.data[0].length * pieceWidth;

    useEffect(() => {

        const buildUrl = function (piece) {

            let url = "";

            switch (piece) {
                case "@":
                    url = {tilePlayer}.tilePlayer;
                    break;
                case " ":
                    url = {tileFloor}.tileFloor;
                    break;
                case "#":
                    url = {tileWall}.tileWall;
                    break;
                case "$":
                    url = {tileCrate}.tileCrate;
                    break;
                case ".":
                    url = {tileTarget}.tileTarget;
                    break;
                default:
                    url = "https://via.placeholder.com/" +
                    pieceWidth + "x" + pieceWidth +
                    ".png?text=" + encodeURIComponent(piece);
                    break;
            }          

            return url;
        };

        let tempMap = [];

        for (let x = 0; x < props.map.length; x += 1) {
            let piece = props.map.charAt(x);

            tempMap.push({
                piece: piece,
                pieceImage: buildUrl(piece),
            });
        }

        setFieldMap(tempMap);
    }, [props.map]);     

    return (
        <div className={styles.playfield}
             style={{width: fieldWidth + "px"}}
             ref={field}>
            {
                fieldMap.map((piece, i) => {

                    return (
                        <img src={piece.pieceImage}
                             alt={"test" + i}
                             ref={pieceRefs[i]}
                             key={i} />
                    );
                })
            }
        </div>
    );
}

export default PlayField;