<?php
/**
 * Logic checks for the theme's pure functions.
 *
 * Run with:  php wordpress/tests/test-logic.php
 *
 * WordPress is stubbed just enough to load the two files under test, so these
 * run anywhere PHP does — no database, no WordPress install. They cover the
 * YouTube URL parsing an editor's paste goes through, and the shape of the
 * config bridge's output. Exits non-zero on any failure.
 */

/* Minimal WordPress stubs so the pure logic can be exercised without a DB. */
define( 'ABSPATH', __DIR__ );
function wp_json_encode( $d, $f = 0 ) { return json_encode( $d, $f ); }
function esc_url_raw( $u ) { return $u; }
function wp_kses_post( $s ) { return $s; }
function __( $s, $d = '' ) { return $s; }
function add_action() {}
function home_url( $p = '/' ) { return 'https://the90sindia.com' . $p; }
function get_theme_mod( $k, $d = '' ) { return $d; }
function get_posts( $a ) { return array(); }
function get_the_post_thumbnail_url() { return ''; }
function has_excerpt() { return false; }
function wp_strip_all_tags( $s ) { return strip_tags( $s ); }
function strip_shortcodes( $s ) { return $s; }
function sanitize_text_field( $s ) { return trim( strip_tags( $s ) ); }
function wp_unslash( $s ) { return $s; }

require __DIR__ . '/../the90sindia/inc/chrome.php';
require __DIR__ . '/../the90sindia/inc/config.php';
require __DIR__ . '/../the90sindia/inc/meta.php';

$fail = 0;
function check( $label, $got, $want ) {
	global $fail;
	if ( $got === $want ) { echo "  ok   $label\n"; }
	else { echo "  FAIL $label — got " . var_export( $got, true ) . ", want " . var_export( $want, true ) . "\n"; $fail++; }
}

echo "Video ID extraction (what an editor actually pastes):\n";
check( 'bare id',      rewind_extract_video_id( 'BvZ2KQuCTds' ), 'BvZ2KQuCTds' );
check( 'watch url',    rewind_extract_video_id( 'https://www.youtube.com/watch?v=BvZ2KQuCTds' ), 'BvZ2KQuCTds' );
check( 'watch + args', rewind_extract_video_id( 'https://www.youtube.com/watch?v=BvZ2KQuCTds&t=42s' ), 'BvZ2KQuCTds' );
check( 'share link',   rewind_extract_video_id( 'https://youtu.be/BvZ2KQuCTds' ), 'BvZ2KQuCTds' );
check( 'share + args', rewind_extract_video_id( 'https://youtu.be/BvZ2KQuCTds?si=abc' ), 'BvZ2KQuCTds' );
check( 'embed url',    rewind_extract_video_id( 'https://www.youtube.com/embed/BvZ2KQuCTds' ), 'BvZ2KQuCTds' );
check( 'whitespace',   rewind_extract_video_id( '  BvZ2KQuCTds  ' ), 'BvZ2KQuCTds' );
check( 'empty',        rewind_extract_video_id( '' ), '' );
check( 'junk rejected',rewind_extract_video_id( 'not a video' ), '' );

echo "\nPlaylist ID extraction:\n";
check( 'playlist url', rewind_extract_playlist_id( 'https://www.youtube.com/playlist?list=PL0CaUqi81mPnxS08v67qqzJawvLRakSud' ), 'PL0CaUqi81mPnxS08v67qqzJawvLRakSud' );
check( 'bare id',      rewind_extract_playlist_id( 'PL0CaUqi81mPnxS08v67qqzJawvLRakSud' ), 'PL0CaUqi81mPnxS08v67qqzJawvLRakSud' );
check( 'empty',        rewind_extract_playlist_id( '' ), '' );

echo "\nConfig bridge emits parseable globals:\n";
$js = rewind_config_inline_script();
foreach ( array( 'REWIND_HOME_URL', 'TICKER_TEXT', 'CHANNELS', 'SHOWS', 'TRACKS', 'SPORTS_CARDS', 'POLL', 'PINTEREST_BOARD_URL' ) as $g ) {
	check( "declares $g", (bool) preg_match( '/\bvar ' . $g . ' = /', $js ), true );
}
check( 'declares REWIND_CHROME', (bool) preg_match( '/\bvar REWIND_CHROME = /', $js ), true );
check( 'no const (safe to re-declare)', strpos( $js, 'const ' ), false );

echo "\nArtwork slots — every image on the portal is uploadable:\n";
$chrome = rewind_chrome_config();
foreach ( array( 'logo', 'promo_1', 'promo_2', 'badge_1', 'badge_2', 'badge_3', 'badge_4', 'ad_top', 'ad_side' ) as $slot ) {
	check( "slot $slot exists", isset( $chrome[ $slot ] ), true );
	check( "slot $slot has image/text/href", array_keys( $chrome[ $slot ] ), array( 'image', 'text', 'href' ) );
}
check( 'slot count', count( $chrome ), 9 );

echo "\n" . ( $fail ? "$fail check(s) FAILED\n" : "All checks passed.\n" );
exit( $fail ? 1 : 0 );
