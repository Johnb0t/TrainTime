// Initialize Firebase
var config = {
    apiKey: "AIzaSyBF5dcDNh7vC3O4swfx4aAKswRF5waAg6g",
    authDomain: "train-homework-5d965.firebaseapp.com",
    databaseURL: "https://train-homework-5d965.firebaseio.com",
    storageBucket: "train-homework-5d965.appspot.com",
    messagingSenderId: "942547769540"
};
firebase.initializeApp(config);

//var to hold database info
var trainDataBase = firebase.database();
//var to hold information from form
var trainName = "";
var destination = "";
var firstTrainTime = "";
var trainFrequency = "";

$(document).ready(function() {
	//var to hold train-schedule div
	var currentTrainSchedule = $("#train-schedule");
	//var to hold form information
	var form = $("#train-adder-form");

	// refreshPage function()

	form.submit(function(e){
		e.preventDefault();
		//var to hold info entered by user
		trainName = $("#train-name").val().trim();
		destination = $("#train-destination").val().trim();
		firstTrainTime = $("#first-train-time").val().trim();
		trainFrequency = $("#train-frequency").val().trim();

		// Creates local "temporary" object for holding employee data
 		var newTrain = {
		   name: trainName,
		   dest: destination,
		   firstTime: firstTrainTime,
		   freq: trainFrequency
		 };

		// Uploads train data to the database
		trainDataBase.ref().push(newTrain);

		 // Clears all of the text-boxes
		$("#train-name").val("");
		$("#train-destination").val("");
		$("#first-train-time").val("");
		$("#train-frequency").val("");

		 // Prevents moving to new page
		return false;
		});

		//pull from database and prints to screen/html
		trainDataBase.ref().on("child_added", function(childSnapshot) {

		// Store everything into a variable.
		var trainName = childSnapshot.val().name;
		var destination = childSnapshot.val().dest;
		var firstTrainTime = childSnapshot.val().firstTime;
		var trainFrequency = childSnapshot.val().freq;


		// First Time (pushed back 1 year to make sure it comes before current time)
	    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

	    // Current Time
	    var currentTime = moment();

	    // Difference between the times
	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

	    // Time apart (remainder)
	    var tRemainder = diffTime % trainFrequency;

	    // Minute Until Train
	    var tMinutesTillTrain = trainFrequency - tRemainder;

	    // Next Train
	    var nextTrain = moment().add(tMinutesTillTrain, "minutes");


		//var to hold a row
		var row = $("<div class=row>");
		//var to hold a col for trainName
		var trainNameCol = $("<div class=col-md-3>").text(trainName);
		//var to hold a col for destincation
		var destinationCol = $("<div class=col-md-3>").text(destination);
		//var to hold a col for frequency
		var trainFrequencyCol = $("<div class=col-md-2>").text(trainFrequency);
		//var to hold a col for frequency
		var tMinutesTillTrainCol = $("<div class=col-md-2>").text(tMinutesTillTrain);
		//var to hold a col for frequency
		var nextTrainCol = $("<div class=col-md-2>").text(moment(nextTrain).format("hh:mm A"));

		completedRow = row.append(trainNameCol).append(destinationCol).append(trainFrequencyCol).append(nextTrainCol).append(
						tMinutesTillTrainCol);

		currentTrainSchedule.append(row);
	})

})