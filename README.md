# 🔍 Autocomplete Search in React

This is a React-based Autocomplete project that provides real-time search suggestions from a product dataset. Users can search using **title**, **description**, **tags**, and **category**, and view relevant product details by selecting a suggestion.

---

## 🚀 Features

- ✅ Live search suggestions as you type
- ✅ Matches based on multiple fields: title, description, tags, category
- ✅ Renders product info dynamically on selection
- ✅ Clean and responsive UI
- ✅ Powered by [DummyJSON Products API](https://dummyjson.com/products)

---

## 🛠 Tech Stack

- **React**
- **JavaScript (ES6+)**
- **CSS / Tailwind CSS** (if applicable)
- **Fetch API** for retrieving data

---

## 📦 API Used

- [https://dummyjson.com/products](https://dummyjson.com/products)

Each product contains:
- `title`
- `description`
- `price`
- `category`
- `tags`
- `thumbnail` and `images`

---

## 🧠 How It Works

1. On initial load, product data is fetched and stored in state.
2. As the user types in the search bar:
   - Suggestions are filtered in real-time based on multiple fields.
   - Matching results are shown as a dropdown list.
3. Clicking on a suggestion displays the selected product (or products) with details like title, price, description, etc.

---
## 🌐 Live Demo

🔗 [https://autocomplete-new.vercel.app](https://autocomplete-new.vercel.app)

---

## 🤝 Contributing

Feel free to fork this project and suggest improvements or new features via pull requests.
