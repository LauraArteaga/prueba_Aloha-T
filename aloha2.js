
//var collections = [];
//var google = [];

function show_accomodation(){
  $(".hotels-list p").css("color", "black");
  $(this).css("color", "#DF0174");
  var accomodation = accomodations[$(this).attr('no')];
  var address = accomodation.geoData.address;
  var lat = accomodation.geoData.latitude;
  var lon = accomodation.geoData.longitude;
  var url = accomodation.basicData.web;
  var name = accomodation.basicData.name;
  var description = accomodation.basicData.body;
  var num_imgs = accomodation.multimedia.media.length;
  var category = accomodation.extradata.categorias.categoria.item[1]['#text'];
  if(accomodation.extradata.categorias.categoria != undefined){
    var subcategory = accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text'];
  }else {
    var subcategory = 0;
  }


  var stars = "";
  var iterator;
  for (iterator = 0; iterator < subcategory[0]; iterator++) {
    stars = stars + '<img class="star" src="jquery-ui/images/estrella.jpg">'
  };
  L.marker([lat, lon]).addTo(map).bindPopup('<a href="' + url + '">' + name + '</a><br/>').openPopup();
  map.setView([lat, lon], 15);
  $("#hotel-description").html("<h2>" + name + "</h2>"
                               + stars
                               + "<h6>Tipo de alojamiento: " + category + "</h6>"
                               + "<h5 class='address'>" + address + "</h5>"
                               + description);

  $("#hotel-description").show();
  console.log("Num imgs: " + num_imgs);
  if (num_imgs > 0){
    imgs = "<div class='item active'>";
    imgs += "<img src='" + accomodation.multimedia.media[0].url + "'>";
    imgs += "</div>"
    indicators = "<li data-target='#myCarousel' data-slide-to='0' class='active'></li>";
    var iterator2;
    for (iterator2 = 1; iterator2 < num_imgs; iterator2++) {
      imgs = imgs
            + "<div class='item'>"
            + "<img src='" + accomodation.multimedia.media[iterator2].url + "'>"
            + "</div>";
            indicators = indicators + "<li data-target='#myCarousel' data-slide-to='" + iterator2 + "'></li>";
    };
    console.log("muestro carousel")
    $("#myCarousel").show();
    $(".carousel-inner").html(imgs);
    $(".carousel-indicators").html(indicators);
  }else{
    console.log("oculto carousel")
    $("#myCarousel").hide();
  }

};

function get_accomodations(){
  $.getJSON("alojamientos.json", function(data) {
    $(".update").hide();
    accomodations = data.serviceList.service
    list = "";
    for (var i = 0; i < accomodations.length; i++) {
      list = list + '<p no=' + i + '>' + accomodations[i].basicData.title + '</p>';
    }
    $(".hotels-list").html(list);
    $(".hotels-list p").draggable({
      appendTo: "body",
      helper: "clone"
    });
    $("p").click(show_accomodation);
  });
};

function get_collections(){
  var repo = $("#url").val();
  $("#accordion").show();
  $.getJSON(repo, function(data) {
    collections = data.collections
    var accor = "";
    for (var it = 0; it < collections.length; it++) {
      accor += "<h3>" + collections[it].title +"</h3>";
      accor += "<div class='ui-widget-content'>";
      accor += "<ol coll-title='" + collections[it].title +"'>";
      accor += "<p class='placeholder'>Añade tus hoteles!</p>";
      for (var it2 = 0; it2 < collections[it].hotels.length; it2++) {
        accor += "<p>" + collections[it].hotels[it2] + "</p>";
      }
      accor += "</ol>";
      accor += "</div>";
    }

    $("#accordion").html(accor);
    $("#accordion").accordion({
      heightStyle: "content"
    });

    $( "#accordion ol" ).droppable({
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      accept: ":not(.ui-sortable-helper)",
      drop: function( event, ui ) {
        $( this ).find( ".placeholder" ).remove();
        $( "<p></p>" ).text( ui.draggable.text() ).appendTo( this );
        var attr = $(this).attr("coll-title");
        for (var i = 0; i < collections.length; i++) {
          if (collections[i].title == attr){
            var numhotels = collections[i].hotels.length;
            collections[i].hotels[numhotels] = ui.draggable.text();
            break;
          }
        }
      }
    });

    $("#accordion h3").click(function(){
      var attr = $(this).attr("coll-title");
      console.log("Hotel selec: " + attr);
    });

  });
};

