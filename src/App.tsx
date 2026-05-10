import './App.css'

export default function App() {
  return (
    <div className="site">
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">Queckfeldt223333 & Jonsén King!</div>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      {/* a11y issue: button has no label */}
      <button className="nav-menu-btn">☰</button>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        {/* a11y issue: image has no alt text */}
        <img src="https://i.pravatar.cc/120?img=11" className="hero-avatar" />
        <h1 className="hero-title">Hi, I'm Alex Morgan</h1>
        <p className="hero-sub">Frontend Developer · UI/UX Enthusiast · Open Source Contributor</p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">View My Work</a>
          {/* a11y issue: low contrast text on light background */}
          <a href="#contact" className="btn-ghost">Get In Touch</a>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>I'm a frontend developer with 5 years of experience building fast, accessible, and beautiful web applications. I love turning complex problems into simple, clean interfaces.</p>
            <p style={{ marginTop: '1rem' }}>When I'm not coding, you'll find me hiking, reading sci-fi, or contributing to open source projects.</p>
          </div>
          <div className="skills">
            <h3 className="skills-title">Skills</h3>
            <div className="skill-tags">
              {['React', 'TypeScript', 'Node.js', 'CSS', 'Figma', 'GraphQL', 'Next.js', 'Testing'].map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const projects = [
    {
      title: 'Budget Tracker',
      description: 'A personal finance app with real-time charts and expense categories.',
      tags: ['React', 'TypeScript', 'Chart.js'],
      link: '#',
    },
    {
      title: 'Weather Dashboard',
      description: 'Live weather data from 50,000+ cities with hourly and weekly forecasts.',
      tags: ['React', 'OpenWeather API', 'CSS Grid'],
      link: '#',
    },
    {
      title: 'Markdown Editor',
      description: 'A split-pane markdown editor with live preview and local autosave.',
      tags: ['React', 'Marked.js', 'LocalStorage'],
      link: '#',
    },
  ]

  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.map(p => (
            <div key={p.title} className="project-card">
              {/* a11y issue: div used as clickable element instead of button/link */}
              <div className="project-img" onClick={() => window.open(p.link)} />
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>
                <div className="project-tags">
                  {p.tags.map(t => <span key={t} className="project-tag">{t}</span>)}
                </div>
                <a href={p.link} className="project-link">View Project →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container contact-container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-sub">Have a project in mind? I'd love to hear about it.</p>
        <form className="contact-form">
          {/* a11y issue: inputs have no associated labels */}
          <input type="text" placeholder="Your name" className="form-input" />
          <input type="email" placeholder="Your email" className="form-input" />
          <textarea placeholder="Your message" className="form-textarea" rows={5} />
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 Alex Morgan. Built with React.</p>
      <div className="footer-links">
        <a href="#">GitHub</a>
        <a href="#">LinkedIn</a>
        <a href="#">Twitter</a>
      </div>
    </footer>
  )
}
