import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState("");
    const [err, setErr] = useState("");

    function getSearchTextResults(products, prompt) {
        console.log(typeof prompt);
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

    const handleInput = (e) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    useEffect(() => {
        if (!selectedPrompt) {
            setFilteredProducts([]);
            return;
        }
        const productsFiltered = getFilteredProducts(data, selectedPrompt);
        setFilteredProducts(productsFiltered);
        setKeywords([]);
    }, [selectedPrompt, data]);

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
                        placeholder="Search products..."
                    />

                    {/* suggestions list */}
                    {input !== "" && (
                        <div
                            className="flex flex-col w-full p-2 max-h-[400px] overflow-y-auto bg-white shadow"
                            style={{ display: keywords.length == 0 ? "none" : "flex" }}
                        >
                            {keywords
                                .filter((keyword) => keyword.toLowerCase().includes(input.toLowerCase()))
                                .map((keyword, ind) => {
                                    const regEx = new RegExp(`(${input})`, "i");
                                    const keywordSplits = keyword.split(regEx);
                                    return (
                                        <div
                                            key={ind}
                                            className="w-full p-2 hover:bg-green-700 hover:text-white cursor-pointer"
                                            onClick={() => setSelectedPrompt(keyword)}
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

                    {/* filtered products with images */}
                    {selectedPrompt && filteredProducts.length > 0 && (
                        <div className="mt-4 w-screen flex flex-col items-center">
                            <h2 className="text-xl font-semibold mb-2">Filtered Products:</h2>
                            <div className="flex flex-row w-full p-8 justify-between flex-wrap">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="mb-4 flex flex-col w-60 items-center border-1 p-4 bg-sky-100 rounded-2xl"
                                    >
                                        <img
                                            src={product.thumbnail || (product.images && product.images[0])}
                                            alt={product.title}
                                            className="w-24 h-24 object-cover rounded mr-4 border bg-white"
                                        />
                                        <div>
                                            <div className="font-bold">{product.title}</div>
                                            <div className="text-gray-600">{product.brand}</div>
                                            <div className="text-gray-400">$ {product.price}</div>
                                        </div>
                                    </div>
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
