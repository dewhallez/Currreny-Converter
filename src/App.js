import React, { useEffect, useState }from "react";
import './App.css';
import CurrencyRow from "./CurrencyRow";

const BASE_URL = "http://api.exchangeratesapi.io/v1/latest?access_key=c8989c4ce104d09e4afe5404a4ba6cac&format=1"

function App() {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrecny, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
      fromAmount = amount
      toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrecny != null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrecny}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrecny]))
    }
  }, [fromCurrency, toCurrecny])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Get Exchange Rate</h1>
      <CurrencyRow 
        currencyOptions= {currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
        />
      <div className="equals">=</div>
      <CurrencyRow 
        currencyOptions= {currencyOptions}
        selectedCurrency={toCurrecny}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
  </>
  );
}

export default App;
