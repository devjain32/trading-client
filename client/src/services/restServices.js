import http from "./httpService";

export function getUser(id) {
  return http.get(`http://localhost:3001/users/${id}`);
}

export async function newTransaction(userId, stock_data) {
  var response = await http.post(`http://localhost:3001/transactions`, {
    ticker: stock_data.ticker,
    date: stock_data.date,
    price_per_share: stock_data.price_per_share,
    shares: stock_data.shares,
    operation: stock_data.operation,
  });
  return await http.put(`http://localhost:3001/users/transaction/${userId}`, {
    transactionId: response.data._id,
  });
}

export async function updateTransaction(stock_data) {
  var response = await http.put(
    `http://localhost:3001/transactions/${stock_data.id}`,
    {
      date: stock_data.date,
      price_per_share: stock_data.price_per_share,
      shares: stock_data.shares,
      operation: stock_data.operation,
    }
  );
  return response;
}

export async function deleteTransaction(stock_data) {
  var response = await http.delete(
    `http://localhost:3001/transactions/${stock_data.id}`
  );
  return response;
}

export async function sellStock(stock_data) {
  var response = await http.put(
    `http://localhost:3001/stocks/${stock_data.id}`,
    {
      date_sold: stock_data.date_sold,
      value_sold: stock_data.value_sold,
    }
  );
  return response;
}

export function getStock(stock) {
  return {
    data: `{"recommendation": "Hold","kpis": [{"Name": "MACD", "Score":3},{"Name": "ROC", "Score":0},{"Name": "STOCH", "Score":3}]}`,
  };
}
