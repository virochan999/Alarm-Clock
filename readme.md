# Alarm Clock Project
This project is a simple alarm clock application built using only vanilla JavaScript, with no external libraries or frameworks. The application allows users to set alarms and get alerted when the set time is reached.

## Features
Clock Face
The clock face displays the current time in hours, minutes, and seconds. The time updates in real-time as the clock ticks.

## Set Alarm
Users can set an alarm by providing the desired hour, minute, second, and AM/PM in input boxes. Once the user enters the desired time and clicks the **"Set Alarm"** button, the alarm will be added to the list of alarms below.

## Alarms List
The application maintains a list of all the alarms set by the user. Each alarm entry in the list shows the set time in hours, minutes, seconds format. The list is updated dynamically whenever a new alarm is set or an existing alarm is deleted.

## Delete Alarm
Each alarm entry in the alarms list has a delete button associated with it. When the user clicks the delete button, the corresponding alarm will be removed from the list. Importantly, when an alarm is deleted, it will not trigger an alert if the time has not passed.

## Usage
To use the alarm clock, simply open the index.html file or use live server vs code extension in a modern web browser that supports JavaScript. The clock face will display the current time, and you can set alarms using the input boxes provided. To delete an alarm, click the delete button next to the alarm entry in the alarms list.

**Please note that the application is entirely client-side and does not save any data. Reloading the page will reset the clock and clear all the set alarms.**

## Compatibility
This alarm clock is built using standard HTML, CSS, and vanilla JavaScript. As such, it should be compatible with most modern web browsers, including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, and others.


## Acknowledgments
This project was inspired by the desire to explore the capabilities of vanilla JavaScript in building practical applications. It serves as a demonstration of how a simple yet functional alarm clock can be created using vanilla js. If you find this project helpful or have any feedback, feel free to contribute or reach out to me.