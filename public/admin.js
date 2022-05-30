function loadUsers() {
    $('#users').empty()
    $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/admin/findUsers',
        type: 'GET',
        success: (users) => {
            usersArray = ''
            for (i = 0; i < users.length; i++) {
                usersArray += `<option value="${users[i]._id}">${users[i].username}</option>`
            }
            $('#users').html(usersArray)
        }
    })
}

function createNewUser() {
    firstname = $('#firstname').val()
    lastname = $('#lastname').val()
    username = $('#username').val()
    email = $('#email').val()
    password = $('#password').val()
    admin = $('#admin option:selected').val()
    $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/admin/newUser',
        type: 'POST',
        data: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            admin: admin,
            password: password
        },
        success: (res) => {
            alert(res)
            loadUsers()
        }
    })
}

function getUser() {
    user = $('#users option:selected').val()
    $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/admin/findUser',
        type: 'POST',
        data: {
            userId: user
        },
        success: (userInfo) => {
            userArray = `
            <label for="firstname">First Name:</label>
                <input type="text" id="userFirstname" value="${userInfo.firstname}">
                <br>
                <label for="lastname">Last Name:</label>
                <input type="text" id="userLastname" value="${userInfo.lastname}">
                <br>
                <label for="username">Username:</label>
                <input type="text" id="userUsername" value="${userInfo.username}">
                <br>
                <label for="email">Email:</label>
                <input type="text" id="userEmail" value="${userInfo.email}">
                <br>
                <label for="userAdmin">Is it an admin account:</label>
                <select id="userAdmin">`
            if (userInfo.admin) {
                userArray += `
                    <option value=true selected>Yes</option>
                    <option value=false>No</option>
                    `
            } else {
                userArray += `
                    <option value=true>Yes</option>
                    <option value=false selected>No</option>
                    `
            }
            userArray += `
                </select>
                <br>
                <button type="button" id="saveUser" value="${userInfo._id}">Save</button>
                <button type="button" id="deleteUser" value="${userInfo._id}">Delete User</button>`
            $('#user').html(userArray)
        }
    })
}

function saveUser() {
    userId = $(this).val()
    firstname = $('#userFirstname').val()
    lastname = $('#userLastname').val()
    username = $('#userUsername').val()
    email = $('#userEmail').val()
    admin = $('#userAdmin option:selected').val()
    $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/admin/updateUser',
        type: 'POST',
        data: {
            userId: userId,
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            admin: admin
        },
        success: (res) => {
            alert(res)
            loadUsers()
        }
    })
}

function deleteUser(){
userId=$(this).val()
$.ajax({
    url: 'https://stark-wave-78109.herokuapp.com/admin/remove',
        type: 'POST',
        data: {
            userId: userId,
        },
        success: (res) => {
            alert(res)
            $('#user').empty()
            loadUsers()
        }
})
}

function setup() {
    loadUsers()
    $('body').on('click', '#submit', createNewUser)
    $('body').on('click', '#getUser', getUser)
    $('body').on('click', '#saveUser', saveUser)
    $('body').on('click', '#deleteUser', deleteUser)
}

$(document).ready(setup)