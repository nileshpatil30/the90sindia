<?php
/**
 * Edit-screen fields — the wp-admin replacement for hand-editing js/config.js.
 *
 * Every field that used to be a key in a config object is a real form field
 * here, so adding a channel or a show no longer means touching code.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

/**
 * Field definitions per content type.
 *
 * Each entry: key => array( label, type, help, choices ).
 *
 * @return array
 */
function rewind_field_map() {
	return array(
		'rewind_channel' => array(
			'_rw_number'   => array( 'Channel number', 'text', 'Shown on the channel card, e.g. 01.' ),
			'_rw_video'    => array( 'YouTube video ID', 'text', 'Just the ID, e.g. BvZ2KQuCTds — not the whole URL. Leave blank if using a playlist.' ),
			'_rw_playlist' => array( 'YouTube playlist ID', 'text', 'Use instead of a video ID, never both.' ),
		),
		'rewind_show'    => array(
			'_rw_channel'  => array( 'Channel', 'channel', 'Which channel this show belongs to.' ),
			'_rw_category' => array( 'Category label', 'text', 'Short tag on the card, e.g. SITCOM, MOVIE, WWF.' ),
			'_rw_tag_color' => array( 'Tag colour', 'select', 'Colour of the category tag.', array( 'lime', 'pink', 'purple', 'orange', 'cyan', 'yellow' ) ),
			'_rw_video'    => array( 'YouTube video ID', 'text', 'Just the ID. Leave blank if using a playlist.' ),
			'_rw_playlist' => array( 'YouTube playlist ID', 'text', 'Use instead of a video ID, never both.' ),
		),
		'rewind_track'   => array(
			'_rw_artist'   => array( 'Artist / source channel', 'text', 'Credit the official label channel the track streams from.' ),
			'_rw_video'    => array( 'YouTube video ID', 'text', 'Just the ID.' ),
		),
		'rewind_vault'   => array(
			'_rw_label'    => array( 'Label', 'text', 'Short tag, e.g. CRICKET or WWF.' ),
			'_rw_theme'    => array( 'Card colour', 'select', 'Colour of the card.', array( 'lime', 'pink', 'purple', 'orange', 'cyan', 'yellow' ) ),
		),
	);
}

/**
 * Adds the details box to every content type that has fields.
 */
function rewind_add_meta_boxes() {
	foreach ( array_keys( rewind_field_map() ) as $type ) {
		add_meta_box(
			'rewind_details',
			__( 'Details', 'the90sindia' ),
			'rewind_render_meta_box',
			$type,
			'normal',
			'high'
		);
	}
}
add_action( 'add_meta_boxes', 'rewind_add_meta_boxes' );

/**
 * Renders the details box.
 *
 * @param WP_Post $post Post being edited.
 */
