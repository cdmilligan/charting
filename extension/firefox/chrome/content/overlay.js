var charting = {
  loadGoals: function() {
    var url = "http://localhost:3000/goals.json";
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200) {
          charting.removeGoalMenuItems();

          var goalsString = request.responseText;
          var goalsJSON = JSON.parse(goalsString);
          var goalsOut = [];
          for (var i in goalsJSON) {
            goalsOut[i] = goalsJSON[i].goal.name;
          }
          charting.goals = goalsOut;
          
          charting.addGoalMenuItems();
        }
        else {
          alert("Error: Couldn't connect to charting server.");
        }
      }
    }

    request.send(null);
  },

  addGoalMenuItems: function() {
    var context_menu = document.getElementById("contentAreaContextMenu");
    var charting_end = document.getElementById("charting-end");
    for (goal in charting.goals) {
      var menu_item = createGoalMenuItem(goal, charting.goals[goal]);
      context_menu.insertBefore(menu_item, charting_end);
    }
  },

  removeGoalMenuItems: function() {
    for (i in this.goals) {
      var menuItem = document.getElementById('goal-menu-item' + i);
      menuItem.parentNode.removeChild(menuItem);
    }
  },

  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("charting-strings");
  },

  note: function(goalIndex) {
    var selection = escape(content.window.getSelection());
    var source_url = escape(content.window.location.toString());
    var source_title = escape(content.document.title);

    var params= "note[body]=" + selection +
                "&note[goals][]=" + escape(charting.goals[goalIndex]) +
                "&source[location]=" + source_url +
                "&source[title]=" + source_title +
                "&source[doctype]=webpage";

    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/notes.json", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", params.length);

    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 201) {
          alert("Created note for " + charting.goals[goalIndex]);
        }
        else {
          alert("Failed to create note.");
        }
      }
    }

    request.send(params);
  },

  onToolbarOptionsButtonCommand: function(e) {
    alert("Options!");
  },

  onToolbarNoteButtonCommand: function(e) {
    charting.noteWindow = window.open("chrome://charting/content/note-window.xul", "note-window", "chrome");
    charting.noteWindow.addEventListener("load", charting.onLoadNoteWindow, false);
  },

  onLoadNoteWindow: function(e) {
    charting.noteWindow.document.getElementById('page-url').value=content.window.location.toString();
    charting.noteWindow.document.getElementById('page-title').value=content.document.title;
    charting.noteWindow.document.getElementById('page-description').value=content.window.getSelection().toString();

    //Add buttons for each goal.
    var buttons = charting.noteWindow.document.getElementById("charting-goal-buttons");
    for (i in charting.goals) {
      var button = createGoalButton(i, charting.goals[i]);
      buttons.appendChild(button);
    }

    charting.noteWindow.document.getElementById('save-button').addEventListener('command', charting.noteFromWindow, false);
  },

  noteFromWindow: function(e) {
    var selectedGoals = [];
    
    var body = escape(charting.noteWindow.document.getElementById('page-description').value);
    var source_url = escape(charting.noteWindow.document.getElementById('page-url').value);
    var source_title = escape(charting.noteWindow.document.getElementById('page-title').value);

    var params= "note[body]=" + body +
                "&source[location]=" + source_url +
                "&source[title]=" + source_title +
                "&source[doctype]=webpage";

    for (var i in charting.goals) {
      var button = charting.noteWindow.document.getElementById('goal-button-' + i);
      if (button.getAttribute('checked')) {
        params += "&note[goals][]=" + charting.goals[i];
      }
    }
    alert(params);

    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/notes.json", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", params.length);

    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 201) {
          alert("Created note.");
        }
        else {
          alert("Failed to create note.");
        }
      }
    }

    request.send(params);
  }
  
};

window.addEventListener("load", charting.onLoad, false);
