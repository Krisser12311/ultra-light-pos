var barsketItems = {};
var barsketTotaltAmount = 0;

function updateTime() {
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0'); 
    let minutes = now.getMinutes().toString().padStart(2, '0'); 
    let seconds = now.getSeconds().toString().padStart(2, '0'); 

    let timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById("time").textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();

document.getElementById("barcode").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        let barcodeValue = document.getElementById("barcode").value;
        console.log("Barcode entered:", barcodeValue);
        document.getElementById("barcode").value = ""; 
        handleBarcodeInput(barcodeValue); 
    }
});

async function findItems(barcode) {
    try {
        let response = await fetch("items.json");
        let items = await response.json();

        let item = items.find(i => i.barcode === barcode);

        if (item) {
            return { name: item.name, price: item.price };
        } else {
            return { error: "Item was not found" };
        }
    } catch (error) {
        console.error("Error while reading item information:", error);
        return { error: "Could not read data" };
    }
}

function handleBarcodeInput(barcodeValue) {
    findItems(barcodeValue).then(result => {
        if (result.error) {
            alert(result.error);
        } else {
            console.log("Item found:", result);

            if (barsketItems[result.name]) {
                barsketItems[result.name].quantity++;
            } else {
                barsketItems[result.name] = { price: result.price, quantity: 1 };
            }

            barsketTotaltAmount += result.price;
            document.getElementById("total-price").innerHTML = barsketTotaltAmount;
            
            let totalItems = Object.values(barsketItems).reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById("items-total").innerHTML = totalItems;

            updateReceipt();
        }
    });
}

function updateReceipt() {
    let receiptContainer = document.querySelector(".recepit-items");
    while (receiptContainer.firstChild) {
        receiptContainer.removeChild(receiptContainer.firstChild);
    }

    for (let itemName in barsketItems) {
        let item = barsketItems[itemName];

        let newItem = document.createElement("div");
        newItem.classList.add("recepit-item");
        newItem.innerHTML = `
            <h2>${item.quantity}x ${itemName}</h2>
            <h3>Pris: ${item.price * item.quantity}</h3>
        `; // Enter your currency here
        receiptContainer.appendChild(newItem);
    }
}

function clearBasket() {
    let confirmation = confirm("Are you sure you want to clear the basket?");
    if (!confirmation) {
        return;
    } else {
        updateSalesData("cancelled");
        barsketItems = {};
        barsketTotaltAmount = 0;
        document.getElementById("total-price").innerHTML = barsketTotaltAmount;
        document.getElementById("items-total").innerHTML = 0;
        
        updateReceipt();
    }
}

function clearBasketNoConfirmation() {
    barsketItems = {};
    barsketTotaltAmount = 0;
    document.getElementById("total-price").innerHTML = barsketTotaltAmount;
    document.getElementById("items-total").innerHTML = 0;    
    
    updateReceipt(); 
}

function sendToDiscord(payload) {
    const webhookURL = ""; // Enter your webhook URL here 

    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log("Sales data sent to Discord");
        } else {
            console.error("An error occurred while sending information to Discord: ", response.statusText);
        }
    })
    .catch(error => {
        console.error("Error", error);
    });
}

function updateSalesData(state) {
    const totalPrice = barsketTotaltAmount;
    const items = Object.entries(barsketItems).map(([itemName, item]) => {
        return { name: itemName, quantity: item.quantity, price: item.price };
    });
    const timeNow = new Date().toLocaleString();

    let saleState = state === "success" ? "Sucess" : "Cancelled"; // Enter your own states here

    const sale = {
        totalPrice,
        items,
        timeNow,
        state: saleState,
    };

    const payload = {
        content: `**Sale:** \n Time: ${timeNow}\nStatus: ${saleState}\nTotal price: ${totalPrice} CURRENCY\n\n**Items:**\n` +
                 items.map(item => `Name: ${item.name}, Amount: ${item.quantity}, Price: ${item.price * item.quantity} CURRENCY`).join("\n")
    };

    sendToDiscord(payload);
}

function pay() {
    if (Object.keys(barsketItems).length === 0) {
        alert("Basket is emty");
    } else {
        let itemList = Object.entries(barsketItems).map(([itemName, item]) => `${item.quantity}x ${itemName} - Pris: ${item.price * item.quantity} DKK`).join("\n");

        let confirmationMessage = `Confirm purchase of follwing items:
${itemList}
Total price: ${barsketTotaltAmount} DKK
`;

        let confirmation = confirm(confirmationMessage);
        if (confirmation) {
            updateSalesData("success");
            clearBasketNoConfirmation();
        } else {
            alert("The purchase was cancelled");
        }
    }
}

updateTime();
