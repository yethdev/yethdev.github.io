import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import Tag from '../components/Tag'
import './Home.css'

const _d = (s) => atob(s)
const heading = "Hey, I'm yeth."
const _host = () => {
  const h = location.hostname
  if (h === 'localhost' || h.endsWith('.github.io')) return 'yeth.dev'
  return h.split('.').slice(-2).join('.')
}

export default function Home() {
  const ref = useRef(null)
  const [typed, setTyped] = useState(0)

  useEffect(() => { ref.current?.classList.add('page-visible') }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        setTyped(prev => {
          if (prev >= heading.length) { clearInterval(id); return prev }
          return prev + 1
        })
      }, 100)
      return () => clearInterval(id)
    }, 300)
    return () => clearTimeout(delay)
  }, [])

  return (
    <div className="page page-enter" ref={ref}>
      <section className="hero">
        <h1 className="hero-title">
          {heading.slice(0, Math.min(typed, 9))}
          {typed > 9 && <span className="accent">{heading.slice(9, typed)}</span>}
        </h1>
        <p className="hero-tagline">wannabe full stack web/cybersecurity developer</p>

        <p className="hero-subtitle">
          I like breaking things and fixing them. Really into{' '}
          cybersecurity, networking,
          and recently AI/ML. Self-taught and always working on a project
        </p>

        <div className="hero-cta">
          <Link to="/projects" className="btn btn-primary">
            Check out my projects <ArrowRight size={16} />
          </Link>
          <Link to="/about" className="btn btn-ghost">About me</Link>
        </div>
      </section>

      <section>
        <h2>What I'm into</h2>
        <ul className="interests">
          <li><strong>Cybersecurity</strong>: CTFs, pentesting, etc. I do hackthebox sometimes</li>
          <li><strong>Networking</strong>: homelabs, protocol stuff, packet analysis. have an OPNSense box thats really good</li>
          <li><strong>AI / ML</strong>: mostly trying to apply ML to security problems like log analysis and anomaly detection. still not great</li>
        </ul>
      </section>

      <section className="recent-section">
        <div className="section-header">
          <h2>Recent projects</h2>
          <Link to="/projects" className="see-all">See all <ChevronRight size={16} /></Link>
        </div>
        <div className="card-grid">
          <Card href="https://github.com/yethdev/linkcheck" className="interactive">
            <div className="project-header">
              <h3 className="mono">linkcheck</h3>
              <Tag variant="muted">discontinued</Tag>
            </div>
            <p>{_d('Y2hlY2tzIGlmIGEgdXJsIGlzIGJsb2NrZWQgYnkgc2Nob29sIHdlYiBmaWx0ZXJzLiBzdXBwb3J0cyBiYXRjaCBvZiB1cCB0byAxLDAwMCB1cmxzIGFuZCBmaW5pc2hlcyBhbGwgaW4gdW5kZXIgMjAgc2Vjb25kcy4gZGlzY29udGludWVkIGFzIG9mIDIvMTAvMjUgZHVlIHRvIGxlZ2FsIHJlYXNvbnMu')}</p>
            <div className="tags">
              <Tag variant="muted">discontinued</Tag>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
