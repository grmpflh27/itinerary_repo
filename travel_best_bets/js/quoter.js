// TODO

/*
 * family totals
 */

/*
 * settings
 */

const settings = {
	DateFormat : "MMMM Do, YYYY",
	ValidSizeForIntAIR : 10,
	ValidMinSizeForRevnet : 8,
	IATA_path : "https://grmpflh27.github.io/quoter/data/airport.json"
}

const templates = {
	greeting : "Hello {0},</br></br>Thanks for your message, I'd be happy to help you book this trip!</br></br>",
	package_overview: `Our {0} includes: \
						<ul><li>round trip flights from {1} to {2}</li>\
		    				<li>{3} night{4} accommodation{4} in {5}</li>\
		    				<li>round trip transfers between airport and hotel</li></ul></br>`,
	flight : "Depart: {0} at {1}{2}, Arrive {3} at {4}{5}</br>",
	hotel_adult : `On these dates, {0}. The total price per person would be:</br>
			 Adult ({1}): \${2} + \${3} taxes and fees = \${4}</br>`,
	hotel_kid : "Children ({0}): \${1} + \${2} taxes and fees = \${3}</br>",
	ending : "Let me know what you think of these, and I'm happy to look up some more options. Thanks!",
	overnight_str : " (+{0})"
}

/*
 * signals and slots
 */

