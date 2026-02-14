import { useState, useEffect, useRef } from 'react'
import { Github } from 'lucide-react'
import Card from '../components/Card'
import Tag from '../components/Tag'
import './Projects.css'

const _d = (s) => atob(s)

const _onYeth = () => {
  const h = location.hostname
  return h === 'yeth.dev' || h === 'www.yeth.dev' || h === 'localhost'
}

const _projectUrl = (p) => {
  if (_onYeth() && p.prodLink) return p.prodLink
  if (p.sub) return `https://${p.sub}.${location.hostname}`
  return p.link || p.github
}

const PROJECTS = [
  {
    name: 'valeeze',
    description: 'AI item valuations with realtime market prices and profit estimates for resellers. ik its vibe coded this was a test that i forgot to end',
    tags: ['react', 'AI', 'vibe coded sry'],
    status: 'stable',
    prodLink: 'https://valeeze.com',
    sub: 'valeeze',
    category: 'ai',
  },
  {
    name: 'flight search',
    description: 'kid-safe search engine with ai overviews, no logging, and a familiar google-like interface. just set it as your default and forget about it',
    tags: ['kid-safe', 'privacy', 'searxng'],
    status: 'stable',
    prodLink: 'https://flightsearch.kids',
    sub: 'search',
    category: ['infrastructure', 'forks'],
  },
  {
    name: 'linkcheck',
    description: _d('dXJsIGFjY2Vzc2liaWxpdHkgY2hlY2tlciwgdGVzdHMgaWYgc2l0ZXMgYXJlIHJlYWNoYWJsZSBmcm9tIGRpZmZlcmVudCBuZXR3b3Jrcy4gc3VwcG9ydHMgYmF0Y2ggb2YgdXAgdG8gMSwwMDAgdXJscyBpbiB1bmRlciAyMCBzZWNvbmRzLiBkaXNjb250aW51ZWQgYXMgb2YgMi8xMC8yNQ=='),
    tags: ['discontinued'],
    status: 'discontinued',
    link: 'https://github.com/yethdev/linkcheck',
    category: ['security', 'other'],
  },
  {
    name: 'movies that dont waste my time',
    description: 'movie library with aggregated reviews from multiple sources. forked and added support for free APIs',
    tags: ['fork', 'APIs', 'entertainment'],
    status: 'stable',
    link: 'https://github.com/yethdev/movies-that-dont-waste-my-time/tree/main',
    category: 'forks',
  },
]

const FILTER_LABELS = { all: 'all', security: 'security', networking: 'networking', ai: 'AI', infrastructure: 'infrastructure', forks: 'forks', other: 'other' }
const FILTERS = Object.keys(FILTER_LABELS)

const statusVariant = (s) => s === 'active' ? 'green' : s === 'experiment' || s === 'discontinued' ? 'muted' : 'default'

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const ref = useRef(null)
  useEffect(() => { ref.current?.classList.add('page-visible') }, [])

  const shown = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => Array.isArray(p.category) ? p.category.includes(filter) : p.category === filter)

  return (
    <div className="page page-enter" ref={ref}>
      <section className="projects-hero">
        <h1>Projects</h1>
        <p>
          Stuff I've built or I'm working on. More on my{' '}
          <a href="https://github.com/yethdev" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
        <p className="projects-note">
          everything is self-hosted on my own computer, so sometimes stuff goes down
          when I'm working on it, restarting, or during a power outage. saving up for a vps, donate <a href="https://yeth.dev/donate" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      </section>

      <section>
        <div className="filter-bar">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="card-grid">
          {shown.map(project => (
            <Card key={project.name} href={_projectUrl(project)} className="interactive project-card">
              <div className="project-header">
                <h3 className="mono">{project.name}</h3>
                <Tag variant={statusVariant(project.status)}>{project.status}</Tag>
              </div>
              <p>{project.description}</p>
              <div className="project-footer">
                <div className="tags">
                  {project.tags.map(t => <Tag key={t}>{t}</Tag>)}
                </div>
{project.github && (
                  <div className="project-links">
                    <Github size={16} />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {shown.length === 0 && (
          <p className="no-results">Nothing here yet. Check back later or try another filter.</p>
        )}
      </section>
    </div>
  )
}
