//import debounce from "lodash/debounce";
import { createTeamRequest, loadTeamRequest, updateTeamRequest, deleteTeamRequest } from "./requests";
import { $, sleep, debounce } from "./utilities";

let allTeams = [];
let editId;

function readTeam() {
  return {
    promotion: document.getElementById("promotion").value,
    members: document.getElementById("members").value,
    name: document.getElementById("name").value,
    url: document.getElementById("url").value
  };
}

function writeTeam({ promotion, members, name, url }) {
  document.$("#promotion").value = promotion;
  document.$("#members").value = members;
  document.$("#name").value = name;
  document.$("#url").value = url;
}

function getTeamsHTML(teams) {
  return teams
    .map(
      ({ promotion, members, name, url, id }) =>
        `
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
      </tr>
      `
    )
    .join("");
}

let oldDisplayTeams;
function displayTeams(teams) {
  if (oldDisplayTeams === teams) {
    return;
  }
  oldDisplayTeams = teams;
  $("#teams tbody").innerHTML = getTeamsHTML(teams);
}

function loadTeams() {
  return loadTeamRequest().then(teams => {
    //window.allTeams = teams;
    allTeams = teams;
    displayTeams(teams);
    return teams;
  });
}

async function onSubmit(e) {
  e.preventDefault();
  const team = readTeam();
  let status = { succes: false };
  if (editId) {
    team.id = editId;

    status = await updateTeamRequest(team);
    if (status.success) {
      allTeams = allTeams.map(t => {
        if (t.id === team.id) {
          return {
            ...t,
            ...team
          };
        }
        return t;
      });
    }
  } else {
    status = await createTeamRequest(team);
    if (status.success) {
      team.id = status.id;
      allTeams = [...allTeams, team];
    }
  }

  if (status.succes) {
    displayTeams(allTeams);
    e.target.reset();
  }
}

function prepareEdit(id) {
  const team = allTeams.find(team => team.id === id);
  editId = id;
  writeTeam(team);
}

function searchTeams(search) {
  return allTeams.filter(team => {
    return team.promotion.indexOf(search) > -1;
  });
}

function initEvents() {
  const form = $("#editForm");
  form.addEventListener("submit", onSubmit);
  form.addEventListener("reset", () => {
    editId = undefined;
  });

  $("#search").addEventListener(
    "input",
    debounce(function (e) {
      const teams = searchTeams(e.target.value);
      displayTeams(teams);
      console.warn("search", e, this, this === e.target);
    }, 300)
  );

  $("#teams tbody").addEventListener("click", async e => {
    if (e.target.matches("a.remove-btn")) {
      const id = e.target.dataset.id;
      const status = await deleteTeamRequest(id);
      if (status.succes) {
        loadTeams();
        // TO DO => don't load all teams...
      }
    } else if (e.target.matches("a.edit-btn")) {
      const id = e.target.dataset.id;
      prepareEdit(id);
    }
  });
}
$("#editForm").classList.add("loading-mask");
loadTeams().then(async () => {
  await sleep(200);
  $("#editForm").classList.remove("loading-mask");
});

initEvents();

//TODO move in external file

// console.info("sleep");
sleep(2000).then(r => {
  // console.warn("done", r);
});

// console.warn("after sleep");

(async () => {
  // console.info("sleep2");
  var r2 = await sleep(5000);
  // console.warn("done2", r2);
})();
