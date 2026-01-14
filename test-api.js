
async function test() {
    try {
        console.log("Testing Yahoo Finance...");
        const res = await fetch("https://query1.finance.yahoo.com/v8/finance/quote?symbols=AAPL", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        console.log("Yahoo Status:", res.status);
        if (res.ok) {
            const data = await res.json();
            console.log("Yahoo Data:", JSON.stringify(data.quoteResponse?.result?.[0]?.symbol));
        } else {
            console.log("Yahoo Error:", await res.text());
        }
    } catch (e) {
        console.error("Yahoo Exception:", e);
    }

    try {
        console.log("\nTesting CoinGecko...");
        const res2 = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr");
        console.log("CoinGecko Status:", res2.status);
        if (res2.ok) {
            console.log("CoinGecko Data:", await res2.json());
        }
    } catch (e) {
        console.error("CoinGecko Exception:", e);
    }
}

test();
