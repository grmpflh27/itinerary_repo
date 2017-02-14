/*
 * settings
 */

const settings = {
	DateFormat : "MMMM Do, YYYY",
	ValidSizeForFlight : 10,
}

const templates = {
	greeting : "Hello {0},</br></br>Thanks for your message, I'd be happy to help you book this trip!</br></br>",
	package_overview: `Our {0} includes: \
						<ul><li>round trip flights from {1} to {2}</li>\
		    				<li>{3} accommodation{4} in {5}</li>\
		    				<li>round trip transfers between airport and hotel</li></ul></br>`,
	flight : "Depart: {0} at {1}{2}, Arrive {3} at {4}{5}</br>",
	hotel : `On these dates, {0}. The total price per person would be:</br>
			 Adult ({1}): \${2} + \${3} taxes and fees = \${4}</br>`,
	hotel_kid : "Children ({1}): \${2} + \${3} taxes and fees = \${4}</br>",
	ending : "Let me know what you think of these, and I'm happy to look up some more options. Thanks!",
	overnight_str : " (+{0}) "
}

//////////////
// util
//////////////

//format utility
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match;
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
    } 
    else {
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

function focusFirstInput(newdiv){
	var inputs = newdiv.getElementsByTagName( 'input' );
	inputs[0].focus();
	inputs[0].select();
}

function removeElement(divName, class_str){
	document.getElementById(divName).remove()
	if (class_str == 'flight'){
		flight_counter--;
	}
	else if(class_str == 'hotel'){
		hotel_counter--;
	}
}

/*
 * business logic
 */

var flight_counter = 1;
var hotel_counter = 1;

//globals
var NO_OF_NIGHTS = 0;
var ORIGIN_CITY = "";
var DEST_CITY = "";
var NO_ADULTS = 0;
var IATA_MAP = {}

function loadIATAmap(){
	$.getJSON("../data/airport.json", function(json) {
    	console.log(json); 
    	IATA_MAP = json
	});
}

function updateDates(){
	var night_switch = document.getElementById("nights");
	var ddate = document.getElementById("ddate");
 	ddate.onchange = function(){
 		adate = document.getElementById("adate");
		adate.value = ddate.value;
		var rddate = document.getElementById("rddate");
		var tmp = moment(adate.value).add(night_switch.value, 'days')
		rddate.value = tmp.format("YYYY-MM-DD")
		radate = document.getElementById("radate");
		radate.value = rddate.value
	};

 	night_switch.onchange = function(){
 		dst_obj = document.getElementById("adate");
		ret_dep_obj = document.getElementById("rddate");
		var tmp = moment(dst_obj.value)
		tmp = tmp.add(night_switch.value, 'days')
		ret_dep_obj.value = tmp.format("YYYY-MM-DD")
		ret_arr_obj = document.getElementById("radate");
		ret_arr_obj.value = ret_dep_obj.value
	};
}

function checkKids(){
	var kids = document.getElementById("children")
	kids.onchange = function(){
		kid_elements = document.getElementsByClassName("kid_class")
		console.log("!!! {0}".format(kid_elements.length))
		if(kids.value){
			for(var i; i < kid_elements.length; i++){
				kid_elements[i].style.visibility = "visible"
			}
		}
		else{
			for(var i; i < kid_elements.length; i++){
				kid_elements[i].style.visibility = "hidden"
			}
		}
	}
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
	}
	return date;
}

 function daysBetween(start_date, end_date){
 	days = end_date.diff(start_date, 'days');
 	return days
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
	}
	return time;
}

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
  	focusFirstInput(newdiv);
	flight_counter++;
}

