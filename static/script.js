setTimeout(4000);

var editableRows = document.querySelectorAll(".editable-rows");
var tableOfActiveGames = document.getElementById("table-of-active-games");
var last_game_id = null;

var createButton = document.getElementById("create-button");
var gamesButton = document.getElementById("games-button");


function sendHttpRequest(method, url, data)
{
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.setRequestHeader("Content-Type", "application/json");

	if(!data)
		xhr.send();
	else
		xhr.send(JSON.stringify(data));
}


// if 'Enter' pressed in right table, defocus
for(let i=0; i<editableRows.length; i++)
{
	editableRows[i].addEventListener("keypress", (e) => {
		if(e.key == "Enter")
			document.activeElement.blur();
	})
}

createButton.addEventListener("click", (e) => {
	// grab elements
	let name = document.getElementById("settings-name");
	let port = document.getElementById("settings-port");
	let players = document.getElementById("settings-players");

	// move game into active games
	const num_of_games = tableOfActiveGames.querySelectorAll("tr").length - 1;
	tableOfActiveGames.innerHTML += ('<tr class="left-table-row" id="'+ port.innerHTML +
								     '"><td>' + name.innerHTML +
								     '</td><td>' + port.innerHTML +
								     '</td><td>' + players.innerHTML +
								     '</td></tr>');
	last_game_id = port.innerHTML;

	// add eventListner to new row
	for(let row of document.querySelectorAll(".left-table-row"))
	{
		row.addEventListener("click", (e) => {
			let data = {
				"name": name.innerHTML,
				"port": port.innerHTML,
				"players": players.innerHTML,
			};
			sendHttpRequest("POST", "/join", data);
		})
	}

	let data = {
		"name": name.innerHTML,
		"port": port.innerHTML,
		"players": players.innerHTML,
	};
	sendHttpRequest("POST", "/create", data);
})


gamesButton.addEventListener("click", (e) => {
	sendHttpRequest("GET", "/games", null);
})
