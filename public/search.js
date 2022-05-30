const backgroundColors = {
    grass: '#5FBD58',
    bug: '#92BC2C',
    dark: '#595761',
    dragon: '#0C69C8',
    electric: '#F2D94E',
    fairy: '#EE90E6',
    fighting: '#D3425F',
    fire: '#DC872F',
    flying: '#A1BBEC',
    ghost: '#5F6DBC',
    ground: '#DA7C4D',
    ice: '#75D0C1',
    normal: '#A0A29F',
    poison: '#B763CF',
    psychic: '#FF2CA8',
    rock: '#A38C21',
    steel: '#5695A3',
    water: '#539DDF'
}
pokemonTypes = ''
currentPage = null
numOfPages = null
resultArray = null

function getUserName() {
    $.ajax({
        url: 'http://localhost:5002/userObj',
        // url: 'https://arcane-forest-89383.herokuapp.com/userObj',
        type: 'GET',
        success: (userObj) => {
            $('#firstname').html(userObj.firstname)
        }
    })
}

function populatePokemon(data) {
    searchedPokemons += '<div class="cardContainer">'

    if (data.types.length == 1) {
        searchedPokemons += `<div class="pokemonContainer" style="background-color: ${backgroundColors[data.types[0].type.name]}">`
    } else {
        searchedPokemons += `<div class = "pokemonContainer"
        style = "background-image: linear-gradient(to bottom right, ${backgroundColors[data.types[0].type.name]}, ${backgroundColors[data.types[1].type.name]}">`
    }
    // console.log(data)
    searchedPokemons += `
    <a href="./pokemon/${data.id}">
    <h1 class="pokemonName">${data.name.toUpperCase()}</h1>
    <img src="${data.sprites.other['official-artwork'].front_default}">
    <h2 class="pokemonID">${data.id}</h2>
    <h3 class="price">$ ${data.weight}</h3>
    </a>
    <button class="addToCart" id="${data.weight}" name="${data.name}" value="${data.id}">Add to Cart</button>
    <span class="added" id="${data.id}"></span>
    </div>
    </div>
    `
}

function paginateMenu() {
    $(".pageButtons").empty()
    numOfPages = Math.ceil(resultArray.length / 9)
    $(".pageButtons").append("<button class='firstPage'>First</button>")
    $(".pageButtons").append("<button class='previousPage'>Previous</button>")
    $(".pageButtons").append("<span class='allPages'></span>")
    $(".pageButtons").append("<button class='nextPage'>Next</button>")
    $(".pageButtons").append("<button class='lastPage'>Last</button>")
    for (i = 1; i <= numOfPages; i++) {
        page = `<button class="pages" value="${i}">${i}</button>`
        $(".allPages").append(page)
    }

    $(".firstPage").click(firstPage)
    $(".previousPage").click(previousPage)
    $(".nextPage").click(nextPage)
    $(".lastPage").click(lastPage)
    pokemonsForPage(currentPage)
}


function processPokemons(data) {
    currentPage = 1
    resultArray = data.pokemon
    paginateMenu()

}

async function pokemonsForPage(pageId) {
    searchedPokemons = ''
    $("main").empty

    console.log(resultArray)

    startIndex = 9 * (pageId - 1)
    if (pageId == numOfPages) {
        stopIndex = resultArray.length - 1
    } else {
        stopIndex = 9 * (pageId - 1) + 9 - 1
    }

    for (i = startIndex; i <= stopIndex; i++) {
        // if (i % 3 == 0) {
        //     searchedPokemons += '<div class="pokemonCol">'
        // }
        await $.ajax({
            type: 'GET',
            url: resultArray[i].pokemon.url,
            success: populatePokemon
        })

        // if (i % 3 == 2) {
        //     searchedPokemons += '</div>'
        // }
    }
    $('main').html(searchedPokemons)
}

function displayPokemon(type_url) {
    $("main").empty()
    $.ajax({
        type: 'GET',
        url: type_url,
        success: processPokemons
    })
}

function processTypes(data) {
    for (i = 0; i < (data.results.length); i++) {
        pokemonTypes += `<option value="${data.results[i].url}">${data.results[i].name}</option>`
    }
    $("#pokeType").html(pokemonTypes)
}

async function populateTypes() {
    await $.ajax({
        type: 'GET',
        url: 'https://pokeapi.co/api/v2/type',
        success: processTypes
    })
    displayPokemon($("#pokeType option:selected").val())
}

async function searchById() {
    searchedPokemons = ''
    $(".pageButtons").empty()
    $("main").empty()
    id = $("#pokemonId").val()
    if ($.isNumeric(id)) {
        searchedPokemons += '<div class="pokemonCol">'
        console.log(`https://pokeapi.co/api/v2/pokemon/${id}`)
        await $.ajax({
            type: 'GET',
            url: `https://pokeapi.co/api/v2/pokemon/${id}`,
            success: populatePokemon
        })
        searchedPokemons += '</div>'
        $("main").html(searchedPokemons)
    } else {
        alert('Your input is not numeric!')
    }
}

