var socket = io.connect(window.location.hostname+':3000');

var markersList = Array();
function initMap() 
{	
	var mapOptions = {
					    mapTypeControl: true,
					    draggable: true,
					    scaleControl: true,
					    scrollwheel: true,
					    navigationControl: true,
					    streetViewControl: true,
					    zoom: 6,
					    center: {lat: 12, lng: 121.6140409},
					    mapTypeId: google.maps.MapTypeId.ROADMAP,
				        styles: 
				        	[
					            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
					            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
					            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
					            {
					              featureType: 'administrative.locality',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#d59563'}]
					            },
					            {
					              featureType: 'poi',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#d59563'}]
					            },
					            {
					              featureType: 'poi.park',
					              elementType: 'geometry',
					              stylers: [{color: '#263c3f'}]
					            },
					            {
					              featureType: 'poi.park',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#6b9a76'}]
					            },
					            {
					              featureType: 'road',
					              elementType: 'geometry',
					              stylers: [{color: '#38414e'}]
					            },
					            {
					              featureType: 'road',
					              elementType: 'geometry.stroke',
					              stylers: [{color: '#212a37'}]
					            },
					            {
					              featureType: 'road',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#9ca5b3'}]
					            },
					            {
					              featureType: 'road.highway',
					              elementType: 'geometry',
					              stylers: [{color: '#746855'}]
					            },
					            {
					              featureType: 'road.highway',
					              elementType: 'geometry.stroke',
					              stylers: [{color: '#1f2835'}]
					            },
					            {
					              featureType: 'road.highway',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#f3d19c'}]
					            },
					            {
					              featureType: 'transit',
					              elementType: 'geometry',
					              stylers: [{color: '#2f3948'}]
					            },
					            {
					              featureType: 'transit.station',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#d59563'}]
					            },
					            {
					              featureType: 'water',
					              elementType: 'geometry',
					              stylers: [{color: '#17263c'}]
					            },
					            {
					              featureType: 'water',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#515c6d'}]
					            },
					            {
					              featureType: 'water',
					              elementType: 'labels.text.stroke',
					              stylers: [{color: '#17263c'}]
					            }
					        ]
					};

				  	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
					$.post("getDataMap", {get_coordinates:'true'}, function(z){
						var data = jQuery.parseJSON(z);
						var i = 0;
						$.each(data, function(key, val){
							var myLatlng = new google.maps.LatLng(this.LATITUDE, this.LONGITUDE);
						    var marker = new google.maps.Marker({
							    position: myLatlng,
							    map: map,
							    title: data.title
						    });

						    var infowindow = new google.maps.InfoWindow({
						      	content: "<div style = 'width:200px;min-height:40px'>" + this.CRIMINAL_ID + "</div>"
						    });

						    marker.infobox = infowindow;
						    markersList.push(marker);

						    //Attach click event to the marker.
						    google.maps.event.addListener(marker, 'click', (function(marker, i) {
						      	return function() 
						      	{
							        console.log(i);
							        // Close all other infoboxes
							        for (var j = 0; j < markersList.length; j++)
							        {
							          markersList[j].infobox.close(map);
							        }
							        // Open correct info box
							        markersList[i].infobox.open(map, markersList[i]);
							    }
						    })(marker, i));
						    i++;
						});
						var markerCluster = new MarkerClusterer(map, markersList, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
					});

	///socket. Real time data processing
	socket.on('get_data', function(datax){ //fires data to clients
		var markersList = Array();
		var mapOptions = {
					    mapTypeControl: true,
					    draggable: true,
					    scaleControl: true,
					    scrollwheel: true,
					    navigationControl: true,
					    streetViewControl: true,
					    zoom: 6,
					    center: {lat: 12, lng: 121.6140409},
					    mapTypeId: google.maps.MapTypeId.ROADMAP,
				        styles: 
				        	[
					            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
					            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
					            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
					            {
					              featureType: 'administrative.locality',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#d59563'}]
					            },
					            {
					              featureType: 'poi',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#d59563'}]
					            },
					            {
					              featureType: 'poi.park',
					              elementType: 'geometry',
					              stylers: [{color: '#263c3f'}]
					            },
					            {
					              featureType: 'poi.park',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#6b9a76'}]
					            },
					            {
					              featureType: 'road',
					              elementType: 'geometry',
					              stylers: [{color: '#38414e'}]
					            },
					            {
					              featureType: 'road',
					              elementType: 'geometry.stroke',
					              stylers: [{color: '#212a37'}]
					            },
					            {
					              featureType: 'road',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#9ca5b3'}]
					            },
					            {
					              featureType: 'road.highway',
					              elementType: 'geometry',
					              stylers: [{color: '#746855'}]
					            },
					            {
					              featureType: 'road.highway',
					              elementType: 'geometry.stroke',
					              stylers: [{color: '#1f2835'}]
					            },
					            {
					              featureType: 'road.highway',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#f3d19c'}]
					            },
					            {
					              featureType: 'transit',
					              elementType: 'geometry',
					              stylers: [{color: '#2f3948'}]
					            },
					            {
					              featureType: 'transit.station',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#d59563'}]
					            },
					            {
					              featureType: 'water',
					              elementType: 'geometry',
					              stylers: [{color: '#17263c'}]
					            },
					            {
					              featureType: 'water',
					              elementType: 'labels.text.fill',
					              stylers: [{color: '#515c6d'}]
					            },
					            {
					              featureType: 'water',
					              elementType: 'labels.text.stroke',
					              stylers: [{color: '#17263c'}]
					            }
					        ]
					};

				  	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
					$.post("getDataMap", {get_coordinates:'true'}, function(z){
						var data = jQuery.parseJSON(z);
						var i = 0;
						$.each(data, function(key, val){
							var myLatlng = new google.maps.LatLng(this.LATITUDE, this.LONGITUDE);
						    var marker = new google.maps.Marker({
							    position: myLatlng,
							    map: map,
							    title: data.title
						    });

						    var infowindow = new google.maps.InfoWindow({
						      	content: "<div style = 'width:200px;min-height:40px'>" + this.CRIMINAL_ID + "</div>"
						    });

						    marker.infobox = infowindow;
						    markersList.push(marker);

						    //Attach click event to the marker.
						    google.maps.event.addListener(marker, 'click', (function(marker, i) {
						      	return function() 
						      	{
							        console.log(i);
							        // Close all other infoboxes
							        for (var j = 0; j < markersList.length; j++)
							        {
							          markersList[j].infobox.close(map);
							        }
							        // Open correct info box
							        markersList[i].infobox.open(map, markersList[i]);
							    }
						    })(marker, i));
						    i++;
						});
						var markerCluster = new MarkerClusterer(map, markersList, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
					});
	});
}


	// Open all on page load
	// for (var j = 0; j < markersList.length; j++) 
	// {
	//     // markersList[j].infobox.open(map, markersList[j]);
	// }