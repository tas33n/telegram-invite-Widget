# Telegram Widget App

Welcome to the `Telegram Invite Widget` App! This is a simple web application that allows you to create Telegram group or channel invite widgets. You can use this app for both open-source development and self-deployment to other users. This project is inspired by the Discord widget made by `switchblade`.

## Getting Started

### Prerequisites
- Node.js installed on your machine

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/telegram-invite-Widget.git
   ```

2. Navigate to the project directory:
   ```bash
   cd telegram-invite-Widget
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Join My Telegram Group (+ this is the widget preview)

<p align="center">
 <a href="https://telegram.me/misfits_zone">
  <img src="https://tg-button.repl.co/misfits_zone/%231a0130" style="border-radius:20px;">
 </a>
</p>


### Usage

1. Run the application:
   ```bash
   npm start
   ```

2. Open your browser and go to [http://localhost:3000](http://localhost:3000) to access the home page.

3. To get raw data, use the following endpoint:
   ```
   http://localhost:3000/api/:username
   ```
   Replace `:username` with the Telegram username.

4. To get an invite Widget, use the following endpoint:
   ```
   http://localhost:3000/:username/:color?
   ```
   Replace `:username` with the Telegram username and `:color` (optional) with a color name.

### Examples

- To get raw data:
  ```
  http://localhost:3000/api/misfits_zone
  ```

- To get an invite button with a specific color:
  ```
  http://localhost:3000/misfits_zone/red
  ```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an [issue](https://github.com/your-username/telegram-invite-Widget/issues) or submit a [pull request](https://github.com/your-username/telegram-invite-Widget/pulls).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Cheerio](https://cheerio.js.org/)

Thank you for using the Telegram Widget App!
