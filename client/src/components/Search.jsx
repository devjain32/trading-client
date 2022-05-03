import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import stocks from "../services/stocks";
import jwtDecode from "jwt-decode";
import DoneIcon from "@mui/icons-material/Done";
import {
  getStock,
  newTransaction,
  getUser,
  updateTransaction,
  deleteTransaction,
} from "../services/restServices";
import axios from "axios";
import cheerio from "cheerio";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

function StockModal(props) {
  const [dateValue, setDateValue] = useState("");
  const [actionValue, setActionValue] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [priceValue, setPriceValue] = useState("");

  useEffect(() => {
    if (props?.intent === "create") {
      setDateValue(
        `${
          new Date().getMonth() + 1
        }/${new Date().getDate()}/${new Date().getFullYear()}`
      );
      setPriceValue(props.value);
      setActionValue("buy");
    } else {
      setDateValue(props.modalData?.date);
      setActionValue(props.modalData?.operation);
      setQuantityValue(props.modalData?.shares);
      setPriceValue(props.modalData?.price_per_share);
    }
  }, [props]);
  return (
    <Modal
      open={props.open}
      onClose={() => props.modalClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          p: 4,
          padding: 3,
        }}
      >
        <TextField
          variant="outlined"
          style={{ marginBottom: 15 }}
          label="Date"
          placeholder="MM/DD/YYYY"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
        ></TextField>
        <TextField
          variant="outlined"
          style={{ marginBottom: 15 }}
          label="Price"
          value={priceValue}
          onChange={(e) => setPriceValue(e.target.value)}
        ></TextField>
        <TextField
          variant="outlined"
          style={{ marginBottom: 15 }}
          label="Quantity"
          value={quantityValue}
          onChange={(e) => setQuantityValue(e.target.value)}
        ></TextField>
        <br />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Action</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            label="Action"
            id="demo-simple-select-label"
            style={{ width: 100 }}
            value={actionValue}
            onChange={(e) => setActionValue(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"buy"}>buy</MenuItem>
            <MenuItem value={"sell"}>sell</MenuItem>
          </Select>
        </FormControl>
        <br />
        {props?.modalIntent === "create" ? (
          <Button
            onClick={async () => {
              await newTransaction(props?.user, {
                ticker: props.ticker,
                date: dateValue,
                price_per_share: priceValue,
                shares: quantityValue,
                operation: actionValue,
              });
              props.modalCloseAndUpdate();
            }}
          >
            Add Record
          </Button>
        ) : (
          <>
            <Button
              onClick={async () => {
                await updateTransaction({
                  date: dateValue,
                  operation: actionValue,
                  price_per_share: priceValue,
                  shares: quantityValue,
                  id: props.modalData?._id,
                });
                props.modalCloseAndUpdate();
              }}
            >
              Update Record
            </Button>
            <Button
              onClick={async () => {
                await deleteTransaction({
                  id: props.modalData?._id,
                });
                props.modalCloseAndUpdate();
              }}
            >
              Delete Record
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}

class Search extends React.Component {
  state = {
    text: "",
    error_loading_stock: false,
    searched_stock: "",
    searched_stock_value: 0,
    modalOpen: false,
    currentValue: 0,
    principle: 0,
    numShares: 0,
    image: "",
  };

  async componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const userJWT = jwtDecode(jwt);
      const user = await getUser(userJWT?._id);
      this.setState({ user: user?.data });
    } catch (ex) {}
  }

  async getCurrentPriceFromTicker() {
    axios
      .get(
        `https://money.cnn.com/quote/quote.html?symb=${this.state.searched_stock}`,
        {}
      )
      .then((res) => {
        const $ = cheerio.load(res.data);
        let price = $(".wsod_last").children().html();
        this.setState({ searched_stock_value: parseFloat(price) });
      });
    axios
      .get(
        `https://money.cnn.com/quote/forecast/forecast.html?symb=${this.state.searched_stock}`,
        {}
      )
      .then((res) => {
        const $ = cheerio.load(res.data);
        let image = $(".wsod_chart").children().attr();
        this.setState({ image: image });
      });
    this.calculateTotals();
  }

  handleSearch = (stock) => {
    const stockInformation = JSON.parse(getStock()?.data);
    this.getCurrentPriceFromTicker();
  };

  modalClose = () => {
    this.setState({ modalOpen: false });
    this.setState({ modalIntent: "" });
  };

  calculateTotals = () => {
    var principle = 0;
    var currentValue = 0;
    var numShares = 0;
    this.state.user?.transactions?.map((transaction) => {
      if (transaction?.ticker === this.state.searched_stock) {
        if (transaction?.operation === "buy") {
          principle -=
            parseFloat(transaction?.price_per_share) *
            parseFloat(transaction?.shares);
          currentValue +=
            parseFloat(transaction?.shares) *
            parseFloat(this.state.searched_stock_value);
          numShares += parseFloat(transaction?.shares);
        } else if (transaction?.operation === "sell") {
          principle +=
            parseFloat(transaction?.price_per_share) *
            parseFloat(transaction?.shares);
          currentValue -=
            parseFloat(transaction?.shares) *
            parseFloat(this.state.searched_stock_value);
          numShares -= parseFloat(transaction?.shares);
        }
      }
    });
    this.setState({
      currentValue: (
        (principle - this.state.searched_stock_value) /
        numShares
      ).toFixed(2),
    });
    this.setState({ principle: Math.abs((principle / numShares).toFixed(2)) });
    this.setState({ numShares: numShares.toFixed(2) });
  };

  render() {
    return (
      <>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 5, height: "100%" }}
          style={{ backgroundColor: "#F0F2F5" }}
        >
          <TextField
            label="Stock"
            variant="outlined"
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value })}
          />
          {this.state.error_loading_stock && (
            <Chip
              onClick={() => {
                this.setState({ error_loading_stock: false });
              }}
              deleteIcon={<DoneIcon />}
              label="We couldn't find that stock. Please try searching again."
              color="warning"
              variant="outlined"
              sx={{ margin: 1 }}
            />
          )}
          <Button
            onClick={() => {
              if (stocks.includes(this.state.text.toUpperCase().trim())) {
                this.setState({ error_loading_stock: false });
                this.setState({
                  searched_stock: this.state.text.toUpperCase().trim(),
                });
                this.handleSearch(this.state.text.toUpperCase().trim());
              } else {
                this.setState({ error_loading_stock: true });
              }
            }}
          >
            search
          </Button>
          {!!this.state.searched_stock && (
            <>
              <Grid container>
                <Grid
                  item
                  xs={5}
                  style={{
                    minWidth: 650,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <iframe
                    style={{ width: 616, height: 400 }}
                    frameBorder="no"
                    src={`//markets.money.cnn.com/research/quote/chart/interactive.asp?symb=${this.state.searched_stock}`}
                    scrolling="no"
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 380,
                      top: 207,
                      fontWeight: "100",
                      fontSize: 10,
                    }}
                  >
                    This chart and the bottom right chart are sourced from{" "}
                    <span
                      style={{ textDecoration: "underline", color: "blue" }}
                    >
                      money.cnn.com
                    </span>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ borderRadius: 0 }}
                    style={{
                      minWidth: 770,
                      maxHeight: 404,
                      minHeight: 404,
                      overflowY: "auto",
                    }}
                  >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Stock</TableCell>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="center">Action</TableCell>
                          <TableCell align="center">Price</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                          <TableCell align="center">Market Value</TableCell>
                          <TableCell align="center">
                            <IconButton
                              style={{
                                color: "#C4DEA6",
                                backgroundColor: "#30353A",
                                opacity: 0.8,
                              }}
                              onClick={() => {
                                this.setState({ modalOpen: true });
                                this.setState({ modalIntent: "create" });
                                this.setState({ modalData: "" });
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.user?.transactions?.reverse().map((t) => {
                          if (t?.ticker === this.state.searched_stock) {
                            return (
                              <TableRow
                                key={t.date}
                                style={{
                                  backgroundColor:
                                    t.operation === "buy"
                                      ? "#C4DEA6"
                                      : "#E6A595",
                                  height: 10,
                                }}
                              >
                                <TableCell
                                  style={{ padding: 5 }}
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  {t.ticker}
                                </TableCell>
                                <TableCell
                                  style={{ padding: 5 }}
                                  align="center"
                                >
                                  {typeof t.date === "number"
                                    ? new Date(t.date).toLocaleDateString()
                                    : t.date}
                                </TableCell>
                                <TableCell
                                  style={{ padding: 5 }}
                                  align="center"
                                >
                                  {t.operation}
                                </TableCell>
                                <TableCell
                                  style={{ padding: 5 }}
                                  align="center"
                                >
                                  {t.price_per_share}
                                </TableCell>
                                <TableCell
                                  style={{ padding: 5 }}
                                  align="center"
                                >
                                  {t.shares}
                                </TableCell>
                                <TableCell
                                  style={{ padding: 5 }}
                                  align="center"
                                >
                                  {(
                                    parseFloat(t.price_per_share) *
                                    parseFloat(t.shares)
                                  ).toFixed(2)}
                                </TableCell>
                                <TableCell
                                  style={{ padding: 5 }}
                                  align="center"
                                >
                                  <IconButton
                                    onClick={() => {
                                      this.setState({ modalOpen: true });
                                      this.setState({ modalData: t });
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })}
                      </TableBody>
                    </Table>
                    {this.state.user?.transactions?.length === 0 && (
                      <div
                        style={{
                          width: "100%",
                          height: 330,
                          backgroundColor: "#C4DEA6",
                          margin: "auto",
                          textAlign: "center",
                          verticalAlign: "middle",
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                          flexDirection: "column",
                          color: "gray",
                        }}
                      >
                        You don't have any transactions in your history.
                        <br />
                        Add some now using the plus button on the top right.
                      </div>
                    )}
                  </TableContainer>
                </Grid>
                <br />
                <TableContainer
                  component={Paper}
                  elevation={0}
                  style={{
                    width: 616,
                    height: 200,
                    borderRadius: 0,
                    marginTop: 5,
                  }}
                >
                  <Table sx={{ minWidth: 616 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{ fontWeight: "bold" }}
                        >
                          Metric
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ fontWeight: "bold" }}
                        >
                          Value
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ fontWeight: "bold" }}
                        >
                          Metric
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ fontWeight: "bold" }}
                        >
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          style={{ padding: 8, backgroundColor: "#E6ECF2" }}
                          align="center"
                        >
                          Stock Value
                        </TableCell>
                        <TableCell
                          style={{ padding: 8, backgroundColor: "#E6ECF2" }}
                          align="center"
                        >
                          ${this.state.searched_stock_value}
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          Average cost
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          ${this.state.principle}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ padding: 8 }} align="center">
                          Outstanding shares in market
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          {this.state.numShares}
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          Portfolio market value
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          ${this.state.currentValue}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ padding: 5 }} align="center">
                          Gain
                        </TableCell>
                        <TableCell style={{ padding: 5 }} align="center">
                          $
                          {(
                            this.state.currentValue - this.state.principle
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell style={{ padding: 5 }} align="center">
                          Percent gain
                        </TableCell>
                        <TableCell style={{ padding: 5 }} align="center">
                          {(
                            ((this.state.currentValue - this.state.principle) /
                              this.state.principle) *
                            100
                          ).toFixed(2)}
                          %
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  style={{
                    width: 395,
                    height: 200,
                    borderRadius: 0,
                    marginTop: 5,
                  }}
                >
                  <Table sx={{ minWidth: 395 }} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          style={{ padding: 8, backgroundColor: "#E6ECF2" }}
                          align="center"
                        >
                          Recommendation
                        </TableCell>
                        <TableCell
                          style={{ padding: 8, backgroundColor: "#E6ECF2" }}
                          align="center"
                        >
                          Hold
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          {/* Average cost */}
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          {/* ${this.state.principle} */}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ padding: 8 }} align="center">
                          MACD
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          Bullish
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ padding: 5 }} align="center">
                          Stochastic Oscillator
                        </TableCell>
                        <TableCell style={{ padding: 5 }} align="center">
                          Bearish
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ padding: 8 }} align="center">
                          ROC
                        </TableCell>
                        <TableCell style={{ padding: 8 }} align="center">
                          Bearish
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <div style={{ marginTop: 5 }}>
                  <img src={this.state.image} style={{ height: 200 }} />
                </div>
                {/* <div
                  style={{
                    width: 200,
                    marginTop: 5,
                    backgroundColor: "white",
                    height: 200,
                    paddingLeft: 15,
                  }}
                >
                  Please note: suggested stock performance from{" "}
                  <span style={{ color: "blue", textDecoration: "underline" }}>
                    money.cnn.com
                  </span>
                  <br />
                  This image was not generated by UTME Trading, and was sourced
                  from an outside network and their data analysis.
                </div> */}
              </Grid>
            </>
          )}
          <Grid container style={{ marginTop: 5 }}>
            <Grid item xs={6}></Grid>
          </Grid>
        </Grid>
        <StockModal
          open={this.state.modalOpen}
          user={this.state.user?._id}
          ticker={this.state.searched_stock}
          value={this.state.searched_stock_value}
          modalData={this.state.modalData}
          modalClose={() => this.modalClose()}
          modalIntent={this.state.modalIntent}
          modalCloseAndUpdate={async () => {
            const user = await getUser(this.state.user._id);
            this.setState({ user: user?.data });
            this.calculateTotals();
            this.setState({ modalIntent: "" });
            this.modalClose();
          }}
        />
      </>
    );
  }
}

export default Search;