async function searchByName() {
    searchedPokemons = ''
    $(".pageButtons").empty()
    $("main").empty()
    pokeName = $("#pokemonName").val()
    searchedPokemons += '<div class="pokemonCol">'
    console.log(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
    await $.ajax({
        type: 'GET',
        url: `https://pokeapi.co/api/v2/pokemon/${pokeName}`,
        success: populatePokemon
    })
    searchedPokemons += '</div>'
    $("main").html(searchedPokemons)
}

function pageButton() {
    page = $(this).attr("value")
    pokemonsForPage(page)
    currentPage = page
}

function firstPage() {
    currentPage = 1
    pokemonsForPage(currentPage)
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--
    }
    pokemonsForPage(currentPage)
}

function nextPage() {
    if (currentPage < numOfPages) {
        currentPage++
    }
    pokemonsForPage(currentPage)
}

function lastPage() {
    pokemonsForPage(numOfPages)
}

async function incrementLike() {
    buttonID = this.id
    await $.ajax({
        url: `http://localhost:5002/timeline/incrementHits/${buttonID}`,
        // url: `https://arcane-forest-89383.herokuapp.com/timeline/incrementHits/${buttonID}`,
        type: 'GET',
        success: (x) => {
            console.log(x)
        }
    })
    getHistory()
}

async function deleteHistory() {
    buttonID = this.id
    await $.ajax({
        url: `http://localhost:5002/timeline/delete/${buttonID}`,
        // url: `https://arcane-forest-89383.herokuapp.com/timeline/delete/${buttonID}`,
        type: 'GET',
        success: (x) => {
            console.log(x)
        }
    })
    getHistory()
}

function populateHistory(data) {
    // console.log(data)
    historyArray = ''
    $('.history').empty()
    for (i = 0; i < data.length; i++) {
        historyArray += `
        <p class='eachHistory'>
            ${data[i].text} @ ${data[i].time}
            <br>
            <button class='likeButton' id='${data[i]._id}'>Like!</button> Hits: ${data[i].hits} <button class='deleteButton' id='${data[i]._id}'>Delete history</button>
        </p>
        `
    }
    $('.history').html(historyArray)
}

function getHistory() {
    $.ajax({
        url: 'http://localhost:5002/timeline/read',
        // url: 'https://arcane-forest-89383.herokuapp.com/timeline/read',
        type: 'GET',
        success: populateHistory
    })
}

async function storeIdHistory() {
    searchedId = $('#pokemonId').val()
    currentTime = new Date()
    console.log(searchedId)
    await $.ajax({
        url: 'http://localhost:5002/timeline/insert',
        // url: 'https://arcane-forest-89383.herokuapp.com/timeline/insert',
        type: 'PUT',
        data: {
            text: `A user had searched by ID:${searchedId}`,
            time: currentTime,
            hits: 1
        },
        success: (x) => {
            console.log(x)
        }
    })
    getHistory()
}

async function storeNameHistory() {
    searchedName = $('#pokemonName').val()
    currentTime = new Date()
    await $.ajax({
        url: 'http://localhost:5002/timeline/insert',
        // url: 'https://arcane-forest-89383.herokuapp.com/timeline/insert',
        type: 'PUT',
        data: {
            text: `A user had searched by Name:${searchedName}`,
            time: currentTime,
            hits: 1
        },
        success: (x) => {
            console.log(x)
        }
    })
    getHistory()
}

async function storeHistory(type_url) {
    typeName = ''
    await $.ajax({
        url: type_url,
        type: 'GET',
        success: (typeData) => {
            typeName = typeData.name
            currentTime = new Date()
            $.ajax({
                url: 'http://localhost:5002/timeline/insert',
                // url: 'https://arcane-forest-89383.herokuapp.com/timeline/insert',
                type: 'PUT',
                data: {
                    text: `A user had searched by type:${typeName}`,
                    time: currentTime,
                    hits: 1
                },
                success: (x) => {
                    console.log(x)
                }
            })
            getHistory()
        }
    })
    getHistory()
}

async function saveToCart() {
    pokemonId = $(this).attr('value')
    pokemonName = $(this).attr('name')
    price = $(this).attr('id')
    await $.ajax({
        url: 'http://localhost:5002/cart/add',
        // url: 'https://arcane-forest-89383.herokuapp.com/cart/add',
        type: 'PUT',
        data: {
            pokemonId: pokemonId,
            pokemonName: pokemonName,
            price: price
        },
        success: (x)=>{
            console.log(x)
        }
    })
    $(`#${pokemonId}`).html('Added to Cart!')
}

function setup() {
    populateTypes()
    getHistory()
    getUserName()
    $("#idSearch").click(searchById)
    $("#nameSearch").click(searchByName)
    $("body").on("click", ".pages", pageButton)
    $("body").on("click", ".likeButton", incrementLike)
    $("body").on("click", ".deleteButton", deleteHistory)
    $("body").on("click", "#idSearch", storeIdHistory)
    $("body").on("click", "#nameSearch", storeNameHistory)
    $('body').on('click', '.addToCart', saveToCart)
    $("#pokeType").change(() => {
        displayPokemon($("#pokeType option:selected").val())
        storeHistory($("#pokeType option:selected").val())
    })
}

$(document).ready(setup)