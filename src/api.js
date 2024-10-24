/* eslint-disable */
const API_KEY =
  "4cd988ccd66dce08b174cc8e0546df38dc23150e3d9e9b64d17d2e5a074ef407";

const tickersHandlers = new Map();

const loadTikers = () => {

  if (tickers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickers.keys()]
    .join(
      ","
    )}&tsyms=USD&api_kay=${API_KEY}`
  )
    .then(r => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    })
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};
// export const unsubscribeFromTicker = (ticker, cb) => {
//   const subscribers = tickersHandlers.get(ticker) || [];
//   tickersHandlers.set(
//     ticker,
//     subscribers.filter((fn) => fn != cb)
//   );
// };

setInterval(loadTikers, 5000);

window.tickers = tickersHandlers;
