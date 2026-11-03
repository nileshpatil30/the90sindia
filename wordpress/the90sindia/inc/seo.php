<?php
/**
 * Share cards and structured data.
 *
 * Without og: tags a link pasted into WhatsApp shows a bare URL — no title, no
 * picture. For a site people share with friends, that is the difference
 * between a link that gets opened and one that does not.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

/**
 * What the current request is about, normalised for the tag writers.
 *
 * @return array
 */
function rewind_share_context() {
	$site = get_bloginfo( 'name' );

	if ( is_singular() && ! is_front_page() ) {
		$id    = get_queried_object_id();
		$meta  = function_exists( 'rewind_item_meta' ) ? rewind_item_meta( $id ) : array();
		$blurb = function_exists( 'rewind_plain_body' ) ? rewind_plain_body( get_post( $id ) ) : '';

		return array(
			'type'  => 'article',
			'title' => get_the_title( $id ),
			'desc'  => $blurb ? wp_trim_words( $blurb, 32 ) : $site,
			'image' => function_exists( 'rewind_still_url' ) ? rewind_still_url( $id ) : '',
			'url'   => get_permalink( $id ),
			'video' => isset( $meta['video'] ) ? $meta['video'] : '',
		);
	}

	if ( is_post_type_archive() ) {
		$obj  = get_queried_object();
		$name = ( $obj && isset( $obj->name ) ) ? rewind_type_label( $obj->name ) : $site;
		return array(
			'type'  => 'website',
			'title' => $name . ' — ' . $site,
			'desc'  => ( $obj && ! empty( $obj->description ) ) ? $obj->description : get_bloginfo( 'description' ),
			'image' => '',
			'url'   => get_post_type_archive_link( $obj->name ),
			'video' => '',
		);
	}

	if ( is_search() ) {
		return array(
			'type'  => 'website',
			/* translators: %s: the search term. */
			'title' => sprintf( __( 'Search: %s', 'the90sindia' ), get_search_query() ) . ' — ' . $site,
			'desc'  => get_bloginfo( 'description' ),
			'image' => '',
			'url'   => get_search_link(),
			'video' => '',
		);
	}

	if ( is_404() ) {
		/* A missing page must not claim to be the home page, and should not
		   invite indexing at all. */
		return array(
			'type'    => 'website',
			'title'   => __( 'Not found', 'the90sindia' ) . ' — ' . $site,
			'desc'    => '',
			'image'   => '',
			'url'     => '',
			'video'   => '',
			'noindex' => true,
		);
	}

	return array(
		'type'  => 'website',
		'title' => $site,
		'desc'  => get_bloginfo( 'description' ),
		'image' => (string) get_theme_mod( 'rewind_share_image', '' ),
		'url'   => home_url( '/' ),
		'video' => '',
	);
}

/**
 * Writes the share tags, canonical and structured data into <head>.
 */