function create_collection() {
  var title = $("#new-col").val();
  new_collection = new Object();
  new_collection.title = title;
  new_collection.hotels = [];
  collections.push(new_collection);
  console.log("COL " + collections)
  var accor = "";
  for (var it = 0; it < collections.length; it++) {
    accor += "<h3>" + collections[it].title +"</h3>";
    accor += "<div class='ui-widget-content'>";
    accor += "<ol coll-title='" + collections[it].title +"'>";
    accor += "<p class='placeholder'>Añade tus hoteles!</p>";
    for (var it2 = 0; it2 < collections[it].hotels.length; it2++) {
      accor += "<p>" + collections[it].hotels[it2] + "</p>";
    }
    accor += "</ol>";
    accor += "</div>";
  }

  $("#accordion").html(accor);
  $("#accordion").accordion({
    heightStyle: "content"
  });

  $( "#accordion ol" ).droppable({
    activeClass: "ui-state-default",
    hoverClass: "ui-state-hover",
    accept: ":not(.ui-sortable-helper)",
    drop: function( event, ui ) {
      $( this ).find( ".placeholder" ).remove();
      $( "<p></p>" ).text( ui.draggable.text() ).appendTo( this );
      var attr = $(this).attr("coll-title");
      for (var i = 0; i < collections.length; i++) {
        if (collections[i].title == attr){
          var numhotels = collections[i].hotels.length;
          collections[i].hotels[numhotels] = ui.draggable.text();
          break;
        }
      }
    }
  });

  $("#accordion h3").click(function(){
    var attr = $(this).attr("coll-title");
    console.log("Hotel selec: " + attr);
  });

};

function getToken() {
    var token = $("#token").val();

    github = new Github({
	    token: token,
 	    auth: "oauth"
    });
    myrepo = github.getRepo("LauraArteaga", "prueba_Aloha-T");
    console.log("voy a escribir")
    writeFile();
};

function writeFile() {
    console.log("escribo")
    var info = {};
    info["collections"] = collections;
    info["google"] = "google";
    console.log("info: '" + JSON.stringify(info) + "'")
    myrepo.write('master', 'prueba2.json',
		 JSON.stringify(info),
		 "Updating data", function(err) {
		     console.log (err)
		 });
};

$(document).ready(function() {
  map = L.map('map').setView([40.4175, -3.708], 11);
  $("#tabs").tabs();
  $(".hotels").hide();
  $(".collection").hide();
  $("#hotel-description").hide();
  $("#myCarousel").hide();
  $("#accordion").hide();
  $(".github-form").hide();
  $(".new-collection").hide();
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  $(".update").click(function(){
    get_accomodations();
    get_collections();
    $(".hotels").show();
    $(".hotels").scrollTop(50);
    $(".collection").show();
    $(".collection").scrollTop(50);
    $(".github-form").show();

    $(function() {
      $( ".collection ol" ).droppable({
        activeClass: "ui-state-default",
        hoverClass: "ui-state-hover",
        accept: ":not(.ui-sortable-helper)",
        drop: function( event, ui ) {
          $( this ).find( ".placeholder" ).remove();
          $( "<p></p>" ).text( ui.draggable.text() ).appendTo( this );
        }
      });

      $("#save").click(function(){
        getToken();
      });

      $("#load").click(function(){
        get_collections();
        $(".new-collection").show();
      });
      $("#create").click(function(){
        create_collection();
      });
    });
  });


});
