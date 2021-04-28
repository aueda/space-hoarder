import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import styles from './BackgroundUpdater.module.css';

function BackgroundUpdater(props) {

    const [ imageUrl, setImageUrl ] = useState("");

    useEffect(() => {

        function getImageOfTheDay(callback, date) {

            const url =
                "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

            const urlParam =
                typeof date === 'undefined'
                    ? "&date=2021-04-25"
                    : ""

            axios
                .get(url + urlParam)
                .then(response => {

                    if (response.data.media_type === "image") {
                        callback(response.data.url);
                    }
                });
        }

        let imageUrl = window.localStorage
            .getItem("background-url");

        if (imageUrl === null ||
            imageUrl === "") {

            imageUrl = getImageOfTheDay(function (newImageUrl) {
                
                if (newImageUrl !== "") {
            
                    window.localStorage.setItem(
                        "background-url",
                        newImageUrl);

                    setImageUrl(newImageUrl);
                }
            });
        } else {

            setImageUrl(imageUrl);
        }

    }, []);

    return(
        <div className={styles.boardContainer} style={{
            backgroundImage: `url(${imageUrl})`,
          }}>
              {props.children}
        </div>
    );
}

export default BackgroundUpdater;