function rewind_print_head_tags() {
	$c = rewind_share_context();

	$title = wp_strip_all_tags( $c['title'] );
	$desc  = wp_strip_all_tags( $c['desc'] );
	$image = $c['image'];
	$url   = $c['url'];

	if ( ! empty( $c['noindex'] ) ) {
		echo "\n" . '<meta name="robots" content="noindex, follow">' . "\n";
	}

	/* A share card with no picture is a share card nobody clicks, so fall back
	   to the site-wide image when the item has no still of its own. */
	if ( ! $image ) {
		$image = (string) get_theme_mod( 'rewind_share_image', '' );
	}

	echo "\n";

	/* Only claim a canonical when this request really has one. Pointing a
	   search or 404 page at the home page tells a crawler they are the same
	   page, which is worse than saying nothing. */
	if ( $url ) {
		printf( '<link rel="canonical" href="%s">' . "\n", esc_url( $url ) );
	}

	if ( $desc ) {
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( $desc ) );
	}

	printf( '<meta property="og:site_name" content="%s">' . "\n", esc_attr( get_bloginfo( 'name' ) ) );
	printf( '<meta property="og:type" content="%s">' . "\n", esc_attr( $c['type'] ) );
	printf( '<meta property="og:title" content="%s">' . "\n", esc_attr( $title ) );
	if ( $url ) {
		printf( '<meta property="og:url" content="%s">' . "\n", esc_url( $url ) );
	}
	printf( '<meta property="og:locale" content="%s">' . "\n", esc_attr( get_locale() ) );

	if ( $desc ) {
		printf( '<meta property="og:description" content="%s">' . "\n", esc_attr( $desc ) );
	}

	if ( $image ) {
		printf( '<meta property="og:image" content="%s">' . "\n", esc_url( $image ) );
		printf( '<meta property="og:image:alt" content="%s">' . "\n", esc_attr( $title ) );
		echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
	} else {
		echo '<meta name="twitter:card" content="summary">' . "\n";
	}

	printf( '<meta name="twitter:title" content="%s">' . "\n", esc_attr( $title ) );
	if ( $desc ) {
		printf( '<meta name="twitter:description" content="%s">' . "\n", esc_attr( $desc ) );
	}
	if ( $image ) {
		printf( '<meta name="twitter:image" content="%s">' . "\n", esc_url( $image ) );
	}

	rewind_print_schema( $c );
	echo "\n";
}
add_action( 'wp_head', 'rewind_print_head_tags', 5 );

/* This theme prints its own canonical, so core's would be a second, competing
   tag on every singular view. */
remove_action( 'wp_head', 'rel_canonical' );

/**
 * JSON-LD describing the current page.
 *
 * @param array $c Share context.
 */
function rewind_print_schema( $c ) {
	if ( 'article' === $c['type'] && $c['video'] ) {
		$schema = array(
			'@context'     => 'https://schema.org',
			'@type'        => 'VideoObject',
			'name'         => $c['title'],
			'description'  => $c['desc'],
			'thumbnailUrl' => $c['image'],
			'embedUrl'     => 'https://www.youtube.com/embed/' . $c['video'],
			'uploadDate'   => get_the_date( 'c', get_queried_object_id() ),
			'url'          => $c['url'],
		);
	} elseif ( 'article' === $c['type'] ) {
		$schema = array(
			'@context'    => 'https://schema.org',
			'@type'       => 'Article',
			'headline'    => $c['title'],
			'description' => $c['desc'],
			'url'         => $c['url'],
			'image'       => $c['image'] ? $c['image'] : null,
			'datePublished' => get_the_date( 'c', get_queried_object_id() ),
			'dateModified'  => get_the_modified_date( 'c', get_queried_object_id() ),
		);
	} else {
		$schema = array(
			'@context'      => 'https://schema.org',
			'@type'         => 'WebSite',
			'name'          => get_bloginfo( 'name' ),
			'description'   => get_bloginfo( 'description' ),
			'url'           => home_url( '/' ),
			'inLanguage'    => get_locale(),
			'potentialAction' => array(
				'@type'       => 'SearchAction',
				'target'      => array(
					'@type'       => 'EntryPoint',
					'urlTemplate' => home_url( '/?s={search_term_string}' ),
				),
				'query-input' => 'required name=search_term_string',
			),
		);
	}

	$schema = array_filter( $schema, function ( $v ) { return null !== $v && '' !== $v; } );

	echo '<script type="application/ld+json">'
		. wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
		. '</script>' . "\n";
}

/**
 * The site-wide share picture, used when an item has no still of its own.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function rewind_customize_share( $wp_customize ) {
	$wp_customize->add_setting(
		'rewind_share_image',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'rewind_share_image',
			array(
				'label'       => __( 'Share picture', 'the90sindia' ),
				'description' => __( 'Shown when this site is shared on WhatsApp, Facebook or X. Used for any page without a picture of its own. Around 1200x630 works best.', 'the90sindia' ),
				'section'     => 'rewind_artwork',
			)
		)
	);
}
add_action( 'customize_register', 'rewind_customize_share', 20 );
