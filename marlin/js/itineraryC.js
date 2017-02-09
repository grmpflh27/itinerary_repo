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

//contains utility
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

//Array move utility
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

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

var flight_counter = 1;
var hotel_counter = 1;
var groundT_counter = 1;
var rental_counter = 1;

/*
 * HTML form elements
 */


////////////////////////////////////
// flight
////////////////////////////////////

function addFlight(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getFlightHTML();
  document.getElementById(divName).appendChild(newdiv);
  flight_counter++;
  
  focusFirstInput(newdiv);
  
}

function getFlightHTML(){
	var flight_str = `<div id="div_flight_{0}">
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
				<td>Seat:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Departure city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Departure date:</td>
				<td><input type="date" value={1}></td>
			</tr>
			<tr>
				<td>Departure time:</td>
				<td><input type=time step="300"></td>
			</tr>
			<tr>
				<td>Arrival city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Arrival date:</td>
				<td><input type="date" value={1}></td>
			</tr>
			<tr>
				<td>Arrival time:</td>
				<td> <input type="time" step="300"></td>
			</tr>
			<tr>
				<td>Airline confirmation no.:</td>
				<td> <input type="text"></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove flight" onClick="removeElement(document.getElementById('div_flight_{0}').id, 'flight')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(flight_counter, moment().format("YYYY-MM-DD"))
	
	return flight_str
}

////////////////////////////////////
// hotel
////////////////////////////////////

function addHotel(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getHotelHTML();
  document.getElementById(divName).appendChild(newdiv);
  hotel_counter++;
  
  focusFirstInput(newdiv);
}

function getHotelHTML(){	
	var hotel_str = `<div  id="div_hotel_{0}">
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
				<td><input type="date" value={1}></td>
			</tr>
			<tr>
				<td>Check out date:</td>
				<td><input type="date" value={1}></td>
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
				<td><input type="button" value="Remove hotel" onClick="removeElement(document.getElementById('div_hotel_{0}').id, 'hotel')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(hotel_counter, moment().format("YYYY-MM-DD"))
	
	return hotel_str
}

////////////////////////////////////
// ground transportation
////////////////////////////////////

function addGroundT(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getGroundTHTML();
  document.getElementById(divName).appendChild(newdiv);
  groundT_counter++;
  
  focusFirstInput(newdiv);
  
}

function getGroundTHTML(){	
	var groundT_str = `<div id=div_groundT_{0}>
	<fieldset>
    <legend>Ground transportation {0}</legend>
		<table border=0  id="groundT_{0}">
			<tr>
				<td>Type</td>
				<td>
					<select>
					  <option value="Train">Train</option>
					  <option value="Bus">Bus</option>
					  <option value="Motorcoach">Motorcoach </option>
					  <option value="Ferry">Ferry</option>
					</select>
				</td>
			</tr>
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
				<td><input type="date" value={1}></td>
			</tr>
			<tr>
				<td>Departure time:</td>
				<td><input type=time step="300"></td>
			</tr>
			<tr>
				<td>Arrival city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Arrival date:</td>
				<td><input type="date" value={1}></td>
			</tr>
			<tr>
				<td>Arrival time:</td>
				<td> <input type="time" step="300"></td>
			</tr>
			<tr>
				<td>Confirmation no.:</td>
				<td> <input type="text"></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove ground transportation" onClick="removeElement(document.getElementById('div_groundT_{0}').id, 'ground_t')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(groundT_counter, moment().format("YYYY-MM-DD"))
	
	return groundT_str
}

////////////////////////////////////
// car rental
////////////////////////////////////

function addCarRental(divName){

  var newdiv = document.createElement('div');
  newdiv.innerHTML = getCarRentalTHTML();
  document.getElementById(divName).appendChild(newdiv);
  rental_counter++;
  
  focusFirstInput(newdiv);
  
}

function getCarRentalTHTML(){	
	var car_rental_str = `<div id=div_carRental_{0}>
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
				<td><input type="date" value={1}></td>
			</tr>
			<tr>
				<td>Pick up time:</td>
				<td><input type=time step="300"></td>
			</tr>
			<tr>
				<td>Drop off date:</td>
				<td><input type="date" value={1}></td>
			</tr>
			<tr>
				<td>Drop off time:</td>
				<td><input type="time" step="300"></td>
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
				<td><input type="button" value="Remove car rental" onClick="removeElement(document.getElementById('div_carRental_{0}').id, 'ground_t')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(rental_counter, moment().format("YYYY-MM-DD"))
	
	return car_rental_str
}

