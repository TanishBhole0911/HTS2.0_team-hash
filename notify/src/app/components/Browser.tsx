import { useState } from 'react';

interface SearchResult {
    link: string;
}

const Browser: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [iframeSrc, setIframeSrc] = useState<string>('');

    const GOOGLE_API_KEY = "AIzaSyC-eSXxFszRolzT6zFlk1nAd9zET21cVmc"; // Replace with your actual Google API key
    const CX = "023a5b4cb85e649a6"; // Replace with your actual Custom Search Engine ID

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            setResults(data.items || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleUrlLoad = async (urlToLoad: string) => {
        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(urlToLoad)}`);
            const html = await response.text();
            setIframeSrc(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
        } catch (error) {
            console.error("Error fetching the URL:", error);
        }
    };

    return (
        <div>
            <div className="iframe-container">
                <iframe src={iframeSrc} />
            </div>
            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                    placeholder="Enter search query..."
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="search-input"
                    placeholder="Enter URL here..."
                />
                <button onClick={() => handleUrlLoad(url)} className="search-button">Go</button>
            </div>
            <div className="results-container">
                {results.map((item) => (
                    <div key={item.link} className="result-item" onClick={() => handleUrlLoad(item.link)}>
                        {item.link}
                    </div>
                ))}
            </div>
            <style jsx>{`
                .search-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    z-index: 1001;
                }
                .search-input {
                    width: 400px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                    margin-right: 10px;
                }
                .search-button {
                    padding: 10px 20px;
                    background-color: #4285f4;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .results-container {
                    width: 80%;
                    display: block;
                    margin-bottom: 20px;
                }
                .result-item {
                    margin: 5px 0;
                    cursor: pointer;
                    color: #4285f4;
                    text-decoration: underline;
                }
                .iframe-container {
                    position: fixed; /* Changed from absolute to fixed */
                    top: 50%;
                    left: 80%;
                    transform: translate(-50%, -50%);
                    width: 375px; /* Width of a typical phone screen */
                    height: 80%; /* Height of a typical phone screen */
                    border: 1px solid #ddd;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    pointer-events: auto; /* Allow scrolling */
                }
            `}</style>
        </div>
    );
};

export default Browser;