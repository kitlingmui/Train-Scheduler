// Steps to complete:

// 1. Initialize Firebase for train scheduler
// 2. Create button for adding new Train - then update the html + update the database
// 3. Create a way to retrieve train from database
// 4. Create a way to calculate the nextArrival and mins away


// 1. Initialize Firebase for train scheduler
var config = {
    apiKey: "AIzaSyAuk47PmPgfViNOr5pMXqY-J-fbdJgWIZQ",
    authDomain: "train-scheduler-4266c.firebaseapp.com",
    databaseURL: "https://train-scheduler-4266c.firebaseio.com",
    projectId: "train-scheduler-4266c",
    storageBucket: "",
    messagingSenderId: "514503109297"
  };
firebase.initializeApp(config);

var database = firebase.database();

// Display Current Time
var currentClock = moment();
$(".right").append("Current Time: " + moment(currentClock).format('llll'))

  
// 2. When on Click "Submit" Button for adding train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainTime = $("#train-time-input").val().trim();
    var trainfreq = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        dest: trainDest,
        time: trainTime,
        freq: trainfreq
    };

    // Uploads Train data to the database
    database.ref().push(newTrain);

    //Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name
    var trainDest = childSnapshot.val().dest
    var trainTime = childSnapshot.val().time
    var trainFreq = childSnapshot.val().freq

    // Calculate the nextArrival and minAway
    var nextArrival
    var minAway


    var firstTime = moment(trainTime, "hh:mm")

    // First Time Converted (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var timeRemain = diffTime % trainFreq;

    // Minute Away 
    var minAway = trainFreq - timeRemain;

    // Next Train
    var nextTrain = moment().add(minAway, "minutes");
    nextArrival = moment(nextTrain).format("hh:mm");

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(moment(firstTime).format("hh:mm")),
        $("<td>").text(trainFreq),
        $("<td>").text(nextArrival),
        $("<td>").text(minAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow)

})