function focusFirstInput(newdiv){
	var inputs = newdiv.getElementsByTagName( 'input' );
	inputs[0].focus();
	inputs[0].select();
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
////////////////////////////////////

function generateReport(){
	
	var tables = document.getElementsByTagName('table');
    var txt = "";
	var report_objects = [];
    for (var i = 0; i < tables.length; i++) {
		//switch on type
		var cur_id = tables[i].id;
		var cat_cur_id = cur_id.split("_")
		cur_txt = ""
		var cur_date_str = getDateElement(tables[i], cat_cur_id[0])
		var cur_time_str = getTimeElement(tables[i], cat_cur_id[0])
		switch(cat_cur_id[0]){
			case 'flight': 
				cur_txt = reportFlight(tables[i]);		
				break;
			case 'hotel': 
				cur_txt = reportHotel(tables[i]);
				break;
			case 'groundT': 
				cur_txt = reportGroundT(tables[i]);
				break;
			case 'carRental': 
				cur_txt = reportCar(tables[i]);
				break;				
		}
		
		var cur_date_time = null;
		if(cat_cur_id[0] != "hotel"){
			cur_date_time = moment(cur_date_str);
			//TODO: check on pamelas PC how a string is stored
			var split_time = cur_time_str.split(":");
			cur_date_time.hour(parseInt(split_time[0]));
			cur_date_time.minute(parseInt(split_time[1]));
		}

		var obj = {
			id : i,
			category : cat_cur_id[0],
			content  : cur_txt,
			date : moment(cur_date_str),
			date_str : cur_date_str,
			time     : cur_date_time
		};		
		
		txt = txt + cur_txt + "</br>";
		report_objects.push(obj);
    }
	
	//sort date strings
	report_objects.sort(function(a, b) { 
		return a.date - b.date;
	})
	
	//unique dates
	var unique_dates = []
	
	var date_groups = {}
	for(var i=0; i < report_objects.length; i++){
		
	    if(!contains.call(unique_dates, report_objects[i].date_str)){
			date_groups["{0}".format(report_objects[i].date_str)] = [report_objects[i]];
			unique_dates.push(report_objects[i].date_str)
		}
		else{
			date_groups["{0}".format(report_objects[i].date_str)].push(report_objects[i])
		}
	}
	
	//re-order each date_group
	for(prop in date_groups){
		if(date_groups[prop].length > 1){
			date_groups[prop] = sortGroupByCategory(date_groups[prop]);
		}
	}
	
	//append the following format to each first element
	//Monday, June 13, 2016
	for(prop in date_groups){
		var cur_date = date_groups[prop][0].date;
		var header_date = cur_date.format("dddd, MMMM DD, YYYY");
		date_groups[prop][0].content = "<b>{0}</b></br></br></br>".format(header_date) + date_groups[prop][0].content;
	}
	
	//assemble output in right order
	var right_order_txt = ""
	for(prop in date_groups){
		for(var i=0; i<date_groups[prop].length; i++){
			right_order_txt = right_order_txt + date_groups[prop][i].content + "</br>";
		}
	}
	
	
	//document.getElementById("resultArea").innerHTML = txt;
	document.getElementById("resultArea").innerHTML = right_order_txt;
}

function sortGroupByCategory(group){
	
	var full_group = group.slice();
	var hotel_idxs = []
	var hotel_group = [];
	
	for(var i=0; i < group.length; i++){
		if(group[i].category == 'hotel'){
			hotel_idxs.push(i);
		}
	}
	
	if(hotel_idxs.length){
		//remove hotel(s) from group
		for(var i=0; i < hotel_idxs.length; i++){
				group.splice(hotel_idxs[i], 1);
		}
		
		//split in two parts
		//hotel_group = group.slice(group.length - hotel_idxs.length);
		//group = group.slice(0, group.length - hotel_idxs.length);
	}
	
	//sort group by time	
	group.sort(function(a, b) { 
		return a.time - b.time;
	})
	
	//get hotels back at end of list
	if(hotel_idxs.length){
		for(var i=0; i < hotel_idxs.length; i++){
			group.push(full_group[hotel_idxs[i]]);
		}
	}
	
	return group;
	
}


function getDateElement(node, category){
	
	var node_data = []; 
	var input = node.getElementsByTagName("input"); 
    for(var z = 0; z < input.length; z++){ 
		if(z != input.length-1){
			node_data.push(input[z].value.trim()); 
		}
    } 
	
	var date;
	switch(category){
		case "flight":	
			date = node_data[4];
			break;
		case "hotel": 
			date = node_data[4];
			break;
		case "groundT": 
			date = node_data[3];
			break;
		case "carRental": 
			date = node_data[3];
			break;	 
	}
	return date;
}

function getTimeElement(node, category){
	
	var node_data = []; 
	var input = node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			node_data.push( input[z].value.trim() ); 
    } 
	
	var time;
	switch(category){
		case 'flight':	
			time = node_data[5];
			break;
		case 'hotel': 
			time = null;
			break;
		case 'groundT': 
			time = node_data[4];
			break;
		case 'carRental': 
			time = node_data[4];
			break;	 
	}
	return time;
}

