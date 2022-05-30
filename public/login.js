async function authenticateUser() {
    username = $('#username').val()
    password = $('#password').val()
    console.log(username, password)
    await $.ajax({
        url: 'http://localhost:5002/login/authentication',
        // url: 'https://arcane-forest-89383.herokuapp.com/login/authentication',
        type: 'POST',
        data: {
            // username: username,
            // password: password
            username: 'admin',
            password: '1234'
        },
        success: (result) => {
            console.log(result)
            if(result=='admin'){
                $('#result').html('Successful login!')
                setTimeout(window.location.href = './admin', 1500)
            }else if (result == 'user') {
                $('#result').html('Successful login!')
                setTimeout(window.location.href = './profile.html', 1500)
            } else {
                $('#result').html('Login failed! Please try again')
                $('input:text').val('')
                $('input:password').val('')
            }
        }
    })
}

function setup() {
    // $('body').on('click', '#login', authenticateUser)
authenticateUser()
}

$(document).ready(setup)