function rewind_render_meta_box( $post ) {
	$map = rewind_field_map();
	if ( empty( $map[ $post->post_type ] ) ) {
		return;
	}

	wp_nonce_field( 'rewind_save_meta', 'rewind_meta_nonce' );

	echo '<table class="form-table" role="presentation">';

	foreach ( $map[ $post->post_type ] as $key => $field ) {
		list( $label, $type, $help ) = $field;
		$choices = isset( $field[3] ) ? $field[3] : array();
		$value   = (string) get_post_meta( $post->ID, $key, true );
		$id      = esc_attr( $key );

		echo '<tr><th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $label ) . '</label></th><td>';

		if ( 'select' === $type ) {
			echo '<select name="' . esc_attr( $key ) . '" id="' . esc_attr( $id ) . '">';
			foreach ( $choices as $choice ) {
				printf(
					'<option value="%1$s"%2$s>%1$s</option>',
					esc_attr( $choice ),
					selected( $value, $choice, false )
				);
			}
			echo '</select>';
		} elseif ( 'channel' === $type ) {
			$channels = get_posts(
				array(
					'post_type'      => 'rewind_channel',
					'posts_per_page' => -1,
					'orderby'        => 'menu_order',
					'order'          => 'ASC',
				)
			);
			echo '<select name="' . esc_attr( $key ) . '" id="' . esc_attr( $id ) . '">';
			echo '<option value="">' . esc_html__( '— none —', 'the90sindia' ) . '</option>';
			foreach ( $channels as $channel ) {
				printf(
					'<option value="%1$s"%3$s>%2$s</option>',
					esc_attr( $channel->ID ),
					esc_html( $channel->post_title ),
					selected( $value, (string) $channel->ID, false )
				);
			}
			echo '</select>';
		} else {
			echo '<input type="text" class="regular-text" name="' . esc_attr( $key ) . '" id="' . esc_attr( $id ) . '" value="' . esc_attr( $value ) . '">';
		}

		if ( $help ) {
			echo '<p class="description">' . esc_html( $help ) . '</p>';
		}

		echo '</td></tr>';
	}

	echo '</table>';

	echo '<p class="description">'
		. esc_html__( 'Tip: the Featured image becomes this item\'s tile artwork on the portal page. Without one, the tile draws a two-letter monogram instead.', 'the90sindia' )
		. '</p>';
}

/**
 * Saves the details box.
 *
 * @param int $post_id Post being saved.
 */
function rewind_save_meta( $post_id ) {
	if ( ! isset( $_POST['rewind_meta_nonce'] ) ) {
		return;
	}
	$nonce = sanitize_text_field( wp_unslash( $_POST['rewind_meta_nonce'] ) );
	if ( ! wp_verify_nonce( $nonce, 'rewind_save_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$map  = rewind_field_map();
	$type = get_post_type( $post_id );
	if ( empty( $map[ $type ] ) ) {
		return;
	}

	foreach ( array_keys( $map[ $type ] ) as $key ) {
		if ( ! isset( $_POST[ $key ] ) ) {
			continue;
		}
		$value = sanitize_text_field( wp_unslash( $_POST[ $key ] ) );

		/* A pasted YouTube URL is the commonest mistake — keep just the ID. */
		if ( '_rw_video' === $key ) {
			$value = rewind_extract_video_id( $value );
		}
		if ( '_rw_playlist' === $key ) {
			$value = rewind_extract_playlist_id( $value );
		}

		if ( '' === $value ) {
			delete_post_meta( $post_id, $key );
		} else {
			update_post_meta( $post_id, $key, $value );
		}
	}
}
add_action( 'save_post', 'rewind_save_meta' );

/**
 * Pulls the video ID out of whatever the editor pasted — a bare ID, a watch
 * URL, a share link or an embed URL all resolve to the same eleven characters.
 *
 * @param string $raw Pasted value.
 * @return string
 */
function rewind_extract_video_id( $raw ) {
	$raw = trim( $raw );
	if ( '' === $raw ) {
		return '';
	}
	if ( preg_match( '#[?&]v=([A-Za-z0-9_-]{11})#', $raw, $m ) ) {
		return $m[1];
	}
	if ( preg_match( '#(?:youtu\.be/|/embed/|/shorts/)([A-Za-z0-9_-]{11})#', $raw, $m ) ) {
		return $m[1];
	}
	if ( preg_match( '#^[A-Za-z0-9_-]{11}$#', $raw ) ) {
		return $raw;
	}
	return '';
}

/**
 * Pulls the playlist ID out of a pasted playlist URL or a bare ID.
 *
 * @param string $raw Pasted value.
 * @return string
 */
function rewind_extract_playlist_id( $raw ) {
	$raw = trim( $raw );
	if ( '' === $raw ) {
		return '';
	}
	if ( preg_match( '#[?&]list=([A-Za-z0-9_-]+)#', $raw, $m ) ) {
		return $m[1];
	}
	if ( preg_match( '#^[A-Za-z0-9_-]{12,}$#', $raw ) ) {
		return $raw;
	}
	return '';
}
