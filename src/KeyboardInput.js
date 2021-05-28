import useKeyPress from './useKeyPress';
import { useEffect } from 'react';

function KeyboardInput({ gameEngine }) {

    const leftPress = useKeyPress("a");
    const upPress = useKeyPress("w");
    const rightPress = useKeyPress("d");
    const downPress = useKeyPress("s");    

    useEffect(() => {

        if (leftPress) {
            gameEngine.movePlayerLeft();
        }

    }, [gameEngine, leftPress]);

    useEffect(() => {

        if (upPress) {
            gameEngine.movePlayerUp();
        }

    }, [gameEngine, upPress]);

    useEffect(() => {

        if (rightPress) {
            gameEngine.movePlayerRight();
        }

    }, [gameEngine, rightPress]);  

    useEffect(() => {

        if (downPress) {
            gameEngine.movePlayerDown();
        }

    }, [gameEngine, downPress]);  

    return(
        <>
        </>
    );
}

export default KeyboardInput;