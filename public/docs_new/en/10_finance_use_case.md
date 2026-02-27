# Finance in Practice

> Build your personal AI financial assistant with blockcell

---

## Overview

blockcell ships with comprehensive financial data capabilities:

- Monitor stocks (US / HK / China A-shares), crypto, and forex in real time
- Auto-generate daily / weekly financial reports
- Set price alerts with automatic notifications
- Analyze on-chain data and DeFi protocols
- Build quantitative strategy prototypes

This guide walks through real-world scenarios.

---

## Scenario 1: Real-Time Stock Quotes

### Basic Queries

Just name the stock or ticker:

```
You: What is Apple's current price?

You: Get me a quote for NVDA

You: How much did Tesla and Microsoft move today?
```

blockcell automatically identifies the exchange and selects the correct data source:
- **US stocks**: Alpha Vantage + Yahoo Finance fallback
- **China A-shares** (6-digit codes): Eastmoney API (free, real-time)
- **Hong Kong** (5-digit or .HK suffix): Eastmoney HK

### Technical Analysis

```
You: Show me Apple's 60-day candlestick data, calculate MA5, MA20, MACD, and RSI

You: What technical pattern is Nvidia in right now? Any buy/sell signals?
```

AI will:
1. Fetch historical OHLCV data (`finance_api stock_history`)
2. Calculate technical indicators locally (no extra API needed)
3. Analyze patterns and give you a summary

### Market Depth

```
You: Show me the latest fund flow data for Apple

You: What's the institutional ownership for Microsoft?

You: Which sectors are seeing the most buying today?
```

These queries use `http_request` to call public financial APIs.

---

## Scenario 2: Price Alerts

### Set an Alert

```
You: Alert me when Apple drops below $150 — send a Telegram notification

You: Notify me when Bitcoin crosses $100,000

You: Alert me if ETH gains more than 15% in 24 hours
```

AI calls the `alert_rule` tool to create alert rules:

```json
{
  "name": "Apple below $150",
  "source": "finance_api",
  "symbol": "AAPL",
  "field": "price",
  "operator": "lt",
  "threshold": 150,
  "on_trigger": [
    {
      "tool": "message",
      "params": {
        "channel": "telegram",
        "content": "⚠️ Apple (AAPL) dropped below $150, current price: {value}"
      }
    }
  ]
}
```

### Complex Alert Conditions

```
You: Alert me when Nvidia's RSI drops below 30 (oversold) AND volume is more than 2x the 20-day average — that might be a reversal signal

You: When the Bitcoin Fear & Greed Index drops below 20, log it to my notes
```

### Manage Alerts

```bash
blockcell alerts list
blockcell alerts delete "Apple below $150"
```

---

## Scenario 3: Automated Reports

### Daily Morning Brief

```
You: Set up a daily task at 8:30 AM to generate a pre-market brief and send it to my Telegram.

Include:
1. Yesterday's major index performance (S&P 500, Nasdaq, Dow)
2. Overnight futures and pre-market movers
3. Top news that may affect markets
4. My watchlist stocks (Apple, Nvidia, Tesla)
```

AI will:
1. Create a cron task (runs every day at 08:30)
2. Write the execution logic to call relevant APIs
3. Format a clean, readable report
4. Send it to your Telegram

### Crypto Daily Report

```
You: Every evening at 10 PM, send me a crypto market digest: BTC/ETH/SOL prices, 24h change, total market cap, and top DeFi protocol TVL changes
```

---

## Scenario 4: Portfolio Tracking

### Initialize Your Portfolio

Tell AI your positions (it will remember them):

```
You: Remember my stock portfolio:
- Apple (AAPL): 100 shares, cost basis $180
- Google (GOOGL): 50 shares, cost basis $170
- Nvidia (NVDA): 30 shares, cost basis $500

Remember my crypto portfolio:
- BTC: 0.5, average price $90,000
- ETH: 5, average price $3,200
```

### Real-Time P&L

```
You: Calculate my current total stock portfolio P&L

You: What is my crypto portfolio worth now? How has it changed since yesterday?
```

AI retrieves live prices, combines them with your stored positions, and calculates gains/losses.

### Weekly Review

```
You: Generate a weekly portfolio review:
- Performance of each position
- Comparison against the S&P 500
- Maximum drawdown and current unrealized gain
- Key items to watch next week
```

---

## Scenario 5: Crypto On-Chain Data

### Basic On-Chain Queries

```
You: What is the current Ethereum gas fee?

You: Check the ETH balance of this address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

You: What is USDC's total supply?
```

### DeFi Data

```
You: What is Uniswap V3's current TVL?

You: How much did Aave liquidate in the last 24 hours?

You: What is the current ETH/USDC price on Uniswap?
```

### Security Scanning

```
You: Check if this token contract is safe: 0x1234...
   (Look for rug pull risk, source code availability, holder concentration)
```

AI uses the `contract_security` tool (GoPlus API, free) to return a detailed security report.

---

## Scenario 6: Macro Data

```
You: What is the current US-Germany 10-year bond spread?

You: What did the latest CPI print come in at? How does it compare to estimates?

You: What is the latest EUR/USD rate? How has it trended recently?

You: What did the Fed say at their last meeting? What's the market impact?
```

---

## Configure Alpha Vantage API Key (Optional)

For US stock data and forex. Alpha Vantage offers a free key (5 requests/minute):

1. Register: [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Get your free key
3. Configure:

```json
{
  "providers": {
    "alpha_vantage": {
      "apiKey": "your-alpha-vantage-key"
    }
  }
}
```

Without a key, blockcell automatically falls back to Yahoo Finance.

---

## Configure CEX Exchange API (Optional)

For real account balances or trading:

```json
{
  "providers": {
    "binance": {
      "apiKey": "your-binance-api-key",
      "apiBase": "your-binance-api-secret"
    }
  }
}
```

> ⚠️ **Security**: Recommend setting an IP whitelist on your exchange API key, and only enabling read permissions unless you explicitly need trading functionality.

---

## Built-in Finance Skills

These skills come pre-installed — trigger them naturally:

| Skill | Example Trigger Phrases |
|-------|------------------------|
| `stock_monitor` | stock price, candlestick, technical indicators, fund flow |
| `bond_monitor` | treasury, yield curve, credit bonds, convertibles |
| `futures_monitor` | futures, open interest, basis, options |
| `crypto_onchain` | on-chain, DeFi, gas fee, stablecoins |
| `macro_monitor` | CPI, PMI, Fed, interest rates, forex |
| `daily_finance_report` | daily report, weekly digest, market summary |
| `portfolio_advisor` | portfolio, allocation, risk analysis |

---

*Previous: [Self-Evolution](./09_self_evolution.md)*
*Next: [Subagents & Concurrency](./11_subagents.md)*
