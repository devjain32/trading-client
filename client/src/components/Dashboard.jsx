import React from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import { sellStock, getUser } from "../services/restServices";
import axios from "axios";
import cheerio from "cheerio";

class Statistics extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Typography style={{ marginBottom: 3 }}>
        <span
          style={{
            fontSize: 13,
            textTransform: "uppercase",
            color: "gray",
          }}
        >
          {this.props.name}:{"  "}
        </span>
        <span
          style={{
            backgroundColor: "#E6ECF2",
            padding: "3px 5px 3px 5px",
            borderRadius: 5,
            color: "#13364C",
          }}
        >
          {this.props.value}
        </span>
      </Typography>
    );
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      userId: "",
      stock_prices: [],
    };
  }

  async componentDidMount() {
    var user;
    var userId = "";
    try {
      const jwt = localStorage.getItem("token");
      user = jwtDecode(jwt);
      userId = user._id;
    } catch (ex) {}
    let data = await getUser(userId);
    this.setState({ userId: userId });
    let stockTickerSymbols = data?.data?.transactions?.map((stock) => {
      return stock?.ticker;
    });
    stockTickerSymbols = [...new Set(stockTickerSymbols)];
    this.setState({ stockTickerSymbols });
    console.log(stockTickerSymbols);
    const stockValues = await Promise.all(
      stockTickerSymbols.map(async (stock) => {
        return this.getCurrentPriceFromTicker(stock);
      })
    );
    this.setState({ user: data });
  }

  // async getStocks() {
  //   var url =
  //     "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=0JHWWC22MJBHM8GP";
  //   axios
  //     // HUDH3H942FGVJJLC
  //     .get(url, {
  //       json: true,
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // }

  async getCurrentPriceFromTicker(ticker) {
    axios
      .get(`https://money.cnn.com/quote/quote.html?symb=${ticker}`, {})
      .then((res) => {
        const $ = cheerio.load(res.data);
        const price = $(".wsod_last").children().html();
        const data = this.state.stock_prices;
        data.push({ ticker: ticker, price: price });
        this.setState({ stock_prices: data });
      });
  }

  render() {
    return (
      <>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{
            backgroundColor: "#F0F2F5",
            paddingBottom: 30,
          }}
        >
          {this.state.stockTickerSymbols?.map((stock, index) => {
            return (
              <Card
                key={index}
                sx={{
                  maxWidth: 616,
                  marginTop: 5,
                  backgroundColor: "#FFFFFF",
                  padding: 1,
                  borderRadius: 3,
                }}
                variant="outlined"
              >
                <CardMedia
                  component="img"
                  height="236"
                  image={`https://markets.money.cnn.com/services/api/chart/snapshot_chart_api.asp?symb=${stock}`}
                  alt={stock?.ticker}
                />
                <CardActions
                  style={{
                    marginLeft: 284,
                    marginRight: 276,
                    backgroundColor: "#E6ECF2",
                    padding: 5,
                    paddingLeft: 8,
                    borderRadius: 5,
                    marginTop: 3,
                  }}
                >
                  {stock}
                </CardActions>
              </Card>
            );
          })}
        </Grid>
      </>
    );
  }
}

export default Dashboard;
