<?php
/**
 * Config bridge — turns WordPress content back into the exact globals the
 * front-end scripts already expect.
 *
 * assets/js/app.js and assets/js/portal.js are byte-identical to the static
 * site's versions. They read CHANNELS, SHOWS, TRACKS, SPORTS_CARDS, POLL and
 * TICKER_TEXT off the window, so this file simply prints those same globals
 * ahead of them, sourced from the editor instead of a checked-in file.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

/**
 * Fetches every published post of a type in admin-defined order.
 *
 * @param string $type Post type.
 * @return WP_Post[]
 */
function rewind_get_items( $type ) {
	return get_posts(
		array(
			'post_type'        => $type,
			'posts_per_page'   => -1,
			'post_status'      => 'publish',
			'orderby'          => 'menu_order title',
			'order'            => 'ASC',
			'suppress_filters' => false,
		)
	);
}

/**
 * The tile artwork URL for a post, or an empty string when none is set.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function rewind_tile_image( $post_id ) {
	$url = get_the_post_thumbnail_url( $post_id, 'medium' );
	return $url ? $url : '';
}

/**
 * Plain-text body copy for a post, matching the one-line `desc` the cards
 * used to carry. The editor may format freely; the cards take text.
 *
 * @param WP_Post $post Post object.
 * @return string
 */
function rewind_plain_body( $post ) {
	$raw = has_excerpt( $post ) ? $post->post_excerpt : $post->post_content;
	return trim( wp_strip_all_tags( strip_shortcodes( $raw ) ) );
}

/**
 * Assembles the whole front-end config from WordPress content.
 *
 * @return array
 */
function rewind_build_config() {

	$channels    = array();
	$channel_ids = array();

	foreach ( rewind_get_items( 'rewind_channel' ) as $post ) {
		$channel_ids[ $post->ID ] = $post->post_title;

		$entry = array(
			'num'   => (string) get_post_meta( $post->ID, '_rw_number', true ),
			'name'  => $post->post_title,
			'video' => (string) get_post_meta( $post->ID, '_rw_video', true ),
			'desc'  => rewind_plain_body( $post ),
			'image' => rewind_tile_image( $post->ID ),
		);

		$playlist = (string) get_post_meta( $post->ID, '_rw_playlist', true );
		if ( '' !== $playlist ) {
			$entry['playlistId'] = $playlist;
		}

		$channels[] = $entry;
	}

	$shows = array();
	foreach ( rewind_get_items( 'rewind_show' ) as $post ) {
		$channel_id = (int) get_post_meta( $post->ID, '_rw_channel', true );

		$entry = array(
			'title'    => $post->post_title,
			'channel'  => isset( $channel_ids[ $channel_id ] ) ? $channel_ids[ $channel_id ] : '',
			'category' => (string) get_post_meta( $post->ID, '_rw_category', true ),
			'tagColor' => (string) get_post_meta( $post->ID, '_rw_tag_color', true ),
			'desc'     => rewind_plain_body( $post ),
			'video'    => (string) get_post_meta( $post->ID, '_rw_video', true ),
			'image'    => rewind_tile_image( $post->ID ),
		);

		$playlist = (string) get_post_meta( $post->ID, '_rw_playlist', true );
		if ( '' !== $playlist ) {
			$entry['playlistId'] = $playlist;
		}

		$shows[] = $entry;
	}

	$tracks = array();
	foreach ( rewind_get_items( 'rewind_track' ) as $post ) {
		$tracks[] = array(
			'title'  => $post->post_title,
			'artist' => (string) get_post_meta( $post->ID, '_rw_artist', true ),
			'video'  => (string) get_post_meta( $post->ID, '_rw_video', true ),
			'image'  => rewind_tile_image( $post->ID ),
		);
	}

	$vault = array();
	foreach ( rewind_get_items( 'rewind_vault' ) as $post ) {
		$vault[] = array(
			'title' => $post->post_title,
			'label' => (string) get_post_meta( $post->ID, '_rw_label', true ),
			'note'  => rewind_plain_body( $post ),
			'theme' => (string) get_post_meta( $post->ID, '_rw_theme', true ),
			'image' => rewind_tile_image( $post->ID ),
		);
	}

	$poll_options = array_values(
		array_filter(
			array_map( 'trim', explode( "\n", (string) get_theme_mod( 'rewind_poll_options', "DD RETRO\nWWF ARENA\nHIT MUSIC\nCRICKET CORNER" ) ) )
		)
	);

	return array(
		'ticker'  => (string) get_theme_mod( 'rewind_ticker', rewind_default_ticker() ),
		'channels' => $channels,
		'shows'   => $shows,
		'tracks'  => $tracks,
		'vault'   => $vault,
		'poll'    => array(
			'question' => (string) get_theme_mod( 'rewind_poll_question', 'Which channel do you flip to first?' ),
			'options'  => $poll_options,
		),
		'pinterest' => (string) get_theme_mod( 'rewind_pinterest', '' ),
	);
}