function getFlightHTML(){

	NO_OF_NIGHTS = document.getElementById("nights").value;

	var flight_str = `<div id="div_flight_{0}">
	<fieldset>
    <legend>Flight</legend>
		<table border=0 id="flight_{0}">
			<tr>
				<td>Departure city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Departure date:</td>
				<td><input type="date" id="ddate" value={1}></td>
			</tr>
			<tr>
				<td>Departure time:</td>
				<td><input type=time step="300" id="dtime" value={2}></td>
			</tr>
			<tr>
				<td>Arrival city:</td>
				<td><input type="text"></td>
			</tr>
			<tr>
				<td>Arrival date:</td>
				<td><input type="date" id="adate" value={1}></td>
			</tr>
			<tr>
				<td>Arrival time:</td>
				<td> <input type="time" step="300" id="atime" value={2}></td>
			</tr>
			<tr>
				<td><b>Return flight</td>
			</tr>
			<tr>
				<td>Departure date:</td>
				<td><input type="date" id="rddate" value={3}></td>
			</tr>
			<tr>
				<td>Departure time:</td>
				<td><input type=time step="300" id="rdtime" value={2}></td>
			</tr>
			<tr>
				<td>Arrival date:</td>
				<td><input type="date" id="radate" value={3}></td>
			</tr>
			<tr>
				<td>Arrival time:</td>
				<td><input type="time" step="300" id="ratime" value={2}></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove flight" onClick="removeElement(document.getElementById('div_flight_{0}').id, 'flight')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(flight_counter, moment().format("YYYY-MM-DD"), "12:00", moment().add(NO_OF_NIGHTS, 'days').format("YYYY-MM-DD"))
	
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
	var hotel_str = `<div id="div_hotel_{0}">
	<fieldset>
    <legend>Hotel Option {0}</legend>
		<table border=0 id="hotel_{0}">
			<tr>
				<td>Base price (adult):</td>
				<td><input type="text" size=32></td>
			</tr>
			<tr>
				<td>Taxes and fees (adult):</td>
				<td><input type="text" id="taxes" size=32></td>
			</tr>
			<tr class="kid_class">
				<td>Base price (child):</td>
				<td><input type="text" size=32></td>
			</tr>
			<tr class="kid_class">
				<td>Taxes and fees (child):</td>
				<td><input type="text" id="taxes_kid" size=32></td>
			</tr>
			<tr>
				<td>Hotel description:</td>
				<td><textarea rows=4 cols=30></textarea></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td><input type="button" value="Remove hotel" onClick="removeElement(document.getElementById('div_hotel_{0}').id, 'hotel')"</td>
			</tr>
		</table>
	</fieldset>
	`.format(hotel_counter)
	
	return hotel_str
}


/*
 * report generation
 */

 function parseTemplate(){

 	var flight_conv = document.getElementById("flight_conv").value.split('\n')
 	var cur_year = moment().year()
 	var inbound = false
 	var outbound_group = []; var inbound_group = []

 	var INBOUND = "Inbound";
 	for (var i = 0; i < flight_conv.length; i++) {

 		var cur = flight_conv[i].trim()
 		cur = cur.replace(/\s\s+/g, ' ');
 		cur = cur.split(' ')
 		
		if (inbound == false && cur.indexOf(INBOUND) !== -1){
			inbound = true
		}

 		//parse it out
 		if (cur.length == settings.ValidSizeForFlight){
 			flight_parse_obj = {
 				orig : cur[4],
 				dest : cur[5],
 				ddate : moment(cur[3].concat(cur_year)).format(settings.DateFormat),
 				dtime : formatTime(cur[6]),
 				adate : moment(cur[8].concat(cur_year)).format(settings.DateFormat),
 				atime : formatTime(cur[7])
 			}

 			if (inbound){
 				inbound_group.push(flight_parse_obj)
	 		}
	 		else{
	 			outbound_group.push(flight_parse_obj)
	 		}
 		}
 		
 	}

 	//generate flight reports:
 	flight_report = ""
 	if (outbound_group.length){
 		flight_report += generateFlightReportFromTemplate(outbound_group)
 	}
 	if (inbound_group.length){
 		flight_report += generateFlightReportFromTemplate(inbound_group)
 	}
	return flight_report
 }

 function generateFlightReportFromTemplate(flight_items){

 	var flight_str = ""
 	var over_night = ""
 	var dep_over_night = ""
 	var start_date = moment(flight_items[0].ddate, settings.DateFormat)
 	flight_str += "{0}</br>".format(flight_items[0].ddate)

 	for (var i = 0; i < flight_items.length; i++) {
 		var cur = flight_items[i]
		var diff_days = daysBetween(start_date, moment(cur.adate, settings.DateFormat))
		if(diff_days){
			over_night = templates.overnight_str.format(diff_days);
		}
		if (i != 0){
			var d_diff_days = daysBetween(start_date, moment(cur.ddate, settings.DateFormat))
			if(diff_days){
				dep_over_night = templates.overnight_str.format(d_diff_days);
			}
		}

 		flight_str += templates.flight.format(cur.orig, cur.dtime, dep_over_night, cur.dest, cur.atime, over_night)
	}
	flight_str += "</br>"
	return flight_str
 }

function generateReport(){

	//flight report from template
	var right_order_txt;

	if (document.getElementById("flight_conv").value){
		right_order_txt = parseTemplate();
	}

	// init
	var customer = document.getElementById("customer_name").value;
	var package = document.getElementById("package").value;
	var accommodation_desc = document.getElementById("acco_desc").value;
	NO_ADULTS = document.getElementById("adults").value;
	NO_OF_NIGHTS = document.getElementById("nights").value;
	var plural = ""
	if (NO_OF_NIGHTS > 1){
		plural = "s";
	}
	
	// gather elements
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
	
	// re-order each date_group
	for(prop in date_groups){
		if(date_groups[prop].length > 1){
			date_groups[prop] = sortGroupByCategory(date_groups[prop]);
		}
	}
	
	// assemble output in right order
	for(prop in date_groups){
		for(var i=0; i < date_groups[prop].length; i++){
			right_order_txt = right_order_txt + date_groups[prop][i].content + "</br>";
		}
	}

	// stick together report parts
	var report = ""
	report += templates.greeting.format(customer)
	report += templates.package_overview.format(package, ORIGIN_CITY, DEST_CITY, NO_OF_NIGHTS, plural, accommodation_desc)
	report += right_order_txt;
	report += templates.ending
	
	document.getElementById("resultArea").innerHTML = report;
}

function reportFlight(flight_node){
	var flight_report;
    var flight_data = []; 
	
	var input = flight_node.getElementsByTagName("input"); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			flight_data.push( input[z].value.trim() ); 
    } 
	var start_date = moment(flight_data[1])
	var end_date = moment(flight_data[4])
	var over_night = ""
	var diff_days = daysBetween(start_date, end_date);
	if(diff_days){
		over_night = templates.overnight_str.format(diff_days);
	}

	//return
	var ret_start_date = moment(flight_data[6])
	var ret_end_date = moment(flight_data[8])
	var ret_over_night = ""
	diff_days = daysBetween(ret_start_date, ret_end_date)
	if(diff_days){
		ret_over_night = templates.overnight_str.format(diff_days);
	}
	
	//formatting
	//<DAY 1>
	//Depart: <ORIGIN CITY> at <TIME 1>	Arrive: <DESTINATION CITY> at <TIME 2>
	flight_report = moment(flight_data[1]).format(settings.DateFormat) + "</br>" +
					"Depart: " + flight_data[0] + " at " + formatTime(flight_data[2]) + ", " +
					"Arrive: " + flight_data[3] + " at " + formatTime(flight_data[5]) + over_night + "</br></br>" +
					moment(flight_data[6]).format(settings.DateFormat) + "</br>" +
					"Depart: " + flight_data[3] + " at " + formatTime(flight_data[7]) + ", " +
					"Arrive: " + flight_data[0] + " at " + formatTime(document.getElementById("ratime").value) + ret_over_night + "</br>";

	ORIGIN_CITY = flight_data[0];
	DEST_CITY = flight_data[3];
	return flight_report;
}

function reportHotel(hotel_node){
	var hotel_report;
    var hotel_data = []; 
	
	var input = hotel_node.getElementsByTagName( 'input' ); 
    for ( var z = 0; z < input.length; z++ ) { 
		if(z != input.length-1)
			hotel_data.push( input[z].value.trim() ); 
    } 
	
	var start_date = moment(hotel_data[4])
	var end_date = moment(hotel_data[5])
	var number_of_nights = end_date.diff(start_date, 'days');
	
	//formatting
	var base_price = parseFloat(hotel_data[1])
	var taxes = parseFloat(document.getElementById("taxes").value)

	hotel_report = templates.hotel.format(hotel_data[0], NO_ADULTS, base_price.toFixed(2), taxes.toFixed(2), (base_price + taxes).toFixed(2))

	return hotel_report
}