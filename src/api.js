/* eslint-disable */
const API_KEY =
  "4cd988ccd66dce08b174cc8e0546df38dc23150e3d9e9b64d17d2e5a074ef407";

const tickersHandlers = new Map();
const url = `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`;
const socket = new WebSocket(url);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", e => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined ) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebsocket(message) {

  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  };

  socket.addEventListener("open", () => {
    socket.send(stringifiedMessage);
  },
    { once: true }
  );
};

function subscribeToTickerOnWs(ticker) {
  sendToWebsocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
};

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebsocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

window.tickers = tickersHandlers;
