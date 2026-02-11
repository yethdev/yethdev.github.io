import { useEffect, useRef, useState } from 'react'
import './Donate.css'

const wallets = [
  { label: 'BTC (preferred)', addr: 'bc1q949cz62t2dl8fg6y2wpnwmrvgwlk5xvax8y0ey' },
  { label: 'ETH', addr: '0xD4C94761112CF1b933CA67F0886aF525848eD914' },
  { label: 'TRON', addr: 'TM8UpozLRGSMWRJjCTqnRNcgzB5NyZjhuZ' },
]

export default function Donate() {
  const ref = useRef(null)
  const [copied, setCopied] = useState(null)

  useEffect(() => { ref.current?.classList.add('page-visible') }, [])

  function copy(addr, i) {
    navigator.clipboard.writeText(addr)
    setCopied(i)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="page page-enter" ref={ref}>
      <section className="donate-hero">
        <h1>Donate</h1>
        <p>
          if you wanna help me keep stuff up here are my wallet addresses.
          anything helps
        </p>
      </section>

      <section className="wallets">
        {wallets.map((w, i) => (
          <div key={w.label} className="wallet">
            <span className="wallet-label">{w.label}</span>
            <div className="wallet-addr" onClick={() => copy(w.addr, i)}>
              <code>{w.addr}</code>
              <span className="wallet-copy">{copied === i ? 'copied!' : 'click to copy'}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
