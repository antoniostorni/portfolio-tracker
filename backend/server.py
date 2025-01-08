from fastapi import FastAPI
import uvicorn

app = FastAPI()


@app.get("/portfolio-chart")
def read_portfolio_chart():
    # Replace this with the logic to calculate the portfolio chart given a user_id
    # Remember to use proper FastAPI Response Schemas!
    return {
        "total_value": 40000,
        "chart": {
            "stock": 20,
            "bonds": 20,
            "crypto": 20,
            "nft": 20,
            "defi": 10,
            "real_estate": 10,
        }
    }


@app.get("/portfolio-holdings")
def read_portfolio_holdings():
    # Replace this with the logic to list the portfolio holdings for a user given a user_id and asset_type
    # Remember to use proper FastAPI Response Schemas!
    return [
        {
            "ticker": "AAPL",
            "name": "Apple",
            "type": "stock",
            "value": 1000,
            "percentage": 8.3
        },
    ]


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=5000, log_level="info")
