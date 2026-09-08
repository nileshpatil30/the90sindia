<?php
/**
 * Content types — the WordPress replacement for the arrays in js/config.js.
 *
 * Each type maps one-to-one onto an array that used to live in that file, so
 * the front end keeps the same shape and the JS does not change.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers every content type the site renders from.
 */
function rewind_register_post_types() {

	$shared = array(
		'public'             => true,
		'publicly_queryable' => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'has_archive'        => false,
		'rewrite'            => false,
		'menu_position'      => 20,
		'supports'           => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
	);

	register_post_type(
		'rewind_channel',
		array_merge(
			$shared,
			array(
				'labels'        => rewind_cpt_labels( 'Channel', 'Channels' ),
				'menu_icon'     => 'dashicons-video-alt2',
				'menu_position' => 20,
			)
		)
	);

	register_post_type(
		'rewind_show',
		array_merge(
			$shared,
			array(
				'labels'        => rewind_cpt_labels( 'Show', 'Shows' ),
				'menu_icon'     => 'dashicons-format-video',
				'menu_position' => 21,
			)
		)
	);

	register_post_type(
		'rewind_track',
		array_merge(
			$shared,
			array(
				'labels'        => rewind_cpt_labels( 'Track', 'Hit Parade' ),
				'menu_icon'     => 'dashicons-format-audio',
				'menu_position' => 22,
				'supports'      => array( 'title', 'thumbnail', 'page-attributes' ),
			)
		)
	);

	register_post_type(
		'rewind_vault',
		array_merge(
			$shared,
			array(
				'labels'        => rewind_cpt_labels( 'Vault Card', 'Vault' ),
				'menu_icon'     => 'dashicons-awards',
				'menu_position' => 23,
			)
		)
	);
}
add_action( 'init', 'rewind_register_post_types' );

/**
 * Builds a standard label set so every type reads consistently in wp-admin.
 *
 * @param string $singular Singular label.
 * @param string $plural   Plural label.
 * @return array
 */
function rewind_cpt_labels( $singular, $plural ) {
	return array(
		'name'               => $plural,
		'singular_name'      => $singular,
		'menu_name'          => $plural,
		/* translators: %s: singular content type name. */
		'add_new_item'       => sprintf( __( 'Add New %s', 'the90sindia' ), $singular ),
		/* translators: %s: singular content type name. */
		'edit_item'          => sprintf( __( 'Edit %s', 'the90sindia' ), $singular ),
		/* translators: %s: singular content type name. */
		'new_item'           => sprintf( __( 'New %s', 'the90sindia' ), $singular ),
		/* translators: %s: plural content type name. */
		'view_items'         => sprintf( __( 'View %s', 'the90sindia' ), $plural ),
		/* translators: %s: plural content type name. */
		'search_items'       => sprintf( __( 'Search %s', 'the90sindia' ), $plural ),
		/* translators: %s: plural content type name. */
		'not_found'          => sprintf( __( 'No %s yet', 'the90sindia' ), strtolower( $plural ) ),
		'all_items'          => $plural,
	);
}

/**
 * Orders every content type by the drag-sortable Order field, then by title,
 * so the running order on the front end is set in wp-admin rather than code.
 *
 * @param WP_Query $query The query being prepared.
 */
function rewind_order_by_menu_order( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}
	$types = array( 'rewind_channel', 'rewind_show', 'rewind_track', 'rewind_vault' );
	if ( in_array( $query->get( 'post_type' ), $types, true ) ) {
		$query->set( 'orderby', array( 'menu_order' => 'ASC', 'title' => 'ASC' ) );
	}
}
add_action( 'pre_get_posts', 'rewind_order_by_menu_order' );
