<?php
/**
 * Portal artwork — the image slots that are not tied to a channel or show.
 *
 * Tile artwork for channels, shows, tracks and vault cards comes from each
 * item's Featured image. Everything else on the portal page — the logo, the
 * sidebar promos, the bottom badges and the two ad slots — was text baked into
 * the templates. These settings put every one of them behind a media-library
 * upload button, so no image on the page requires touching code.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

/**
 * Every uploadable slot on the portal page.
 *
 * Each entry: key => array( section label, control label, default text ).
 *
 * @return array
 */
function rewind_chrome_slots() {
	return array(
		'logo'    => array( __( 'Logo', 'the90sindia' ), '90s REWIND' ),
		'promo_1' => array( __( 'Sidebar promo 1', 'the90sindia' ), 'PHOTO WALL' ),
		'promo_2' => array( __( 'Sidebar promo 2', 'the90sindia' ), 'HIT PARADE' ),
		'badge_1' => array( __( 'Bottom badge 1', 'the90sindia' ), 'PICK LIVE' ),
		'badge_2' => array( __( 'Bottom badge 2', 'the90sindia' ), 'TEEN REWIND' ),
		'badge_3' => array( __( 'Bottom badge 3', 'the90sindia' ), "LET'S PLAY" ),
		'badge_4' => array( __( 'Bottom badge 4', 'the90sindia' ), 'THE VAULT' ),
		'ad_top'  => array( __( 'Top ad banner', 'the90sindia' ), '' ),
		'ad_side' => array( __( 'Side ad banner', 'the90sindia' ), '' ),
	);
}

/**
 * Adds an image, caption and link control for every slot.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function rewind_customize_chrome( $wp_customize ) {

	$wp_customize->add_section(
		'rewind_artwork',
		array(
			'title'       => __( '90s REWIND artwork', 'the90sindia' ),
			'priority'    => 31,
			'description' => __( 'Upload the images that are not attached to a channel or show. Leave a slot empty and it keeps its text version. Artwork for channels, shows, tracks and vault cards is the Featured image on each of those items.', 'the90sindia' ),
		)
	);

	foreach ( rewind_chrome_slots() as $key => $slot ) {
		list( $label, $default_text ) = $slot;

		/* Image */
		$wp_customize->add_setting(
			"rewind_{$key}_image",
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
			)
		);
		$wp_customize->add_control(
			new WP_Customize_Image_Control(
				$wp_customize,
				"rewind_{$key}_image",
				array(
					'label'   => $label,
					'section' => 'rewind_artwork',
				)
			)
		);

		/* Caption — also the image's alt text, so an uploaded slot stays
		   readable to screen readers and when the image fails to load. */
		$wp_customize->add_setting(
			"rewind_{$key}_text",
			array(
				'default'           => $default_text,
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			"rewind_{$key}_text",
			array(
				/* translators: %s: name of the artwork slot. */
				'label'       => sprintf( __( '%s — caption', 'the90sindia' ), $label ),
				'section'     => 'rewind_artwork',
				'type'        => 'text',
				'description' => __( 'Shown when no image is set, and used as the image description.', 'the90sindia' ),
			)
		);

		/* Link */
		$wp_customize->add_setting(
			"rewind_{$key}_link",
			array(
				'default'           => '',
				'sanitize_callback' => 'esc_url_raw',
			)
		);
		$wp_customize->add_control(
			"rewind_{$key}_link",
			array(
				/* translators: %s: name of the artwork slot. */
				'label'   => sprintf( __( '%s — link', 'the90sindia' ), $label ),
				'section' => 'rewind_artwork',
				'type'    => 'url',
			)
		);
	}
}
add_action( 'customize_register', 'rewind_customize_chrome' );

/**
 * Collects the slots into the shape assets/js/portal.js reads.
 *
 * @return array
 */
function rewind_chrome_config() {
	$out = array();

	foreach ( array_keys( rewind_chrome_slots() ) as $key ) {
		$out[ $key ] = array(
			'image' => (string) get_theme_mod( "rewind_{$key}_image", '' ),
			'text'  => (string) get_theme_mod( "rewind_{$key}_text", '' ),
			'href'  => (string) get_theme_mod( "rewind_{$key}_link", '' ),
		);
	}

	return $out;
}