function updateDates(){
	var night_switch = document.getElementById("nights");
	var ddate = document.getElementById("ddate");
		/*ddate.onchange = function(){
			adate = document.getElementById("adate");
		adate.value = ddate.value;
		var rddate = document.getElementById("rddate");
		var tmp = moment(adate.value).add(night_switch.value, 'days')
		rddate.value = tmp.format("YYYY-MM-DD")
		radate = document.getElementById("radate");
		radate.value = rddate.value
	};*/

		night_switch.onchange = function(){
			dst_obj = document.getElementById("adate");
		ret_dep_obj = document.getElementById("rddate");
		var tmp = moment(dst_obj.value)
		tmp = tmp.add(night_switch.value, 'days')
		ret_dep_obj.value = tmp.format("YYYY-MM-DD")
		ret_arr_obj = document.getElementById("radate");
		ret_arr_obj.value = ret_dep_obj.value
	};

	var flight_conv = document.getElementById("flight_conv")
	if (flight_conv.addEventListener) {
			flight_conv.addEventListener('input', function() {
			if (!IATA_LOADED){
				loadIATAmap()
				IATA_LOADED = true
			}
			}, false);
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

/*
 * util
 */

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

/*
 * Date and Time util
 */

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

function daysBetween(start_date, end_date){
 	days = end_date.diff(start_date, 'days');
 	return days
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
var IATA_MAP = {}
var IATA_LOADED = false


function loadIATAmap(){
	$.getJSON(settings.IATA_path, function(json) {
		console.log("Loaded json.")
    	IATA_MAP = json
	});
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
 * HTML form elements
 */

// flight

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

// hotel

function addHotel(divName){
  var newdiv = document.createElement('div');
  newdiv.innerHTML = getHotelHTML();
  document.getElementById(divName).appendChild(newdiv);
  hotel_counter++;
  focusFirstInput(newdiv);
}

function getHotelHTML(){	
	var hotel_str = `<div id="div_hotel_{0}" class="hotel">
	<fieldset>
    <legend>Hotel Option {0}</legend>
		<table border=0 id="hotel_{0}">
			<tr>
				<td>Base price (adult):</td>
				<td><input type="text" size=32></td>
			</tr>
			<tr>
				<td>Taxes and fees (adult):</td>
				<td><input type="text" size=32></td>
			</tr>
			<tr class="kid_class">
				<td>Base price (child):</td>
				<td><input type="text" size=32></td>
			</tr>
			<tr class="kid_class">
				<td>Taxes and fees (child):</td>
				<td><input type="text" size=32></td>
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

 function parseIntAIRTemplate(){

 	var flight_conv = document.getElementById("flight_conv").value.split('\n')
 	var cur_year = moment().year()
 	var outbound_group = []
 	var inbound_group = []
 	var inbound = false

 	var INBOUND = "Inbound";
 	for (var i = 0; i < flight_conv.length; i++) {

 		var cur = flight_conv[i].trim()
 		cur = cur.replace(/\s\s+/g, ' ');
 		cur = cur.split(' ')
 		
		if (inbound == false && cur.indexOf(INBOUND) !== -1){
			inbound = true
		}

 		//parse it out
 		if (cur.length == settings.ValidSizeForIntAIR){
 			flight_parse_obj = {
 				orig : "{0}, {1}".format(IATA_MAP[cur[4]].city, IATA_MAP[cur[4]].county),
 				dest : "{0}, {1}".format(IATA_MAP[cur[5]].city, IATA_MAP[cur[5]].county),
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

 	//generate flight reports
 	return assembleFlightReport(outbound_group, inbound_group)
 }

 function parseRevnetTemplate(){
 	var flight_conv = document.getElementById("flight_conv").value.split('\n')
 	var inbound = false
 	var outbound_group = []
 	var inbound_group = []

 	var INBOUND = "RET:"; var OUTBOUND = "DEP:"
 	for (var i = 0; i < flight_conv.length; i++) {
 		var offset = 0;
 		var cur = flight_conv[i].trim()
 		cur = cur.replace(/\s\s+/g, ' ');
 		cur = cur.split(' ')

 		if (cur[0] == INBOUND || cur[0] == OUTBOUND ){
 			offset = 1
 		}
 		
		if (inbound == false && cur.indexOf(INBOUND) !== -1){
			inbound = true
		}

 		//parse it out
 		if (cur.length >= settings.ValidMinSizeForRevnet){

 			// NOTE: we are assuming if the landing time is > than the departing time that the flight was overnight
 			// this means that weird date-line traversals are not caught
 			var flight_over_night = moment(cur[4 + offset], "HH:mm") > moment(cur[6 + offset], "HH:mm")
 			var ref_time = moment(cur[2 + offset])

 			flight_parse_obj = {
 				orig : "{0}, {1}".format(IATA_MAP[cur[3 + offset]].city, IATA_MAP[cur[3 + offset]].county),
 				dest : "{0}, {1}".format(IATA_MAP[cur[5 + offset]].city, IATA_MAP[cur[5 + offset]].county),
 				ddate : ref_time.format(settings.DateFormat),
 				dtime : formatTime(cur[4 + offset]),
 				adate : ref_time.add(+flight_over_night, 'days').format(settings.DateFormat),
 				atime : formatTime(cur[6 + offset])
 			}

 			if (inbound){
 				inbound_group.push(flight_parse_obj)
	 		}
	 		else{
	 			outbound_group.push(flight_parse_obj)
	 		}
 		} 		
 	}

 	//generate flight reports
 	return assembleFlightReport(outbound_group, inbound_group)

 }

function assembleFlightReport(outbound_group, inbound_group){

 	flight_report = ""
 	if (outbound_group.length){
 		flight_report += generateFlightReportFromTemplate(outbound_group)
 		ORIGIN_CITY = outbound_group[0].orig
 		DEST_CITY = outbound_group[outbound_group.length - 1].dest
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

	var flight_report;

	// generate flight report from template
	var template_f = document.getElementById("flight_conv").value
	if (template_f){
		if (!template_f.startsWith("DEP")){
			flight_report = parseIntAIRTemplate();
		}
		else{
			flight_report = parseRevnetTemplate();
		}	
	}

	// get central information
	var customer = document.getElementById("customer_name").value;
	var package = document.getElementById("package").value;
	var accommodation_desc = document.getElementById("acco_desc").value;
	NO_OF_NIGHTS = document.getElementById("nights").value;
	var plural = ""
	if (NO_OF_NIGHTS > 1){
		plural = "s";
	}
	
	// hotel report
	var hotel_report = generateHotelReport()

	// stick together report parts
	var final_report = ""
	final_report += templates.greeting.format(customer)
	final_report += templates.package_overview.format(package, ORIGIN_CITY, DEST_CITY, NO_OF_NIGHTS, plural, accommodation_desc)
	final_report += flight_report;
	final_report += hotel_report
	final_report += templates.ending
	
	document.getElementById("resultArea").innerHTML = final_report;
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

function generateHotelReport(){

	var hotel_options = document.getElementsByClassName("hotel")
	var hotel_report = "";

	var number_of_adults = parseInt(document.getElementById("adults").value);
	var number_of_children = parseInt(document.getElementById("children").value);

    // iterate over hotel options
    for (var z = 0; z < hotel_options.length; z++ ) { 
		var input_nodes = hotel_options[z].getElementsByTagName("input")
		var base_price_adult = parseFloat(input_nodes[0].value)
		var taxes_adult = parseFloat(input_nodes[1].value)
		var base_price_child = parseFloat(input_nodes[2].value)
		var taxes_child = parseFloat(input_nodes[3].value)
		var hotel_description = hotel_options[z].getElementsByTagName("textarea")[0].value

		hotel_report += templates.hotel_adult.format(hotel_description, 
											   		 number_of_adults, 
											   		 base_price_adult.toFixed(2), 
											   		 taxes_adult.toFixed(2), 
											   		 (base_price_adult + taxes_adult).toFixed(2))
		if (number_of_children > 0){
			hotel_report += templates.hotel_kid.format(number_of_children, 
											   		   base_price_child.toFixed(2), 
											   		   taxes_child.toFixed(2), 
											   		   (base_price_child + taxes_child).toFixed(2))
		}
		hotel_report += "</br>"
    } 
	
	return hotel_report
}
