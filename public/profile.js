orderIds=[]

function populateUser(user){
    $('.firstname').html(user.firstname)
    $('#username').html(user.username)
    $('#lastname').html(user.lastname)
    $('#email').html(user.email)
}

async function getUserId() {
    await $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/userObj',
        type: 'GET',
        success: populateUser
    })

}

function populateOldOrders(orderedItems) {
    for (i = 0; i < orderedItems.length; i++) {
        if (!orderIds.includes(orderedItems[i].orderId)) {
            orderIds.push(orderedItems[i].orderId)
        }
    }
    orderArray = '<h2>Previous Orders</h2><br>'
    for (i = 0; i < orderIds.length; i++) {
        thisOrderTotal = null
        orderArray += `
        <div class="oldOrders">
        <h3>Order placed at ${orderIds[i]}</h3>
        <ol>`

        thisOrder = orderedItems.filter((orders) => {
            return (orderIds[i] == orders.orderId)
        })
        for (j = 0; j < thisOrder.length; j++) {
            thisOrderTotal += thisOrder[j].total
            orderArray += `
            <li>
                <div>
                    Pokemon ID: ${thisOrder[j].pokemonId} <br>
                    Pokemon Name: ${thisOrder[j].pokemonName} <br>
                    Price: $ ${thisOrder[j].price} <br>
                    Quantity: ${thisOrder[j].quantity}
                </div>
                <div>
                    Total: $ ${thisOrder[j].total}
                </div>
            </li>`
        }
        orderArray += `
        </ol><hr>
        Total for this order: $ ${thisOrderTotal}
        </div>
        `
    }
    orderArray += `</ol>`
    $('article').html(orderArray)
}

function getOldOrders() {
    $.ajax({
        url: 'https://stark-wave-78109.herokuapp.com/cart/orders',
        type: 'GET',
        success: populateOldOrders
    })
}

function setup() {
    // getUserName()
    getUserId()
    getOldOrders()
}

$(document).ready(setup)