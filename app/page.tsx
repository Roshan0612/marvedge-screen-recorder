'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Screen recording, without the noise</p>
          <h1>Record. <em>Explain.</em> Share.</h1>
          <p className="hero-description">
            Capture your screen, explain your ideas, and share crystal-clear recordings in seconds.
          </p>
          <div className="hero-actions">
            <Link href="/record" className="primary-action">Start recording <span aria-hidden="true">&rarr;</span></Link>
            <a href="#workflow" className="secondary-action">See how it works <span aria-hidden="true">&#8595;</span></a>
          </div>
          <p className="hero-note"><span aria-hidden="true">&#9679;</span> Works in your browser with screen and microphone capture</p>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span /><span /><span /></div>
      </section>

      <section className="product-stage" aria-label="Marvedge recorder preview">
        <div className="product-window">
          <div className="window-bar">
            <div className="window-dots"><i /><i /><i /></div>
            <div className="window-title"><span className="mini-mark">M</span> marvedge / new recording</div>
            <div className="window-status"><span /> Ready</div>
          </div>
          <div className="window-body">
            <aside className="preview-sidebar"><span className="sidebar-logo">M</span><span className="sidebar-line active" /><span className="sidebar-line" /><span className="sidebar-line" /><span className="sidebar-spacer" /><span className="sidebar-avatar">R</span></aside>
            <div className="preview-content">
              <div className="preview-heading"><div><span className="preview-kicker">WORKSPACE / 01</span><strong>New recording</strong></div><span className="preview-date">Today, 10:42 AM</span></div>
              <div className="screen-canvas"><div className="canvas-topline"><span className="canvas-code">&lt;marvedge /&gt;</span><span className="canvas-pill">PREVIEW</span></div><div className="canvas-code-lines"><span /><span /><span className="short" /><span /><span className="medium" /></div><div className="cursor" /></div>
              <div className="timeline"><div className="timeline-label"><span className="record-dot" /> Recording track <small>00:18</small></div><div className="timeline-track"><span /><b /></div><div className="preview-controls"><span>&#9654;</span><span className="control-time">00:00 / 00:18</span><span className="control-end">Trim &nbsp; Share</span></div></div>
            </div>
          </div>
        </div>
        <p className="stage-caption"><span>01</span> A focused space for better technical communication</p>
      </section>

      <section className="home-section capability-section">
        <div className="section-heading"><p className="eyebrow">A shorter path from thought to clarity</p><h2>Everything you need to make the point.</h2></div>
        <div className="capability-grid">
          <article className="capability-card featured"><span className="card-number">01</span><div className="card-icon">&#9673;</div><h3>Screen + audio capture</h3><p>Record your display and microphone together, right from the browser.</p><Link href="/record" aria-label="Start a screen and audio recording">Open recorder <span>&rarr;</span></Link></article>
          <article className="capability-card"><span className="card-number">02</span><div className="card-icon">&#10038;</div><h3>Trim the signal</h3><p>Set precise start and end points before your recording leaves the workspace.</p></article>
          <article className="capability-card"><span className="card-number">03</span><div className="card-icon">&#8599;</div><h3>Share a clean link</h3><p>Upload a finished clip and send a focused share page to your team.</p><Link href="/record" aria-label="Upload and share a recording">Make a clip <span>&rarr;</span></Link></article>
        </div>
      </section>

      <section className="home-section workflow-section" id="workflow">
        <div className="workflow-intro"><p className="eyebrow">The workflow</p><h2>Less back-and-forth.<br /><em>More getting it.</em></h2></div>
        <div className="workflow-list"><div className="workflow-step"><span>01</span><div><h3>Record</h3><p>Capture the screen and your voice in one take.</p></div></div><div className="workflow-connector" /><div className="workflow-step"><span>02</span><div><h3>Review</h3><p>Watch it back and trim the parts that do not matter.</p></div></div><div className="workflow-connector" /><div className="workflow-step"><span>03</span><div><h3>Share</h3><p>Upload the final clip and give your idea a destination.</p></div></div></div>
      </section>

      <section className="use-case-band"><div><p className="eyebrow">Made for the moments that need context</p><h2>Show, do not just tell.</h2></div><div className="use-case-list"><span>Bug reports</span><span>Code walkthroughs</span><span>Product demos</span><span>Team updates</span></div></section>

      <section className="final-cta"><p className="eyebrow">Ready when you are</p><h2>Explain it better<br /><em>with Marvedge.</em></h2><p>Record your screen and make the next conversation shorter.</p><Link href="/record" className="primary-action">Start recording <span aria-hidden="true">&rarr;</span></Link></section>
    </main>
  )
}
