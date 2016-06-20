
//format utility
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}


var flight_counter = 1;
var hotel_counter = 1;
var groundT_counter = 1;
var rental_counter = 1;

////////////////////////////////////
// flight

function addFlight(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getFlightHTML();
  document.getElementById(divName).appendChild(newdiv);
  flight_counter++;
  
}

function getFlightHTML(){	
	var flight_str = `<div>
	<fieldset>
    <legend>Flight {0}</legend>
		<table border=0 id="flight_{0}">
			<tr>
				<td>Airline:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Flight no.:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Departure city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Departure date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Departure time:</td>
				<td><input type=time></td>
			</tr>
			<tr>
				<td>Arrival city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Arrival date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Arrival time:</td>
				<td> <input type="time"></td>
			</tr>
			<tr>
				<td>Airline confirmation no.:</td>
				<td> <input type="text"></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove flight" onClick="removeElement(document.getElementById('flight_{0}').id, 'flight')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(flight_counter)
	
	return flight_str
}

////////////////////////////////////
// hotel

function addHotel(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getHotelHTML();
  document.getElementById(divName).appendChild(newdiv);
  hotel_counter++;
  
}

function getHotelHTML(){	
	var hotel_str = `<div>
	<fieldset>
    <legend>Hotel {0}</legend>
		<table border=0 id="hotel_{0}">
			<tr>
				<td>Hotel name:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Hotel address:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Hotel phone:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Hotel notes:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Check in date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Check out date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Room type:</td>
				<td> <input type="text"></td>
			</tr>
			<tr>
				<td>Hotel confirmation no.:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove hotel" onClick="removeElement(document.getElementById('hotel_{0}').id, 'hotel')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(hotel_counter)
	
	return hotel_str
}

////////////////////////////////////
// ground transportation

function addGroundT(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getGroundTHTML();
  document.getElementById(divName).appendChild(newdiv);
  groundT_counter++;
  
}

function getGroundTHTML(){	
	var groundT_str = `<div>
	<fieldset>
    <legend>Ground transportation {0}</legend>
		<table border=0  id="groundT_{0}">
			<tr>
				<td>Transport company:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Line number:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Departure City</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Departure date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Departure time:</td>
				<td><input type=time></td>
			</tr>
			<tr>
				<td>Arrival city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Arrival date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Arrival time:</td>
				<td> <input type="time"></td>
			</tr>
			<tr>
				<td>Confirmation no.:</td>
				<td> <input type="text"></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove ground transportation" onClick="removeElement(document.getElementById('groundT_{0}').id, 'ground_t')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(groundT_counter)
	
	return groundT_str
}

////////////////////////////////////
// car rental

function addCarRental(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getCarRentalTHTML();
  document.getElementById(divName).appendChild(newdiv);
  rental_counter++;
  
}

function getCarRentalTHTML(){	
	var car_rental_str = `<div>
	<fieldset>
    <legend>Car rental {0}</legend>
		<table border=0 id="carRental_{0}">
			<tr>
				<td>Rental company:</td>
				<td><input type="text" id="car_company"></td>
			</tr>
			<tr>
				<td>Rental company address:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Rental company phone:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Pick up date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Pick up time:</td>
				<td><input type=time></td>
			</tr>
			<tr>
				<td>Drop off date:</td>
				<td><input type="date"></td>
			</tr>
			<tr>
				<td>Drop off time:</td>
				<td><input type="time"></td>
			</tr>
			<tr>
				<td>Confirmation no.:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Rental notes:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove ground transportation" onClick="removeElement(document.getElementById('car_rental_{0}').id, 'ground_t')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(rental_counter)
	
	return car_rental_str
}


function removeElement(divName, class_str){
	
	//alert(divName);
	document.getElementById(divName).remove()
	if (class_str == 'flight'){
		flight_counter--;
	}
	else if(class_str == 'hotel'){
		hotel_counter--;
	}
	else if(class_str == 'ground_t'){
		groundT_counter--;
	}
	else if(class_str == 'car_rental'){
		rental_counter--;
	}
	
}


///////////////////////////////////
// generateReport
function generateReport(){
	
	var tables = document.getElementsByTagName('table');
    var txt = "";
    var i;
    for (i = 0; i < tables.length; i++) {
		//switch on type
		var cur_id = tables[i].id;
		var cat_cur_id = cur_id.split("_")
		switch(cat_cur_id[0]){
			case 'flight': 
				txt = txt + reportFlight(tables[i], cat_cur_id[1]) + "</br>";
				break;
			case 'hotel': 
				break;
			case 'groundT': 
				break;
			case 'carRental': 
				txt = txt + reportCar(tables[i], cat_cur_id[1]) + "</br>";
				break;						
		}   
    }
	
	document.getElementById("resultArea").innerHTML = txt;
}

function reportFlight(flight_node, flight_no){
	var flight_report;
    var flight_data = []; 
	
	var input = flight_node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			flight_data.push( input[z].value.trim() ); 
    } 
	//alert(flight_data)
	
	//formatting
	flight_report = flight_data[0] + " " + flight_data[1] + "</br>" +
				 "Departing from: " + flight_data[2] + " at " + formatTime(flight_data[4]) + "[TODO:  (+1 if ADATE is larger than DDATE)]</br>" + 
				 "Arriving at: " + flight_data[5] + " at " +  formatTime(flight_data[7]) + "</br>" +  
				 "Airline confirmation no.: " + flight_data[8] + "</br></br>"; 
	
	return flight_report
}

function reportCar(car_node, car_no){
	var car_report;
    var car_data = []; 
	
	var input = car_node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			car_data.push( input[z].value.trim() ); 
    } 
	//alert(car_data)
	
	//formatting
	car_report = car_data[0] + "(" + car_data[8] + " )</br>" + car_data[1] + ", " + car_data[2] + "</br>" + 
				 "Pick up: " + car_data[3] + " at " + formatTime(car_data[4]) + "</br>" + 
				 "Drop off: " + car_data[5] + " at " +  formatTime(car_data[6]) + "</br>" + 
				 "Duration: [TO BE CALCULATED]" + "</br>" + 
				 "Confirmation no.: " + car_data[7] + "</br></br>"; 
	
	return car_report
}

function formatTime(time){
	var isAM = Boolean(1);
	var suffix;
	var split_time = time.split(":");
	var hour = parseInt(split_time[0]);
	if (hour >= 12){
		isAM = Boolean(0)
	}
	hour = ((hour + 11) % 12 + 1);
	isAM ? suffix = "AM" : suffix = "PM" ;
	return "{0}:{1} {2}".format(hour.toString(), split_time[1], suffix)
}