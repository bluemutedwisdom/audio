// Generated by CoffeeScript 1.6.1
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jQuery(function($) {
    var beatInterval, bpm, callback, createMarker, init, markers, matrix, steps, target, width;
    target = new google.maps.LatLng(59.33, 18.07);
    markers = [];
    matrix = [];
    steps = 16;
    width = 400;
    bpm = 120;
    beatInterval = 1 / (bpm / 60) * 1000;
    init = function() {
      var AudioPlayer, clearMatrix, context, currentStep, event, getCellPosition, i, j, map, mapOptions, marker, overlay, request, row, service, turnOnCell, _i, _j, _k, _len, _ref, _ref1, _ref2;
      $('#showOverlay').click(function() {
        if (this.checked) {
          return $('#overlay').fadeIn();
        } else {
          return $('#overlay').fadeOut();
        }
      });
      mapOptions = {
        center: target,
        zoom: 14,
        streetViewControl: false,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
      };
      map = window.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: mapOptions.center,
        icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png'
      });
      request = {
        location: target,
        radius: 400
      };
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
      overlay = new google.maps.OverlayView();
      overlay.draw = function() {};
      overlay.setMap(map);
      for (i = _i = 0, _ref = steps - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        row = document.createElement('tr');
        $('#matrix').prepend(row);
        for (j = _j = 0, _ref1 = steps - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          row.appendChild(document.createElement('td'));
        }
      }
      getCellPosition = function(x, y) {
        var col;
        row = Math.floor(x / width * steps);
        col = Math.floor(y / width * steps);
        return [row, col];
      };
      clearMatrix = function() {
        matrix = [];
        return $('table td').removeClass('on');
      };
      turnOnCell = function(row, col) {
        var cell;
        matrix[row] || (matrix[row] = []);
        if (__indexOf.call(matrix[row], col) < 0) {
          matrix[row].push(col);
        }
        cell = $('#matrix')[0].rows[row].cells[col];
        return $(cell).addClass('on');
      };
      window.updateMatrix = function() {
        var col, p, pos, proj, _k, _len, _ref2;
        clearMatrix();
        proj = overlay.getProjection();
        for (_k = 0, _len = markers.length; _k < _len; _k++) {
          marker = markers[_k];
          pos = marker.getPosition();
          p = proj.fromLatLngToContainerPixel(pos);
          _ref2 = getCellPosition(p.y, p.x), row = _ref2[0], col = _ref2[1];
          if (row >= 0 && row < steps && col >= 0 && col < steps) {
            turnOnCell(row, col);
          }
        }
        return matrix;
      };
      _ref2 = ['bounds_changed'];
      for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
        event = _ref2[_k];
        google.maps.event.addListener(map, event, function() {
          return updateMatrix();
        });
      }
      currentStep = 0;
      setInterval(function() {
        var activeCells, cell, _l, _len1;
        currentStep++;
        $('#matrix td').removeClass('active');
        $($('#matrix')[0].rows).find("td:nth-child(" + currentStep + ").on").addClass('active');
        if (activeCells = matrix[currentStep]) {
          for (_l = 0, _len1 = activeCells.length; _l < _len1; _l++) {
            cell = activeCells[_l];
            this.audioPlayer.play(cell);
          }
        }
        if (currentStep >= steps) {
          return currentStep = 0;
        }
      }, beatInterval * 0.25);
      context = new webkitAudioContext();
      AudioPlayer = (function() {

        function AudioPlayer() {
          var bufferLoader, paths, _l,
            _this = this;
          paths = [];
          for (i = _l = 1; _l <= 16; i = ++_l) {
            paths.push("samples/bell" + i + ".wav");
          }
          bufferLoader = new BufferLoader(context, paths, function(bufferList) {
            _this.bufferList = bufferList;
          });
          bufferLoader.load();
        }

        AudioPlayer.prototype.play = function(index) {
          var note;
          note = context.createBufferSource();
          note.buffer = this.bufferList[index];
          note.connect(context.destination);
          return note.noteOn(0);
        };

        return AudioPlayer;

      })();
      return this.audioPlayer = window.audioPlayer = new AudioPlayer;
    };
    callback = function(results, status) {
      var attrs, index;
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (index in results) {
          attrs = results[index];
          createMarker(results[index]);
        }
      }
      return updateMatrix();
    };
    createMarker = function(place) {
      var marker;
      marker = new google.maps.Marker({
        map: map,
        title: place.types.join('-'),
        position: place.geometry.location
      });
      return markers.push(marker);
    };
    return init();
  });

}).call(this);