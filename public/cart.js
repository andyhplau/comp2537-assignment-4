cartItems = []
orderIds = []

function getUserName() {
    $.ajax({
        // url: 'http://localhost:5002/userObj',
        url: 'https://arcane-forest-89383.herokuapp.com/userObj',
        type: 'GET',
        success: (userObj) => {
            $('.firstname').html(userObj.firstname)
        }
    })
}

function populateCart(items) {
    $('main').empty()
    itemArray = '<ol>'
    total = null
    for (i = 0; i < items.length; i++) {
        total += items[i].total
        itemArray += `
        <li>
            <div>
                Pokemon ID: ${items[i].pokemonId} <br>
                Pokemon Name: ${items[i].pokemonName} <br>
                Price: $ <span id="price${items[i].pokemonId}" value="${items[i].price}">${items[i].price}</span> <br>
                Quantity: <input type="number" class="quantity" id="quantity${items[i].pokemonId}" value=${items[i].quantity}> 
                <button class="update" id="${items[i].pokemonId}" value="${items[i]._id}">Update</button>
                <button class="delete" id="${items[i]._id}">Delete from cart</button>
            </div>
            <div>
                Total price: $ <span id="total${items[i].pokemonId}">${items[i].total}</span>
        </li>`
    }
    itemArray += `
        </ol> 
        <hr>
        <div id="totalPrice">
            <div>
                <button id="checkout">Checkout</button>
            </div>
            <div>
                Total: $ ${total}
            </div>
        </div>`
    $('main').html(itemArray)
    cartItems = items
}

function getCartItems() {
    $.ajax({
        // url: 'http://localhost:5002/cart/item',
        url: 'https://arcane-forest-89383.herokuapp.com/cart/item',
        type: 'GET',
        success: populateCart
    })
    return cartItems
}

function updateTotal() {
    pokemonId = $(this).attr('id')
    uniqueId = $(this).attr('value')
    newQuantity = $(`#quantity${pokemonId}`).val()
    newTotal = parseInt($(`#price${pokemonId}`).attr('value')) * newQuantity
    $.ajax({
        // url: 'http://localhost:5002/cart/update',
        url: 'https://arcane-forest-89383.herokuapp.com/cart/update',
        type: 'POST',
        data: {
            uniqueId: uniqueId,
            quantity: newQuantity,
            total: newTotal
        },
        success: populateCart
    })
}

function checkout() {
    userId = cartItems[0].userId
    time = new Date()
    $.ajax({
        // url: 'http://localhost:5002/cart/checkout',
        url: 'https://arcane-forest-89383.herokuapp.com/cart/checkout',
        type: 'POST',
        data: {
            userId: userId,
            time: time
        },
        success: (x) => {
            $('main').empty()
        }
    })
}

function removeItem() {
    itemId = $(this).attr('id')
    $.ajax({
        // url: 'http://localhost:5002/cart/remove',
        url: 'https://arcane-forest-89383.herokuapp.com/cart/remove',
        type: 'POST',
        data: {
            itemId: itemId
        },
        success: populateCart
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
        // url: 'http://localhost:5002/cart/orders',
        url: 'https://arcane-forest-89383.herokuapp.com/cart/orders',
        type: 'GET',
        success: populateOldOrders
    })
}

function setup() {
    getUserName()
    getCartItems()
    getOldOrders()
    $('body').on('click', '.update', updateTotal)
    $('body').on('click', '#checkout', checkout)
    $('body').on('click', '.delete', removeItem)
}

$(document).ready(setup)