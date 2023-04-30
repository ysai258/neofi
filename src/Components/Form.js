import {
  Backdrop,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CenteredLogo from "../Assets/centeredlogo.png";
import symbolsData from "../symbolsData.json";

let ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

const Form = () => {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState();
  const [amount, setAmount] = useState(undefined);
  const [token, setToken] = useState(symbolsData["BTC"]);
  const [data, setData] = useState([]);
  const [searches, setSearches] = useState([]);

  const tokenData = useRef(null);

  ws.onmessage = (ev) => {
    const data = JSON.parse(ev.data);
    tokenData.current = data;
  };

  useEffect(() => {
    const symbol = token?.symbol?.toLowerCase();
    if (ws.readyState == ws.OPEN) {
      ws.close();
      tokenData.current = null;
      setPrice(undefined);
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol}usdt@trade`
      );
      ws.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        tokenData.current = data;
      };
    }
  }, [token]);

  useEffect(() => {
    fetch("https://api.binance.com/api/v1/exchangeInfo")
      .then((res) => res.json())
      .then((data) => {
        const allData = data?.symbols?.filter(
          (val) => val?.quoteAsset == "USDT"
        );
        const dataSymbols = allData?.map((val) => val?.baseAsset);
        const tempData = [];
        dataSymbols.map((val) => {
          if (symbolsData[val]) tempData.push(symbolsData[val]);
        });
        setToken(tempData[0]);
        setSearches(tempData);
        setData(tempData);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      if (tokenData?.current) {
        const data = tokenData?.current;
        const price = data["p"];
        if (price) setPrice((price * 80).toFixed(2));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "90dvh",
          alignItems: "center",
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            backgroundColor: "#0B0819",
            width: "100%",
            padding: "30px",
            borderRadius: "15px",
            position: "relative",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" gutterBottom>
              Current value
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#627EEA", fontWeight: "500" }}
            >
              {price ? `₹ ${price}` : "fetching"}
            </Typography>
          </Stack>
          <Button
            sx={{
              color: "white",
              width: "100%",
              padding: "14px 20px",
              outline: "none",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              justifyContent: "space-between",
              backgroundColor: "#1C1731",
            }}
            onClick={() => setOpen(true)}
          >
            <Typography variant="subtitle2">{token?.name}</Typography>
            <ArrowDropDownIcon />
          </Button>
          <Box>
            <Typography variant="subtitle2" sx={{ lineHeight: 3 }}>
              Amount you want to invest
            </Typography>
            <OutlinedInput
              endAdornment={<InputAdornment position="end">INR</InputAdornment>}
              placeholder="0.00"
              sx={{
                color: "white",
                height: "50px",
                width: "100%",
                outline: "none",
              }}
              value={amount}
              onChange={(e) => {
                const enterValue = e.target.value
                  ? parseInt(e.target.value)
                  : 0;
                setAmount(enterValue);
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ lineHeight: 3 }}>
              Estimate Number of ETH You will Get
            </Typography>
            <Box
              sx={{
                color: "white",
                padding: "14px",
                outline: "none",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                justifyContent: "space-between",
                backgroundColor: "#1C1731",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "#6F6F7E" }}>
                {amount && price ? amount / price : "0.00"}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            sx={{
              background:
                "linear-gradient(94.37deg, #3387D5 -5.94%, #7A06C9 115.34%)",
              textTransform: "none",
              width: "100%",
              height: "50px",
              borderRadius: "30px",
            }}
          >
            Buy
          </Button>
          <Box
            sx={{
              width: "50px",
              height: "50px",
              position: "absolute",
              top: "-45px",
              left: "50%",
              borderRadius: "50%",
              border: "8px solid #1C1731",
              boxShadow: "0 0 0 6px #040406",
              transform: "translateX(-50%)",
            }}
            className="double-border"
          >
            <img
              src={token?.logo}
              alt="Centered logo"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Stack>
      </Container>
      <Backdrop sx={{ backgroundColor: "#0b0819bd", zIndex: 1 }} open={open}>
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#181627",
            padding: "10px",
            borderRadius: "15px",
          }}
        >
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Stack
            direction="column"
            sx={{
              width: "100%",
              padding: "10px",
            }}
          >
            <OutlinedInput
              startAdornment={<SearchIcon />}
              sx={{
                color: "white",
                height: "50px",
                width: "100%",
                borderRadius: "30px",
                marginBottom: "10px",
              }}
              onChange={(e) => {
                setSearches(
                  data.filter((val) => {
                    const name = val?.name?.toLowerCase();
                    const enterValue = e.target.value.toLowerCase();
                    return name.includes(enterValue);
                  })
                );
              }}
            />
            <div
              style={{
                overflowY: "scroll",
                maxHeight: "300px",
              }}
            >
              {searches.map((search) => {
                return (
                  <Button
                    sx={{
                      color: "white",
                      width: "100%",
                      padding: "14px 20px",
                      outline: "none",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                      justifyContent: "space-between",
                    }}
                    onClick={() => {
                      setToken(search);
                      setOpen(false);
                    }}
                  >
                    <Typography variant="subtitle2">{search?.name}</Typography>
                    {token?.name == search?.name && (
                      <CheckIcon sx={{ fill: "#58ADAB" }} />
                    )}
                  </Button>
                );
              })}
            </div>
          </Stack>
        </Container>
      </Backdrop>
    </>
  );
};

export default Form;
