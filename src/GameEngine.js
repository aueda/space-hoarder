import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import { Component } from 'react';
import PlayField from './PlayField';
import KeyboardInput from './KeyboardInput';
import styles from './GameEngine.module.css';

class GameEngine extends Component {

    constructor(props) {

        super(props);

        this.moveDirectionLeft = 0;
        this.moveDirectionDown = 4;
        this.moveDirectionUp = 1;
        this.moveDirectionRight = 2;

        this.pushes = 0;
        this.moves = 0;
        this.map = "";
        this.remainingTargets = 0;
        this.totalTargets = 0;
        this.mapWidth = 0;
        this.mapHeight = 0;

        this.playerPosition = 0;
        this.clipboard = [];

        this.targetPositions = [];

        this.state = {
            outputMap: ""
        };
    }

    loadMap = async (levelData) => {

        let map = "";

        let height = levelData.length;    

        let width = height > 0
            ? levelData[0].length
            : 0;

        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                let piece = levelData[y].charAt(x);

                map += piece;

                if (piece === "@") {
                    this.playerPosition = map.length - 1;
                }

                if (piece === ".") {
                    this.remainingTargets += 1;
                    this.totalTargets += 1;
                    this.targetPositions.push(map.length - 1);
                }
            }
        }

        this.map = map;
        this.clipboard = new Array(map.length).fill(null);
        this.mapWidth = width;
        this.mapHeight = height;

        this.setState({
            outputMap: this.map
        })

        this.logMap(this.map);
    }

    increaseMoves = () => {
        this.moves += 1;
    }

    increasePushes = () => {
        this.pushes += 1;
    }    

    movePlayerLeft = () => {
        this.movePlayer(
            this.moveDirectionLeft);
    }    

    movePlayerUp = () => {
        this.movePlayer(
            this.moveDirectionUp);
    }

    movePlayerDown = () => {
        this.movePlayer(
            this.moveDirectionDown);
    }

    movePlayerRight = () => {
        this.movePlayer(
            this.moveDirectionRight);
    }

    getPushes = () => {
        return this.pushes;
    }

    getMoves = () => {
        return this.moves;
    }

    movePlayer = (direction) => {
        
        if (this.canPush(direction)) {
           
            this.push(direction);

            this.props.onPlayerMoved(
                this.moves);

            this.props.onPlayerPushed(
                this.pushes);            
        }
        else
        {
            if (this.canMove(direction)) {

                this.move(direction, this.playerPosition);

                this.props.onPlayerMoved(
                    this.moves);

            } else {
               // this.hitCallback();
            }
        }

        this.calculateTargetsLeft();

        if (this.remainingTargets === 0) {

            //this.levelCompleteCallback();
            this.props.onLevelCompleted();
        }   

        this.setState({
            outputMap: this.map
        })

        this.logMap();
    }

    calculatePlayerPosition = (direction, position, offset) => {

        let resultPosition = 0;

        switch (direction) {

            case this.moveDirectionDown:

                if (position + (this.mapWidth * offset) < this.map.length) {
                    resultPosition = position + (this.mapWidth * offset);
                }

                break;

            case this.moveDirectionLeft:

                if (position - offset >= 0) {
                    resultPosition = position - offset;
                }

                break;

            case this.moveDirectionRight:

                if (position + offset < this.map.length) {
                    resultPosition = position + offset;
                }

                break;

            case this.moveDirectionUp:

                if (position - (this.mapWidth * offset) >= 0) {
                    resultPosition = position - (this.mapWidth * offset);
                }

                break;

            case this.moveDirectionNone:
            default:

                resultPosition = position;

                break;
        }

        return resultPosition;
    }

    getPiece = (position) => {
        return this.map[position];
    }

    canPush = (direction) => {

        const piece1Position = this.calculatePlayerPosition(
            direction,
            this.playerPosition,
            1);

        const piece2Position = this.calculatePlayerPosition(
            direction,
            this.playerPosition,
            2);

        const piece1 = this.getPiece(piece1Position);

        const piece2 = this.getPiece(piece2Position);

        return piece1 === "$" &&
            (piece2 === " " || piece2 === ".");
    }

    push = (direction) => {

        const cratePosition = this.calculatePlayerPosition(
            direction,
            this.playerPosition,
             1);

        const candidateTargetPosition = this.calculatePlayerPosition(
            direction,
            cratePosition,
            1);

        // this.decreateRemainingTargets(
        //      this.getPiece(candidateTargetPosition) === ".");

        this.move(direction, cratePosition);

        // this.increaseRemainingTargets(
        //     this.getPiece(cratePosition) === ".");

        this.move(direction, this.playerPosition);

        this.increasePushes();
    }

    calculateTargetsLeft = () => {

        var y = 0;

        for (let x = 0; x < this.targetPositions.length; x += 1) {

            if (this.map.charAt(this.targetPositions[x]) === "$") {
                y += 1;
            }
        }

        this.remainingTargets = this.totalTargets - y;

        console.log(this.remainingTargets);
    }

    canMove = (direction) => {

        var nextPiecePosition = this.calculatePlayerPosition(
            direction,
            this.playerPosition,
            1);

        var piece = this.getPiece(nextPiecePosition);

        return piece === " " || piece === ".";
    }

    decreateRemainingTargets = (targetCondition) => {
        this.remainingTargets -=
            targetCondition
                ? 1
                : 0;

        this.remainingTargets =
            Math.max(this.remainingTargets, 0);
    }

    increaseRemainingTargets = (targetCondition) => {
        this.remainingTargets +=
            targetCondition == null
                ? 1
                : 0;
    }    

    logMap = () => {

        let line = "";
        let count = 0;

        for (var i = 0; i < this.map.length; i += 1) {

            line += this.map[i];

            if (++count === this.mapWidth) {
                line += '\n';
                count = 0;
            }
        }

        console.log(line);

        console.log("Moves: ", this.moves);
        console.log("Pushes: ", this.pushes);
        console.log("Targets left: ", this.remainingTargets);
    }

    move = (direction, position) => {

        var currentPiece = this.getPiece(position);

        var nextPiecePosition = this.calculatePlayerPosition(
            direction,
            position,
            1);

        this.savePiece(nextPiecePosition);

        this.setPiece(nextPiecePosition, currentPiece);

        if (currentPiece === "@")
        {
            this.playerPosition = nextPiecePosition;
        }

        this.restorePiece(position);

        this.increaseMoves();
    }

    savePiece = (position) => {
       
        var piece = this.getPiece(position);

        if (piece !== " ")
        {
            let temp =  [...this.clipboard];

            temp[position] = piece;

            this.clipboard = temp;
        }
    }

    restorePiece = (position) =>  {

        let restorePiece = this.clipboard[position] === null
            ? " "
            : this.clipboard[position];

        let temp =  [...this.clipboard];

        temp[position] = null;

        this.clipboard = temp;

        this.setPiece(position, restorePiece);

        return restorePiece;
    }

    setPiece = (position, piece) =>  {

        if (position < this.map.length)
        {
            let firstPart = this.map.substr(0, position);
            let lastPart = this.map.substr(position + 1);

            let updateMap = firstPart + piece + lastPart;

            this.map = updateMap;
        }
    }

    componentDidMount = () => {

        this.loadMap(this.props.level.data)
    }

    render = () => {
        
        return (
        <div className={styles.gameEngine}>
            <h1>Space Hoarder</h1>
            <KeyboardInput
                gameEngine={this}>
            </KeyboardInput>  
            <PlayField
                map={this.state.outputMap}
                level={this.props.level}>
            </PlayField>          
            { this.props.children }
        </div>);
    }
}

export default GameEngine;