/**
 * Default ticker copy, used until the Customizer value is set.
 *
 * @return string
 */
function rewind_default_ticker() {
	return '📼 NOW STREAMING: 90s REWIND is LIVE!  •  🏏 Relive India\'s greatest World Cup moments in the Vault  •  '
		. '🎵 New tracks added to the Hit Parade jukebox  •  🕹️ High score in the Arcade — can you beat it?  •  '
		. '📺 Flip channels above to time-travel through 90s India  •  ';
}

/**
 * Prints the config as the globals the scripts expect.
 *
 * Declared with `var` rather than `const` so a re-declaration cannot fatal the
 * page, and JSON-encoded so quotes and non-ASCII copy survive intact.
 *
 * @return string
 */
function rewind_config_inline_script() {
	$config = rewind_build_config();

	$flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP;

	return 'var REWIND_CHROME = ' . wp_json_encode( rewind_chrome_config(), $flags ) . ';' . "\n"
		. 'var REWIND_HOME_URL = ' . wp_json_encode( home_url( '/' ), $flags ) . ';' . "\n"
		. 'var TICKER_TEXT = ' . wp_json_encode( $config['ticker'], $flags ) . ';' . "\n"
		. 'var CHANNELS = ' . wp_json_encode( $config['channels'], $flags ) . ';' . "\n"
		. 'var SHOWS = ' . wp_json_encode( $config['shows'], $flags ) . ';' . "\n"
		. 'var TRACKS = ' . wp_json_encode( $config['tracks'], $flags ) . ';' . "\n"
		. 'var SPORTS_CARDS = ' . wp_json_encode( $config['vault'], $flags ) . ';' . "\n"
		. 'var POLL = ' . wp_json_encode( $config['poll'], $flags ) . ';' . "\n"
		. 'var PINTEREST_BOARD_URL = ' . wp_json_encode( $config['pinterest'], $flags ) . ';';
}

/**
 * Site-wide settings that were loose values at the top of js/config.js.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function rewind_customize_register( $wp_customize ) {

	$wp_customize->add_section(
		'rewind_settings',
		array(
			'title'       => __( '90s REWIND', 'the90sindia' ),
			'priority'    => 30,
			'description' => __( 'Ticker, poll and photo wall settings. Channels, shows, tracks and vault cards are edited from their own menus.', 'the90sindia' ),
		)
	);

	$fields = array(
		'rewind_ticker'        => array( __( 'Ticker text', 'the90sindia' ), 'textarea', rewind_default_ticker() ),
		'rewind_poll_question' => array( __( 'Poll question', 'the90sindia' ), 'text', 'Which channel do you flip to first?' ),
		'rewind_poll_options'  => array( __( 'Poll options (one per line)', 'the90sindia' ), 'textarea', "DD RETRO\nWWF ARENA\nHIT MUSIC\nCRICKET CORNER" ),
		'rewind_pinterest'     => array( __( 'Pinterest board URL', 'the90sindia' ), 'url', '' ),
	);

	foreach ( $fields as $key => $field ) {
		list( $label, $type, $default ) = $field;

		$wp_customize->add_setting(
			$key,
			array(
				'default'           => $default,
				'sanitize_callback' => 'url' === $type ? 'esc_url_raw' : 'wp_kses_post',
			)
		);

		$wp_customize->add_control(
			$key,
			array(
				'label'   => $label,
				'section' => 'rewind_settings',
				'type'    => $type,
			)
		);
	}
}
add_action( 'customize_register', 'rewind_customize_register' );