function reportFlight(flight_node){
	var flight_report;
    var flight_data = []; 
	
	var input = flight_node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			flight_data.push( input[z].value.trim() ); 
    } 
	//alert(flight_data)
	
	var start_date = moment(flight_data[4])
	var end_date = moment(flight_data[7])
	var over_night = ""
	diff_days = end_date.diff(start_date, 'days');
	if(diff_days){
		over_night = " (+{0}) ".format(diff_days);
	}
	
	console.log(flight_data)
	//formatting
	flight_report = "Flight</br></br>" +
				 flight_data[0] + " " + flight_data[1] + "</br>" +
				 "Departing from: " + flight_data[3] + " at " + formatTime(flight_data[5]) + "</br>" + 
				 "Arriving at: " + flight_data[6] + " at " +  formatTime(flight_data[8]) + over_night + "</br>" + 
				 "Seat: " + flight_data[2] + "</br>" +	
				 "Airline confirmation no.: " + flight_data[9] + "</br></br>"; 
	
	return flight_report
}

function reportHotel(hotel_node){
	var hotel_report;
    var hotel_data = []; 
	
	var input = hotel_node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			hotel_data.push( input[z].value.trim() ); 
    } 
	//alert(hotel_data)
	
	var start_date = moment(hotel_data[4])
	var end_date = moment(hotel_data[5])
	var number_of_nights = end_date.diff(start_date, 'days');
	
	//formatting
	hotel_report = "Hotel </br></br>" + 
				 hotel_data[0] + " (" + hotel_data[3] + ")</br>" +
				 hotel_data[1] + ", " + hotel_data[2] + "</br>" + 
				 "Check in date: " + hotel_data[4] + "</br>" + 
				 "Check out date: " + hotel_data[5] + "</br>" +  				 
				 "Duration: {0} nights".format(number_of_nights) + "</br>" + 
				 "Room type: " +  hotel_data[6] + "</br>" + 
				 "Hotel confirmation no.: " + hotel_data[7] + "</br></br>"; 
	
	return hotel_report
}

function reportGroundT(groundT_node){
	var groundT_report;
    var groundT_data = []; 
	
	var input = groundT_node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			groundT_data.push( input[z].value.trim() ); 
    } 
	//alert(groundT_data)
	
	var start_date = moment(groundT_data[3])
	var end_date = moment(groundT_data[6])
	var over_night = ""
	diff_days = end_date.diff(start_date, 'days');
	if(diff_days){
		over_night = " (+{0}) ".format(diff_days);
	}
	
	//formatting
	groundT_report = "{0} </br></br>".format(groundT_node.getElementsByTagName( 'select' )[0].value) + 
				  groundT_data[0] + " " + groundT_data[1] + "</br>" +
				 "Departing from: " + groundT_data[2] + " at " + formatTime(groundT_data[4]) + "</br>" + 
				 "Arriving at: " + groundT_data[5] + " at " +  formatTime(groundT_data[7]) + over_night + "</br>" +  
				 "Confirmation no.: " + groundT_data[8] + "</br></br>"; 
	
	return groundT_report
}

function reportCar(car_node){
	var car_report;
    var car_data = []; 
	
	var input = car_node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			car_data.push( input[z].value.trim() ); 
    } 
	//alert(car_data)
	var start_date = moment(car_data[3])
	var end_date = moment(car_data[5])
	var number_of_days = end_date.diff(start_date, 'days');
	
	//formatting
	car_report = "Rental car </br></br>" +
				 car_data[0] + "(" + car_data[8] + " )</br>" + car_data[1] + ", " + car_data[2] + "</br>" + 
				 "Pick up: " + car_data[3] + " at " + formatTime(car_data[4]) + "</br>" + 
				 "Drop off: " + car_data[5] + " at " +  formatTime(car_data[6]) + "</br>" + 
				 "Duration: {0} days".format(number_of_days) + "</br>" + 
				 "Confirmation no.: " + car_data[7] + "</br></br>"; 
	
	return car_report
}