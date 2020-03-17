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


for(let i=0; i<editableRows.length; i++)
{
	editableRows[i].addEventListener("keypress", (e) => {
		if(e.key == "Enter")
			document.activeElement.blur();
	})
}

createButton.addEventListener("click", (e) => {
	// grab settings
	let name = document.getElementById("settings-name").innerHTML;
	let port = document.getElementById("settings-port").innerHTML;
	let players = document.getElementById("settings-players").innerHTML;

	// validate port
	if(isNaN(Number(port)) || port.includes('.'))
	{
		console.log(">> ValidationError: 'Port' MUST be an int");
		return;
	}

	// validate players
	if(isNaN(Number(players)) || players.includes('.'))
	{
		console.log(">> ValidationError: 'Players' MUST be an int");
		return;
	}

	// move game into active games
	const num_of_games = tableOfActiveGames.querySelectorAll("tr").length - 1;
	tableOfActiveGames.innerHTML += ('<tr class="left-table-row" id="'+ port.innerHTML +
								     '"><td>' + name +
								     '</td><td>' + port +
								     '</td><td>' + players +
								     '</td></tr>');
	last_game_id = port;

	// click a game-row to JOIN
	for(let row of document.querySelectorAll(".left-table-row"))
	{
		row.addEventListener("click", (e) => {
			let data = {
				"name": row.cells[0].textContent,
				"port": row.cells[1].textContent,
				"players": row.cells[2].textContent,
			};
			sendHttpRequest("POST", "/join", data);
		})
	}

	let data = {
		"name": name,
		"port": port,
		"players": players,
	};
	sendHttpRequest("POST", "/create", data);
})


gamesButton.addEventListener("click", (e) => {
	sendHttpRequest("GET", "/games", null);
})
