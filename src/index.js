import { sleep } from "./utilities";

let allTeams = [];
let editId;

function loadTeamRequest() {
  return fetch("http://localhost:3000/teams-json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(r => r.json());
}

function createTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function updateTeamRequest(team) {
  return fetch("http://localhost:3000/teams-json/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(team)
  }).then(r => r.json());
}

function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  }).then(r => r.json());
}

function readTeam() {
  return {
    promotion: document.getElementById("promotion").value,
    members: document.getElementById("members").value,
    name: document.getElementById("name").value,
    url: document.getElementById("url").value
  };
}

function writeTeam({ promotion, members, name, url }) {
  document.getElementById("promotion").value = promotion;
  document.getElementById("members").value = members;
  document.getElementById("name").value = name;
  document.getElementById("url").value = url;
}

function getTeamsHTML(teams) {
  return teams
    .map(
      ({ promotion, members, name, url, id }) => `
      <tr>
        <td>${promotion}</td>
        <td>${members}</td>
        <td>${name}</td>
        <td>
        <a href="${url}" target="_blank">${url.replace("https://github.com/", "")}</a>
        </td>
        <td>
          <a data-id="${id}" class="remove-btn">✖️</a>
          <a data-id="${id}" class="edit-btn">&#9998;</a>
        </td>
      </tr>`
    )
    .join("");
}

let oldDisplayTeams;
function displayTeams(teams) {
  if (oldDisplayTeams === teams) {
    console.warn("same teams to display");
    return;
  }
  oldDisplayTeams = teams;
  document.querySelector("#teams tbody").innerHTML = getTeamsHTML(teams);
}

function loadTeams() {
  loadTeamRequest().then(teams => {
    //window.allTeams = teams;
    allTeams = teams;
    console.info(teams);
    displayTeams(teams);
  });
}

function onSubmit(e) {
  e.preventDefault();
  const team = readTeam();

  if (editId) {
    team.id = editId;
    updateTeamRequest(team).then(status => {
      if (status.success) {
        // load newTeams...?
        //loadTeams();
        allTeams = allTeams.map(t => {
          if (t.id === team.id) {
            console.warn("t", t, team);
            return {
              ...t,
              ...team
            };
          }
          return t;
        });

        displayTeams(allTeams);
        e.target.reset();
      }
    });
  } else {
    createTeamRequest(team).then(status => {
      if (status.success) {
        //1. "window.location.reload();" <= FARA EA? => ADAUGAM DATELE IN TABEL...
        //   1.0 adaug id in team
        team.id = status.id;
        //   1.1 add in allTeams
        //allTeams.push(team);
        allTeams = [...allTeams, team];
        //   1.2 Se va crea de x ori echipa... => Apelam displayTeams(allTeams)
        displayTeams(allTeams);
        //3. stergem datele din input...
        //writeTeam({ promotion: "", name: "", url: "", members: "" });
        e.target.reset();
      }
    });
  }
}

function removeTeamRequest(id) {
  fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });
}

function prepareEdit(id) {
  const team = allTeams.find(team => team.id === id);
  editId = id;
  writeTeam(team);
}

function initEvents() {
  const form = document.getElementById("editForm");
  form.addEventListener("submit", onSubmit);
  form.addEventListener("reset", () => {
    editId = undefined;
  });

  document.querySelector("#teams tbody").addEventListener("click", e => {
    if (e.target.matches("a.remove-btn")) {
      const id = e.target.dataset.id;
      deleteTeamRequest(id).then(status => {
        if (status.success) {
          loadTeams();
          // TO DO => don't load all teams...
        }
      });
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      prepareEdit(id);
    }
  });
}

loadTeams();
initEvents();

//TODO move in external file
console.info("sleep");
sleep(2000).then(r => {
  console.warn("done", r);
});

console.warn("after sleep");

(async () => {
  console.info("sleep2");
  var r2 = await sleep(5000);
  console.warn("done2", r2);
})();
