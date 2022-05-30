firstCard = undefined
secondCard = undefined
lockBoard = false
firstCardflipped = false
matchCount = 0
timeLength = 0
record = ''

function loadResult(data) {
    for (i = 0; i < data.length; i++) {
        record += `
        <p> You ${data[i].result} a game at ${data[i].time} </p>
        `
    }
    $('#gameRecord').html(record)
}

function getResult() {
    record=''
    $('#gameRecord').empty()
    $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/game/record',
        type: 'GET',
        success: loadResult
    })
}

function gameSetup() {
    pair = ''
    row = ''
    column = ''
    for (i = 2; i <= 26; i++) {
        pair += `<option value=${i}>${i}</option>`
    }

    for (i = 2; i <= 7; i++) {
        row += `<option value=${i}>${i}</option>`
        column += `<option value=${i}>${i}</option>`
    }

    $('#cardNumber').html(pair)
    $('#row').html(row)
    $('#column').html(column)
}

function generateGameGrid() {
    pairArray = []
    cardArray = ''
    gamePair = $('#cardNumber option:selected').val()
    gameRow = $('#row option:selected').val()
    gameColumn = $('#column option:selected').val()
    difficulty = $('#level option:selected').val()
    gameWidth = gameColumn * (202 + 10) - 10
    gameHeight = gameRow * (302 + 10) - 10
    $('#gameGrid').css('width', gameWidth)
    $('#gameGrid').css('height', gameHeight)

    if (difficulty == 'easy') {
        timeLength = 180000
    } else if (difficulty == 'medium') {
        timeLength = 120000
    } else {
        timeLength = 60000
    }
    timmer = 0

    if (gamePair < gameRow * gameColumn / 2) {
        for (i = 1; i <= gamePair; i++) {
            pairArray.push(i)
            pairArray.push(i)
        }
        for (i = 1; i <= ((gameRow * gameColumn / 2) - gamePair); i++) {
            pairArray.push(i)
            pairArray.push(i)
        }
    } else {
        for (i = 1; i <= (gameRow * gameColumn / 2); i++) {
            pairArray.push(i)
            pairArray.push(i)
        }
    }

    console.log(pairArray)
    arrayLength = pairArray.length
    winCount = arrayLength / 2
    for (i = 1; i <= arrayLength; i++) {
        index = Math.floor(Math.random() * pairArray.length)
        pokemonId = pairArray[index]
        pairArray.splice(index, 1)
        cardArray += `
        <div class="card">
            <img id="card${i}" class="frontSide" src="./images/${pokemonId}.png">
            <img class="backSide" src="./images/backside.jpeg">
        </div>
        `
    }
    $('#gameGrid').html(cardArray)
    $('.card').on('click', flipCard)
    $('#timeTitle').html('Timmer:')



    timeTheGame = setInterval(function () {
        timmer += 1000
        $('#timmer').html(timmer / 1000 + 's / ' + timeLength / 1000 + 's')
        if (matchCount == winCount) {
            clearInterval(timeTheGame)
            alert('You Win!')
            $.ajax({
                url: 'https://stark-wave-78109.herokuapp.com/game/result',
                type: 'POST',
                data: {
                    result: 'win',
                    time: new Date()
                },
                success: (res) => {
                    console.log(res)
                    getResult()
                }
            })
        } else if (timmer == timeLength) {
            clearInterval(timeTheGame)
            alert('Time is up. You Lose!')
            $.ajax({
                url: 'https://stark-wave-78109.herokuapp.com/game/result',
                type: 'POST',
                data: {
                    result: 'lose',
                    time: new Date()
                },
                success: (res) => {
                    console.log(res)
                    getResult()
                }
            })
        }
    }, 1000)

}

function flipCard() {
    if (lockBoard) {
        return
    }
    $(this).toggleClass('flip')

    if (!firstCardflipped) {
        firstCard = $(this).find('.frontSide')[0]
        console.log(firstCard)
        firstCardflipped = true
    } else {
        secondCard = $(this).find('.frontSide')[0]
        console.log(secondCard)
        firstCardflipped = false
        lockBoard = true

        if ($(`#${firstCard.id}`).attr('src') == $(`#${secondCard.id}`).attr('src')) {
            console.log('A match')
            setTimeout(() => {
                $(`#${firstCard.id}`).parent().off('click')
                $(`#${secondCard.id}`).parent().off('click')
                lockBoard = false
                matchCount += 1
            }, 2000)
        } else {
            console.log('Not a match')
            setTimeout(() => {
                $(`#${firstCard.id}`).parent().removeClass('flip')
                $(`#${secondCard.id}`).parent().removeClass('flip')
                lockBoard = false
            }, 1000)
        }
    }
}

function setup() {
    gameSetup()
    getResult()
    $('body').on('click', '#submit', generateGameGrid)
}

$(document).ready(setup)