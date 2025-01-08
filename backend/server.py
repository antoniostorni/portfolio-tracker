from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import uvicorn
from decimal import Decimal
from fastapi.middleware.cors import CORSMiddleware

# Import the data from database.py
from database import ASSET_TYPES, HOLDINGS, ASSETS

app = FastAPI(title="Portfolio API",
             description="API for managing user portfolio data",
             version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Pydantic Models
# -----------------------------
class PortfolioChartResponse(BaseModel):
    total_value: Decimal = Field(..., description="Total portfolio value in USD")
    chart: Dict[str, Decimal] = Field(..., description="Percentage breakdown by asset type")

    class Config:
        json_encoders = {
            Decimal: lambda v: float(v)
        }


class HoldingItem(BaseModel):
    ticker: str = Field(..., description="Asset ticker symbol")
    name: str = Field(..., description="Asset name")
    type: str = Field(..., description="Asset type")
    value: Decimal = Field(..., description="Holding value in USD")
    percentage: Decimal = Field(..., description="Percentage of portfolio")

    class Config:
        json_encoders = {
            Decimal: lambda v: float(v)
        }


# -----------------------------
# Helper Functions
# -----------------------------
async def get_user_holdings(user_id: str) -> Dict[str, List[Dict]]:
    """
    Returns all wallets with their holdings for the given user.
    
    Args:
        user_id: The ID of the user
        
    Returns:
        Dict mapping wallet IDs to lists of holdings
        
    Raises:
        HTTPException: If user not found or has no holdings
    """
    if not isinstance(user_id, str):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
        
    user_data = HOLDINGS.get(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found or has no holdings")
    return user_data


async def calculate_portfolio_value_and_type_breakdown(user_id: str) -> tuple[Decimal, Dict[str, Decimal]]:
    """
    Calculates total value and type breakdown for user's portfolio.
    
    Args:
        user_id: The ID of the user
        
    Returns:
        Tuple of (total portfolio value, dict mapping asset types to values)
    """
    user_data = await get_user_holdings(user_id)

    type_sums: Dict[str, Decimal] = {}
    total_value = Decimal('0')

    for wallet, holdings_list in user_data.items():
        for holding in holdings_list:
            asset_id = holding["asset_id"]
            amount = Decimal(str(holding["amount"]))
            
            asset_info = ASSETS.get(asset_id)
            if not asset_info:
                continue

            asset_type = asset_info["type"]
            if asset_type not in ASSET_TYPES:
                continue

            type_sums[asset_type] = type_sums.get(asset_type, Decimal('0')) + amount
            total_value += amount

    return total_value, type_sums


async def calculate_holdings_list(user_id: str, asset_type: Optional[str] = None) -> List[HoldingItem]:
    """
    Calculates list of holdings with values and percentages.
    
    Args:
        user_id: The ID of the user
        asset_type: Optional filter for asset type
        
    Returns:
        List of HoldingItem objects sorted by value
    """
    user_data = await get_user_holdings(user_id)

    holdings_accumulator = []
    total_for_filtered = Decimal('0')

    for wallet, holdings_list in user_data.items():
        for holding in holdings_list:
            asset_id = holding["asset_id"]
            amount = Decimal(str(holding["amount"]))
            
            asset_info = ASSETS.get(asset_id)
            if not asset_info:
                continue

            if asset_type and asset_type != asset_info["type"]:
                continue

            holdings_accumulator.append({
                "ticker": asset_info["ticker"],
                "name": asset_info["name"],
                "type": asset_info["type"],
                "value": amount,
            })
            total_for_filtered += amount

    results = []
    for h in holdings_accumulator:
        percentage = (Decimal('100') * h["value"] / total_for_filtered) if total_for_filtered else Decimal('0')
        results.append(
            HoldingItem(
                ticker=h["ticker"],
                name=h["name"],
                type=h["type"],
                value=h["value"],
                percentage=percentage.quantize(Decimal('0.01'))
            )
        )

    return sorted(results, key=lambda x: x.value, reverse=True)


# -----------------------------
# Endpoints
# -----------------------------
@app.get("/portfolio-chart", 
         response_model=PortfolioChartResponse,
         summary="Get portfolio value and type breakdown",
         response_description="Portfolio total value and percentage breakdown by type")
async def read_portfolio_chart(
    user_id: str = Query(..., description="User ID to fetch the portfolio chart for")
) -> PortfolioChartResponse:
    """
    Returns the total portfolio value and a breakdown of the portfolio by asset type (in percentages).
    """
    total_value, type_sums = await calculate_portfolio_value_and_type_breakdown(user_id)
    
    if total_value == 0:
        return PortfolioChartResponse(total_value=Decimal('0'), chart={})

    chart_percentages = {
        t: (Decimal('100') * v / total_value).quantize(Decimal('0.01'))
        for t, v in type_sums.items()
    }

    return PortfolioChartResponse(
        total_value=total_value.quantize(Decimal('0.01')),
        chart=chart_percentages
    )


@app.get("/portfolio-holdings",
         response_model=List[HoldingItem],
         summary="Get portfolio holdings",
         response_description="List of holdings with values and percentages")
async def read_portfolio_holdings(
    user_id: str = Query(..., description="User ID to fetch the holdings for"),
    asset_type: Optional[str] = Query(None, description="Optional asset type filter")
) -> List[HoldingItem]:
    """
    Returns a list of the user's holdings in descending order by value,
    optionally filtered by asset_type.
    """
    return await calculate_holdings_list(user_id, asset_type)


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=5000, log_level="info")
