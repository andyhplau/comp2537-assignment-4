async function storeNewUser() {
    firstname = $('#firstname').val()
    lastname = $('#lastname').val()
    username = $('#username').val()
    email = $('#email').val()
    password = $('#password').val()
    console.log(firstname, lastname, username, email, password)
    await $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/signup/create',
        type: 'PUT',
        data: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            admin: false
        },
        success: (x) => {
            console.log(x)
        }
    })
}

function setup() {
    $('body').on('click', '#signup', storeNewUser)
}

$(document).ready(setup)