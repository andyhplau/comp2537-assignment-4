async function authenticateUser() {
    username = $('#username').val()
    password = $('#password').val()
    console.log(username, password)
    await $.ajax({
        // url: 'http://localhost:5002/login/authentication',
        url: 'https://arcane-forest-89383.herokuapp.com/login/authentication',
        type: 'POST',
        data: {
            username: username,
            password: password
            // username: 'andy',
            // password: '1234'
        },
        success: (result) => {
            console.log(result)
            if (result == 'success') {
                $('#result').html('Successful login!')
                setTimeout(window.location.href = './profile.html', 1500)
                // setTimeout(window.location.href = './index.html', 1500)
            } else {
                $('#result').html('Login failed! Please try again')
                $('input:text').val('')
                $('input:password').val('')
            }
        }
    })
}

function setup() {
    $('body').on('click', '#login', authenticateUser)
    // authenticateUser()
}

$(document).ready(setup)