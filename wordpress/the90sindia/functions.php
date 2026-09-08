<?php
/**
 * Theme bootstrap.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

define( 'REWIND_VERSION', '1.0.0' );

require_once get_template_directory() . '/inc/cpt.php';
require_once get_template_directory() . '/inc/meta.php';
require_once get_template_directory() . '/inc/config.php';
require_once get_template_directory() . '/inc/seed.php';

/**
 * Theme supports.
 */
function rewind_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'style', 'script' ) );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'customize-selective-refresh-widgets' );
	load_theme_textdomain( 'the90sindia', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'rewind_setup' );

/**
 * Styles and scripts.
 *
 * The portal template and the main page share a font and a config payload but
 * load different stylesheets and different renderers, so each page ships only
 * what it uses.
 */
function rewind_enqueue() {
	$dir      = get_template_directory_uri();
	$is_portal = is_page_template( 'template-portal.php' );

	wp_enqueue_style(
		'rewind-fonts',
		'https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700&display=swap',
		array(),
		null
	);

	/* The theme's own style.css carries only the WordPress header; the real
	   stylesheets are the ones ported from the static site. */
	wp_enqueue_style( 'rewind-theme', get_stylesheet_uri(), array(), REWIND_VERSION );

	if ( $is_portal ) {
		wp_enqueue_style( 'rewind-portal', $dir . '/assets/css/portal.css', array( 'rewind-fonts' ), REWIND_VERSION );
		wp_enqueue_script( 'rewind-portal', $dir . '/assets/js/portal.js', array(), REWIND_VERSION, true );
		$handle = 'rewind-portal';
	} else {
		wp_enqueue_style( 'rewind-main', $dir . '/assets/css/style.css', array( 'rewind-fonts' ), REWIND_VERSION );
		wp_enqueue_script( 'rewind-app', $dir . '/assets/js/app.js', array(), REWIND_VERSION, true );
		$handle = 'rewind-app';
	}

	/* Stands in for the old js/config.js — same globals, sourced from wp-admin. */
	wp_add_inline_script( $handle, rewind_config_inline_script(), 'before' );
}
add_action( 'wp_enqueue_scripts', 'rewind_enqueue' );

/**
 * Points the portal template's cross-page links at the real home URL.
 *
 * @param string $fragment Section id, without the hash.
 * @return string
 */
function rewind_home_link( $fragment = '' ) {
	$url = home_url( '/' );
	return $fragment ? $url . '#' . $fragment : $url;
}

/**
 * Flushes rewrite rules once after activation so the custom types resolve.
 */
function rewind_activate() {
	rewind_register_post_types();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'rewind_activate' );

/**
 * Nudges a fresh install towards the import screen rather than an empty site.
 */
function rewind_setup_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$screen = get_current_screen();
	if ( $screen && 'tools_page_rewind-seed' === $screen->id ) {
		return;
	}

	$has_channels = get_posts(
		array(
			'post_type'      => 'rewind_channel',
			'posts_per_page' => 1,
			'post_status'    => 'any',
			'fields'         => 'ids',
		)
	);

	if ( $has_channels ) {
		return;
	}

	echo '<div class="notice notice-info"><p><strong>90s REWIND</strong> — ';
	printf(
		wp_kses(
			/* translators: %s: URL of the import screen. */
			__( 'no channels yet. <a href="%s">Import the starter content</a> to fill the site with the shows, channels and tracks it shipped with.', 'the90sindia' ),
			array( 'a' => array( 'href' => array() ) )
		),
		esc_url( admin_url( 'tools.php?page=rewind-seed' ) )
	);
	echo '</p></div>';
}
add_action( 'admin_notices', 'rewind_setup_notice' );
