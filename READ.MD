# Mini Mini POS

Mini Mini POS is a lightweight Point of Sale (POS) system designed for quick barcode scanning, item tracking, and total price calculation. The system allows users to scan barcodes, maintain a running total, and generate a digital receipt.

## Features
- **Barcode Scanning**: Enter item barcodes to retrieve product details.
- **Item Tracking**: Keeps track of the number of items in the basket.
- **Total Price Calculation**: Automatically calculates the total cost.
- **Digital Receipt**: Displays purchased items with their quantities and prices.
- **Cancel or Pay Options**: Clear the basket or proceed with payment.
- **Real-time Clock**: Displays the current time.
- **Discord Webhook Integration**: (Optional) Sends sales data to a Discord webhook.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/mini-mini-pos.git
   ```
2. Navigate to the project directory:
   ```sh
   cd mini-mini-pos
   ```
3. Open `index.html` in a web browser.

## Files and Structure
```
mini-mini-pos/
├── index.html       # Main HTML file (UI layout)
├── style.css        # Stylesheet for UI design
├── main.js          # JavaScript logic for barcode scanning and receipt handling
├── items.json       # List of available products with barcodes and prices
```

## JSON File (`items.json`)
The `items.json` file contains a structured list of products available for sale. Each item has:
- **barcode**: A unique identifier for the product.
- **name**: The name of the product.
- **price**: The price of the item in DKK.

Example:
```json
[
  {
    "barcode": "5060337502290",
    "name": "Hvid monster",
    "price": 12
  },
  {
    "barcode": "5701872203005",
    "name": "Coca cola",
    "price": 6
  }
]
```

The JavaScript file (`main.js`) reads this JSON file to match barcodes with product details when scanned.

## Usage
1. Open `index.html` in a browser.
2. Scan or enter a barcode in the input field.
3. The item will be added to the basket, and the total price will be updated.
4. Click "Pay" to finalize the purchase or "Cancel" to clear the basket.
5. (Optional) Configure a Discord webhook in `main.js` to log sales remotely.

## Configuration
To enable Discord webhook notifications, update the following line in `main.js`:
```js
const webhookURL = "YOUR_DISCORD_WEBHOOK_URL";
```
Replace `YOUR_DISCORD_WEBHOOK_URL` with your actual webhook URL.

## Known Issues
- Items must be listed in `items.json` to be recognized.
- No actual payment processing is implemented.
- Minor spelling errors in variable names (e.g., `barsketItems` instead of `basketItems`).

## Contributing
Feel free to fork this repository and submit pull requests with improvements or bug fixes.

## License
This project is open-source. Use it freely under the MIT License.

## Author
Developed by **Krisser12311**.

