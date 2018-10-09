$(document).ready(function(){
var config = {
    apiKey: "AIzaSyAH67nNmlXV4dCtLyxFRsb6FBjh4xYRa9w",
    authDomain: "train-scheduler-e91f3.firebaseapp.com",
    databaseURL: "https://train-scheduler-e91f3.firebaseio.com",
    projectId: "train-scheduler-e91f3",
    storageBucket: "train-scheduler-e91f3.appspot.com",
    messagingSenderId: "558312390355"
  };
firebase.initializeApp(config);

var trainData = firebase.database().ref();
//Shows user the current time
$("#currentTime").append(moment().format("hh:mm A"));

// Click event to add trains
$("#addTrainBtn").on("click", function() {
    event.preventDefault();
    // Get user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequencyInput").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    // Uploads train data to the database
    trainData.push(newTrain);

    // Alert
    alert(newTrain.name + " has been successfully added");

    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");

    return false;
});


// Create Firebase event to database and html entry
trainData.on("child_added", function(childSnapshot) {

    let data = childSnapshot.val();
    let trainNames = data.name;
    let trainDestin = data.destination;
    let trainFrequency = data.frequency;
    let theFirstTrain = data.firstTrain;
    console.log(theFirstTrain);
    
    // Solution for solving minutes until arrival
    let tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
    let tMinutes = trainFrequency - tRemainder;

    //Add the tMinutes to the currrent time = arrival time
    let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    // Appeding train data to table
    $("#trainTable > tbody").append("<tr><td>" + trainNames + "</td><td>" + trainDestin + "</td><td class='min'>" + trainFrequency + "</td><td class='min'>" + tArrival + "</td><td class='min'>" + tMinutes + "</td></tr>");

});
})