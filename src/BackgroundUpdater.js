import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";
import styles from './BackgroundUpdater.module.css';
import useBackgroundUpdater from './useBackgroundUpdater';

function BackgroundUpdater(props) {

    const [ imageUrl, setImageUrl ] = useState("");

    useEffect(() => {

        function getImageOfTheDay(callback, date) {

            function appendLeadingZeros(number) {
                return number > 9
                    ? number.toString()
                    : "0" + number.toString();
            }

            const url =
                "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
debugger;
            const dateString =
                date.getFullYear() + "-" +
                appendLeadingZeros((date.getMonth() + 1)) + "-" +
                appendLeadingZeros(date.getDay());

            const urlParam =
                typeof date === 'undefined'
                    ? "&date=2021-04-25"
                    : "&date=" + dateString;
            console.log(dateString);
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
            }, new Date());
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