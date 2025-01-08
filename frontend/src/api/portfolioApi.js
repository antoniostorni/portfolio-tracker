const BASE_URL = 'http://localhost:5000';

export async function fetchPortfolioChart(userId) {
  const res = await fetch(`${BASE_URL}/portfolio-chart?user_id=${userId}`);
  if (!res.ok) {
    throw new Error(`Error fetching chart data: ${res.status}`);
  }
  return res.json();
}

export async function fetchPortfolioHoldings(userId, assetType) {
  // If assetType is "All" or undefined, don't include asset_type param
  const typeParam = assetType && assetType !== 'All' 
    ? `&asset_type=${assetType}`
    : '';
  const res = await fetch(`${BASE_URL}/portfolio-holdings?user_id=${userId}${typeParam}`);
  if (!res.ok) {
    throw new Error(`Error fetching holdings: ${res.status}`);
  }
  return res.json();
}
