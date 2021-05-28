import './App.css';
import { useState } from 'react';
import BackgroundUpdater from './BackgroundUpdater';
import GameEngine from './GameEngine';

function App() {

  const [message, setMessage] = useState("");

  const [moves, setMoves] = useState(0);

  const [pushes, setPushes] = useState(0);

  const levelData = {
    name: "Level #1",
    author: "Original Author",
    data: [
      "    #####          ",
      "    #   #          ",
      "    #$  #          ",
      "  ###  $##         ",
      "  #  $ $ #         ",
      "### # ## #   ######",
      "#   # ## #####  ..#",
      "# $  $          ..#",
      "##### ### #@##  ..#",
      "    #     #########",
      "    #######        "
    ]};

  const levelComplete = () => {
    setMessage("Level completed!");
  }

  const playerMoving = (moves) => {
    //console.log("Player moving. Moves: ", moves);
    setMoves(moves);
  }

  const playerPushing = (pushes) => {
    // console.log("Player pushing. Pushes: ", pushes);
    setPushes(pushes);
  }

  return (
    <div className="App">
      <BackgroundUpdater>
        <div>
          <GameEngine
            level={levelData}
            onLevelCompleted={levelComplete}
            onPlayerMoved={playerMoving}
            onPlayerPushed={playerPushing}>
            <div>
              <p>{message}</p>
              <p>Moves: {moves}</p>
              <p>Pushes: {pushes}</p>
            </div>
          </GameEngine>
        </div>
      </BackgroundUpdater>
    </div>
  );
}

export default App;
