import { useEffect, useState, useRef } from "react";
import "./App.css";
import Product from "./components/Product";

function App() {
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState("");
    const [err, setErr] = useState("");
    const [activeSuggestion, setActiveSuggestion] = useState(-1);

    // Refs for each suggestion
    const suggestionRefs = useRef([]);

    // Handle input change
    const handleInput = (e) => {
        setInput(e.target.value);
    };

    // Handle keyboard navigation in suggestions
    const handleKeyDown = (e) => {
        if (keywords.length === 0) return;

        if (e.key === "ArrowDown") {
            setActiveSuggestion((prev) => (prev < keywords.length - 1 ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : keywords.length - 1));
        } else if (e.key === "Enter") {
            if (activeSuggestion >= 0 && activeSuggestion < keywords.length) {
                setSelectedPrompt(keywords[activeSuggestion]);
                setInput(keywords[activeSuggestion]);
                setActiveSuggestion(-1);
            }
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Update suggestions when input or data changes
    useEffect(() => {
        if (input === "") {
            setFilteredProducts([]);
            setSelectedPrompt("");
            setKeywords([]);
        } else {
            const suggestions = getSearchTextResults(data, input);
            setKeywords(suggestions);
        }
    }, [input, data]);

    // Update filtered products when selected suggestion changes
    useEffect(() => {
        if (!selectedPrompt) {
            setFilteredProducts([]);
            return;
        }
        const productsFiltered = getFilteredProducts(data, selectedPrompt);
        setFilteredProducts(productsFiltered);
        setKeywords([]);
    }, [selectedPrompt, data]);

    // Reset active suggestion when input or keywords change
    useEffect(() => {
        setActiveSuggestion(-1);
    }, [input, keywords]);

    // Scroll to active suggestion when it changes
    useEffect(() => {
        if (activeSuggestion >= 0 && suggestionRefs.current[activeSuggestion]) {
            suggestionRefs.current[activeSuggestion].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [activeSuggestion, keywords]);

    // Fetch product data from API
    const fetchData = async () => {
        try {
            const fetchedData = await fetch("https://dummyjson.com/products");
            const fetchedDataJson = await fetchedData.json();
            setData(fetchedDataJson.products);
            setErr("");
        } catch (error) {
            setErr("Error occurred: " + error.message);
        }
    };

    // Get keyword suggestions based on input
    function getSearchTextResults(products, prompt) {
        const searchTextLower = prompt.toLowerCase();
        const searchTextResults = new Set();

        products.forEach((product) => {
            if (product.title && product.title.toLowerCase().includes(searchTextLower)) {
                searchTextResults.add(product.title);
            }
            if (Array.isArray(product.tags)) {
                product.tags.forEach((tag) => {
                    if (tag.toLowerCase().includes(searchTextLower)) {
                        searchTextResults.add(tag);
                    }
                });
            }
            if (product.description && product.description.toLowerCase().includes(searchTextLower)) {
                searchTextResults.add(product.description);
            }
            if (product.brand && product.brand.toLowerCase().includes(searchTextLower)) {
                searchTextResults.add(product.brand);
            }
        });

        return Array.from(searchTextResults);
    }

    // Get filtered products based on selected keyword
    function getFilteredProducts(productsArr, prompt) {
        const promptLower = prompt.toLowerCase();
        return productsArr.filter((product) => {
            if (product.title && product.title.toLowerCase().includes(promptLower)) {
                return true;
            }
            if (Array.isArray(product.tags)) {
                if (product.tags.some((tag) => tag.toLowerCase().includes(promptLower))) {
                    return true;
                }
            }
            if (product.description && product.description.toLowerCase().includes(promptLower)) {
                return true;
            }
            if (product.brand && product.brand.toLowerCase().includes(promptLower)) {
                return true;
            }
            return false;
        });
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mt-8 mb-4">Autocomplete</h1>

            {err ? (
                <div className="font-bold text-red-600 text-2xl">Error occurred while fetching data</div>
            ) : (
                <div className="flex flex-col items-center w-80">
                    <input
                        type="text"
                        className="p-2 w-full border-1"
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Search products..."
                        autoFocus
                    />

                    {/* Suggestions list */}
                    {input !== "" && (
                        <div
                            className="flex flex-col w-full p-2 max-h-[400px] overflow-y-auto bg-white shadow"
                            style={{ display: keywords.length === 0 ? "none" : "flex" }}
                        >
                            {keywords
                                .filter((keyword) => keyword.toLowerCase().includes(input.toLowerCase()))
                                .map((keyword, ind) => {
                                    const regEx = new RegExp(`(${input})`, "i");
                                    const keywordSplits = keyword.split(regEx);
                                    return (
                                        <div
                                            key={ind}
                                            ref={(el) => (suggestionRefs.current[ind] = el)}
                                            className={`w-full p-2 cursor-pointer ${
                                                activeSuggestion === ind
                                                    ? "bg-green-700 text-white"
                                                    : "hover:bg-green-700 hover:text-white"
                                            }`}
                                            onClick={() => {
                                                setSelectedPrompt(keyword);
                                                setInput(keyword);
                                                setActiveSuggestion(-1);
                                            }}
                                        >
                                            {keywordSplits.map((part, key) =>
                                                part.toLowerCase() === input.toLowerCase() ? (
                                                    <span className="font-bold" key={key}>
                                                        {part}
                                                    </span>
                                                ) : (
                                                    <span key={key}>{part}</span>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {/* Filtered products with images */}
                    {selectedPrompt && filteredProducts.length > 0 && (
                        <div className="mt-4 w-screen flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-2">Filtered Products:</h2>
                            <div className="flex flex-row w-full p-8 justify-between flex-wrap">
                                {filteredProducts.map((product) => (
                                    <Product product={product} key={product.id} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
