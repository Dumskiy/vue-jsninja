/* eslint-disable */
const API_KEY =
  "4cd988ccd66dce08b174cc8e0546df38dc23150e3d9e9b64d17d2e5a074ef407";

export const loadTikers = (tickers) =>
  // console.log(`tickers - ${tickers.join(",")}`);
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
      ","
    )}&tsyms=USD&api_kay=${API_KEY}`
  )
    .then(r => r.json())
    .then(rawData =>
      Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      )
    )

