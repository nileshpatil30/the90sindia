<?php
/**
 * Template Name: 90s REWIND Portal
 *
 * The kids'-portal layout. Assign this template to a Page (Page Attributes →
 * Template) and that page renders the portal.
 *
 * Markup is unchanged from the static site's portal.html apart from the
 * cross-page links, which now resolve through WordPress. assets/js/portal.js
 * fills it in from the same config as the front page.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<div class="portal-scroll">
<div class="portal">

  <!-- ============ LEADERBOARD AD SLOT ============ -->
  <div class="ad ad--leaderboard">
    <div class="ad-label">ADVERTISEMENT</div>
    <div class="ad-face"><p>728 × 90 AD SLOT</p></div>
  </div>

  <!-- ============ MASTHEAD ============ -->
  <div class="masthead">
    <a class="wordmark" href="<?php echo esc_url( rewind_home_link() ); ?>">
      <span>
        <span class="wordmark-plate">90s REWIND</span>
        <span class="wordmark-sub">the90sindia.com</span>
      </span>
    </a>

    <div class="masthead-right">
      <nav class="tabs" aria-label="Main">
        <a class="tab is-current" href="<?php the_permalink(); ?>"><span>ALL REWIND</span></a>
        <a class="tab" href="#my90s"><span>my90s</span></a>
        <a class="tab" href="<?php echo esc_url( rewind_home_link( 'arcade' ) ); ?>"><span>ARCADE</span></a>
        <a class="tab" href="<?php echo esc_url( rewind_home_link( 'hit-parade' ) ); ?>"><span>BUZZ</span></a>
        <a class="tab" href="<?php echo esc_url( rewind_home_link( 'adda' ) ); ?>"><span>ADDA</span></a>
        <a class="tab" href="<?php echo esc_url( rewind_home_link( 'photo-wall' ) ); ?>"><span>myWORLD</span></a>
        <a class="tab" href="<?php echo esc_url( rewind_home_link( 'vault' ) ); ?>"><span>VAULT</span></a>
      </nav>

      <div class="subnav">
        <a href="<?php echo esc_url( rewind_home_link( 'shows' ) ); ?>">▶ TV SHOWS</a>
        <a href="<?php echo esc_url( rewind_home_link( 'channel-guide' ) ); ?>">▶ TV SCHEDULE</a>
        <form class="subnav-search" id="search-form" role="search">
          <label class="visually-hidden" for="search-input">Search the90sindia.com</label>
          <input type="text" id="search-input" placeholder="SEARCH THE90SINDIA.COM">
          <button type="submit">▶ GO</button>
        </form>
      </div>
    </div>
  </div>

  <!-- ============ AVATAR CAROUSEL ============ -->
  <div class="carousel">
    <button type="button" class="carousel-paddle" id="carousel-prev" aria-label="Scroll left">◀</button>
    <div class="carousel-track" id="carousel-track"></div>
    <button type="button" class="carousel-paddle" id="carousel-next" aria-label="Scroll right">▶</button>
  </div>

  <!-- ============ BODY ============ -->
  <div class="body-grid">

    <!-- ---- LEFT RAIL ---- -->
    <div class="rail-left">

      <div class="rail-box">
        <p class="rail-head">
          <span id="rail-featured-name">Loading…</span>
          <a href="#" id="rail-featured-go">▶GO</a>
        </p>
        <div class="rail-featured">
          <span class="rail-thumb" id="rail-featured-thumb"></span>
          <p id="rail-featured-blurb">Loading channel…</p>
        </div>
      </div>

      <div class="rail-onnext">
        <div class="rail-onnext-bar">ON REWIND NEXT: ▶</div>
        <div class="rail-onnext-body">
          <strong id="rail-next-title">Loading…</strong>
          <span id="rail-next-meta"></span>
        </div>
      </div>

      <a class="rail-cta" href="<?php echo esc_url( rewind_home_link( 'hero' ) ); ?>">▶ TAKE THE POLL!</a>

      <div id="my90s">
        <div class="login-plate">
          <strong>my90s</strong>
          <span id="login-date">—</span>
        </div>
        <div class="login-box">
          <form id="login-form">
            <label for="login-nick">NickName:</label>
            <input type="text" id="login-nick" autocomplete="username">
            <label for="login-pass">Password:</label>
            <input type="password" id="login-pass" autocomplete="current-password">
            <p class="login-remember">
              <input type="checkbox" id="login-remember">
              <label for="login-remember">Remember me.</label>
            </p>
            <button type="submit" class="rail-cta">▶ LOG IN!</button>
          </form>
          <p class="login-note" id="login-note">▶ Need a NickName and password?</p>
        </div>
      </div>

      <p class="rail-shout">Check out what's in my90s now:</p>

      <div id="rail-promos"></div>

      <p class="rail-shout">…AND MUCH MORE!</p>

      <div class="rail-filler" aria-hidden="true"></div>

      <a class="rail-cta" href="<?php echo esc_url( rewind_home_link( 'adda' ) ); ?>">▶ Message Boards</a>
    </div>

    <!-- ---- CENTRE ---- -->
    <div class="centre">
      <div class="stage" id="stage">
        <iframe
          id="stage-frame"
          src=""
          title="90s REWIND player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"></iframe>
        <div class="stage-empty" id="stage-empty">
          <p class="big">📼</p>
          <p>No video ID yet for this channel.</p>
          <p class="small">Add one in <code>js/config.js</code> — see README.</p>
        </div>
      </div>

      <div class="panel">
        <div class="card-grid" id="card-grid"></div>
        <div class="badge-strip" id="badge-strip"></div>
      </div>
    </div>

    <!-- ---- RIGHT RAIL ---- -->
    <div class="rail-right">
      <div class="rail-right-label">ADVERTISEMENT</div>
      <div class="rail-right-face"><p>160 × 600<br>AD SLOT</p></div>
    </div>

  </div>

  <!-- ============ FOOTER BLOCK ============ -->
  <div class="footer-grid">
    <div class="footer-links">
      <a class="footer-link" href="<?php echo esc_url( rewind_home_link( 'hit-parade' ) ); ?>">▶ REWIND SHOP</a>
      <div class="other-sites">
        <b>OUR OTHER SITES</b>
        <div class="other-sites-row">
          <span style="background:#ee3d8f;">DD</span>
          <span style="background:#23b8d4;">CRIC</span>
          <span style="background:#7a3ea8;">WWF</span>
          <span style="background:#f47b20;">HITS</span>
        </div>
      </div>
      <a class="footer-link" href="<?php echo esc_url( rewind_home_link( 'adda' ) ); ?>">▶ PRIVACY POLICY</a>
    </div>

    <div class="footer-links">
      <div class="showstrip">
        <p class="showstrip-title">CLICK ON YOUR FAVORITE SHOW!</p>
        <div class="showstrip-row" id="showstrip-row"></div>
      </div>
      <p class="terms">
        <a href="<?php echo esc_url( rewind_home_link() ); ?>">▶ Please read our Terms &amp; Conditions.</a>
        © <span id="footer-year"></span> the90sindia.com — a fan nostalgia project.
      </p>
    </div>
  </div>

</div>
</div>

<div class="seal">
  <div class="seal-box">
    <span class="seal-mark">📼</span>
    <span>FAN NOSTALGIA PROJECT<br>All videos stream from official channels</span>
  </div>
</div>

<?php
get_footer();
