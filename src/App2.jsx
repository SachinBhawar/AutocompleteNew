import { useEffect, useState } from "react";
import "./App.css";

// 🔹 Constants
const DEFAULT_KEYWORDS = ["Rohini", "Nilam", "Mayuri", "Sunanda", "Jyoti", "Dipali"];
const API_URL = "https://dummyjson.com/products";

// 🔹 UI: Highlighted text match
const HighlightedText = ({ text, highlight }) => {
    if (!highlight) return <>{text}</>;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="font-bold text-blue-600">
                {part}
            </span>
        ) : (
            <span key={index}>{part}</span>
        )
    );
};

// 🔹 UI: Keyword suggestions
const KeywordSuggestions = ({ keywords, filter }) => {
    if (!filter) return null;

    return (
        <div className="flex flex-col w-full p-2">
            {keywords.map((keyword, index) => (
                <div key={index} className="w-full p-2 border-b">
                    <HighlightedText text={keyword} highlight={filter} />
                </div>
            ))}
        </div>
    );
};

// 🔹 Main App Component
function App() {
    const [products, setProducts] = useState([]);
    const [input, setInput] = useState("");
    const [keywords] = useState(DEFAULT_KEYWORDS);
    const [error, setError] = useState("");

    const fetchProductData = async () => {
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            console.log("Fetched Products:", json.products);
            setProducts(json.products); // currently unused, but stored
            setError("");
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load product data.");
        }
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10 px-4">
            <h1 className="text-4xl font-bold mb-6">Autocomplete</h1>

            {error ? (
                <div className="text-red-600 text-xl font-semibold">{error}</div>
            ) : (
                <div className="flex flex-col items-center w-full max-w-md">
                    <input
                        type="text"
                        value={input}
                        onChange={handleChange}
                        placeholder="Search names..."
                        className="p-2 w-full border rounded shadow-sm mb-2"
                    />

                    <KeywordSuggestions keywords={keywords} filter={input} />
                </div>
            )}
        </div>
    );
}

export default App;
