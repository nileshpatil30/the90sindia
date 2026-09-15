<?php
/**
 * Helpers for the per-item pages.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

/**
 * Human-readable name for a content type.
 *
 * @param string $type Post type.
 * @return string
 */
function rewind_type_label( $type ) {
	$map = array(
		'rewind_channel' => __( 'Channels', 'the90sindia' ),
		'rewind_show'    => __( 'Shows', 'the90sindia' ),
		'rewind_track'   => __( 'Hit Parade', 'the90sindia' ),
		'rewind_vault'   => __( 'Vault', 'the90sindia' ),
	);
	return isset( $map[ $type ] ) ? $map[ $type ] : __( 'Items', 'the90sindia' );
}

/**
 * The display metadata for an item, normalised across the four types.
 *
 * @param int $post_id Post ID.
 * @return array
 */
function rewind_item_meta( $post_id ) {
	$type = get_post_type( $post_id );

	$out = array(
		'category' => '',
		'color'    => '',
		'subtitle' => '',
		'video'    => (string) get_post_meta( $post_id, '_rw_video', true ),
		'playlist' => (string) get_post_meta( $post_id, '_rw_playlist', true ),
	);

	if ( 'rewind_show' === $type ) {
		$out['category'] = (string) get_post_meta( $post_id, '_rw_category', true );
		$out['color']    = (string) get_post_meta( $post_id, '_rw_tag_color', true );
		$channel_id      = (int) get_post_meta( $post_id, '_rw_channel', true );
		if ( $channel_id && get_post( $channel_id ) ) {
			$out['subtitle'] = get_the_title( $channel_id );
		}
	} elseif ( 'rewind_channel' === $type ) {
		$num = (string) get_post_meta( $post_id, '_rw_number', true );
		if ( '' !== $num ) {
			/* translators: %s: channel number. */
			$out['category'] = sprintf( __( 'CHANNEL %s', 'the90sindia' ), $num );
		}
		$out['color'] = 'cyan';
	} elseif ( 'rewind_track' === $type ) {
		$out['category'] = __( 'HIT PARADE', 'the90sindia' );
		$out['color']    = 'pink';
		$out['subtitle'] = (string) get_post_meta( $post_id, '_rw_artist', true );
	} elseif ( 'rewind_vault' === $type ) {
		$out['category'] = (string) get_post_meta( $post_id, '_rw_label', true );
		$out['color']    = (string) get_post_meta( $post_id, '_rw_theme', true );
	}

	return $out;
}

/**
 * The still for an item: its Featured image, else the video's own YouTube
 * thumbnail, else an empty string. Mirrors the rule the front-end scripts use.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function rewind_still_url( $post_id ) {
	$featured = get_the_post_thumbnail_url( $post_id, 'large' );
	if ( $featured ) {
		return $featured;
	}

	$video = (string) get_post_meta( $post_id, '_rw_video', true );
	if ( $video ) {
		return 'https://img.youtube.com/vi/' . rawurlencode( $video ) . '/hqdefault.jpg';
	}

	return '';
}

/**
 * The embed URL for an item, or an empty string when it has no source yet.
 *
 * @param int  $post_id  Post ID.
 * @param bool $autoplay Whether to autoplay.
 * @return string
 */
function rewind_embed_url( $post_id, $autoplay = false ) {
	$video    = (string) get_post_meta( $post_id, '_rw_video', true );
	$playlist = (string) get_post_meta( $post_id, '_rw_playlist', true );

	$params = array(
		'rel'            => '0',
		'modestbranding' => '1',
	);
	if ( $autoplay ) {
		$params['autoplay'] = '1';
	}

	if ( $playlist ) {
		$params['listType'] = 'playlist';
		$params['list']     = $playlist;
		return 'https://www.youtube.com/embed/videoseries?' . http_build_query( $params );
	}

	if ( $video ) {
		return 'https://www.youtube.com/embed/' . rawurlencode( $video ) . '?' . http_build_query( $params );
	}

	return '';
}

/**
 * The player block: a still with a play button that swaps in the embed when
 * pressed, so nothing is requested from YouTube until a visitor asks for it.
 *
 * Falls back to a plain notice when the item has no source yet, which is the
 * honest state for an entry whose video ID has not been verified.
 *
 * @param int $post_id Post ID.
 * @return string Escaped markup.
 */
function rewind_player_markup( $post_id ) {
	$embed = rewind_embed_url( $post_id, true );

	if ( ! $embed ) {
		return '<div class="item-player item-player--empty"><p>📼</p><p>'
			. esc_html__( 'No video linked to this one yet.', 'the90sindia' )
			. '</p></div>';
	}

	$still = rewind_still_url( $post_id );
	$title = get_the_title( $post_id );

	$out = '<div class="item-player" data-embed="' . esc_attr( $embed ) . '">';

	if ( $still ) {
		$out .= '<button type="button" class="item-player-poster" aria-label="'
			. esc_attr( sprintf( /* translators: %s: item title. */ __( 'Play %s', 'the90sindia' ), $title ) ) . '">'
			. '<img src="' . esc_url( $still ) . '" alt="" loading="eager">'
			. '<span class="item-player-play" aria-hidden="true">▶</span>'
			. '</button>';
	} else {
		/* No still to show, so load the player directly. */
		$out .= '<iframe src="' . esc_url( rewind_embed_url( $post_id, false ) ) . '" title="'
			. esc_attr( $title ) . '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"'
			. ' allowfullscreen loading="lazy"></iframe>';
	}

	$out .= '</div>';

	return $out;
}

/**
 * A few sibling items of the same type, for internal linking.
 *
 * Internal links are how a search engine finds the rest of the site from any
 * one page, so every item page points at several others.
 *
 * @param int    $post_id Current post.
 * @param string $type    Post type.
 * @param int    $limit   How many to return.
 * @return WP_Post[]
 */
function rewind_related_items( $post_id, $type, $limit = 6 ) {
	return get_posts(
		array(
			'post_type'        => $type,
			'post_status'      => 'publish',
			'posts_per_page'   => $limit,
			'post__not_in'     => array( $post_id ),
			'orderby'          => 'menu_order title',
			'order'            => 'ASC',
			'suppress_filters' => false,
		)
	);
}
