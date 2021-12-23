// Root URL: https://api.tvmaze.com
// Show search: http://api.tvmaze.com/search/shows?q=<search query>
// Show episode list: http://api.tvmaze.com/shows/<show id>/episodes

// Given a query string, return array of matching shows: { id, name, summary, episodesUrl }

/** Search Shows
 *   - given a search term, search for tv shows that match that query.  The function is async show it will be returning a promise.
 *   - Returns an array of objects. Each object should include following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
  // TODO: Make an ajax request to the searchShows api. Remove hard coded data.
async function searchShows(query) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  console.log(response.data) 
  //must return an ARRAY of OBJECTS -- .map() ideal 
  let allShows = response.data.map(function (each) {
    let {id, name, summary, image} = each.show;
    return {
      id,
      name,
      summary,
      image : image ? image.original : "https://tinyurl.com/tv-missing"
    }
    
    // let allShows = response.data.map(function (each) {
    //   let show = each.show;
    //   return {
    //     id : show.id,
    //     name : show.name,
    //     summary : show.summary,
    //     image : show.image
    //   }
    // })
  })

  return allShows  

  // return [
  //   {
  //     id : response.data[0].show.id,
  //     name : response.data[0].show.name,
  //     summary : response.data[0].show.summary,
  //     image : response.data.show[0].image.medium
  //   }
  // ]
}

// Populate shows list: given list of shows, add shows to DOM
function populateShows(shows) {
  const $showsList = $("#shows-list");
  // const showsList = document.querySelector('#shows-list')
  $showsList.empty();
  //removechild/children with vanilla?

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-outline-primary btn-lg">Get Episodes!</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
  $("button").on('click', async function (evt) {
    const showId = $(evt.target).closest(".card").data("show-id");
    console.log(showId);
    await getEpisodes(showId);
  })
}

// Handle search form submission: 1) hide episodes area; 2) get list of matching shows and show in shows list
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  //shows is an ARRAY of OBJECTS (w/ ID, name, summary, and image) from searchShows()
  populateShows(shows);
});

// Given a show ID, return list of episodes: { id, name, season, number }
async function getEpisodes(showId) {
  // TODO: get episodes from tvmaze. Make GET request. Return array-of-episode-info
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const response = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);
  // console.log(response.data)
  let allShowEpisodes = response.data.map(function (each) {
    return {
      id : each.id,
      name : each.name,
      season : each.season,
      number : each.number
    }
  })
  //allShowEpisodes is array of objects
  // console.log(allShowEpisodes)
  await populateEpisodes(allShowEpisodes)
  // return allShowEpisodes;  
}

async function populateEpisodes (arrOfEpisodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();
  for (let episode of arrOfEpisodes) {    
    console.log(episode);
    let $newLI = $(`<li>${episode.name} (Season ${episode.season}; Episode #${episode.number})</li>`)
    console.log($newLI)
    $episodesList.append($newLI);
  }
  $("#episodes-area").show();
}

