# AssetDash Full-stack Engineering Take-home test

Our mission at AssetDash is to help users track the assets in their portfolio from many different sources.

In this exercise, you will be creating a few backend endpoints that power our web and mobile applications. An important module at AssetDash is the portfolio tracking tool,
which pulls in and calculates the user's portfolio holdings across different asset types and displays this to them on the web or in the mobile app.

Please read the instructions below and complete the task at your own pace. It should not take longer than 1 hour for
you to complete the Backend assignment. The Frontend assignment is optional but if you have experience with frontend develop, specifically
using React.js, feel free to complete it for bonus points :)

## Backend
Task: You have been provided a basic `server.py` using FastAPI for the endpoints you need to fill in. Create 2 API endpoints to fetch the portfolio chart and list of holdings for a user by `user_id`

Notes
- Please make sure to use proper Pydantic response models https://fastapi.tiangolo.com/tutorial/response-model/
- Dependencies are provided in `requirements.txt`
- You can run the server by going into `/backend` and running `python server.py`
- You can install any other dependencies you need via `pip` but please make sure to update `requirements.txt` so that I can run the project to test.

#### Data
`database.py` - This is a Python file that contains data for users. In practice we would use a real database but for the purpose of this take-home test you can just read this data directly from the file to make your calculations and return in the APIs.
- HOLDINGS - this object is a list of the user's portfolio holdings by Asset, each user can hold multiple wallets and have many assets in the wallet
- ASSETS - this object is the list of assets containing descriptive data about the asset like `ticker`, `name`, `logo`
- ASSET_TYPES - this is a set of the possible values for the asset type field

#### Endpoints
- Portfolio Chart Endpoint
    - GET request
    - Query Params
        - `user_id`: `str`
    - Response
        - Return the total portfolio value ($) and the data to create a pie chart of the user's portfolio. The response should show the percentage (%) of each asset type in the user's portfolio.
        - Example response:
        ```
         {
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
        ```

- Portfolio Holdings Endpoint
    - GET request
    - Query Params
        - `user_id`: `str`
        - `asset_type`: `str` Default = `None`
    - Response
        - Return a list of the user's holdings in descending order by value, filter by asset type. Default asset type is `None`, so no filtering should happen.
        - Example response:
        ```
         [
            {
                "ticker": "AAPL",
                "name": "Apple",
                "type": "stock",
                "value": 1000,
                "percentage": 8.3
            },
            ...
         ]
        ```

Bonus points if you use Python 3 `typing` library to properly type your variables :)

## Frontend
This part of the take-home assignment is OPTIONAL. If you have experience doing frontend development and would like
to showcase your frontend skills, you can complete this part for extra credit.

Task: You have been provided a basic "Create React App" project in the `/frontend` folder. Please create the UI for the portfolio tracker, pulling data from the endpoints you created in the backend assignment.

Notes:
- You can add any dependencies you want to the React project but please remember to update `package.json` so that I can run the project to test.

![Frontend Assignment](images/frontend_assignment.png)

UI elements:
- Title - "AssetDash Portfolio Tracker"
- Search bar for User ID
- Portfolio Chart
    - Pie chart showing the breakdown of assets by type
- Portfolio Holdings
    - Holdings table/listview showing the list of assets by type

UX:
- Screen initially will appear empty since there is no User ID in the search bar
- If you search by User ID in the search bar it should fetch from the endpoints you created in the backend part
- Display the chart using any graphing library you like
- Display the list of holdings as either a table or a listview
- The "Asset Type" dropdown should default to "All" which means no filter. The options in the dropdown should be the values in `ASSET_TYPES` from the backend `database.py`
- When a user change the dropdown it should query the holdings endpoint and filter by `asset type`

Bonus points for making the app look pretty with a nice graphing library and CSS styles :)