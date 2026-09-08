<?php
/**
 * Starter import — brings the existing js/config.js content into WordPress so
 * a fresh install opens with the real site, not an empty one.
 *
 * Runs once, from a button under Tools. Every created post is stamped, so a
 * second run skips whatever is already there and never duplicates.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

const REWIND_SEED_FLAG = '_rw_seeded';

/**
 * The content that shipped in js/config.js.
 *
 * @return array
 */
function rewind_seed_data() {
	return array(
		'rewind_channel' => array(
			array(
				'title' => 'DD RETRO',
				'body'  => "Doordarshan's own channel, reviving classics like Office Office. Dig into their archive for more DD-era gems.",
				'meta'  => array( '_rw_number' => '01', '_rw_video' => 'Mg4h9Au7JpE' ),
			),
			array(
				'title' => 'SHEMAROO CLASSICS',
				'body'  => "Hasya Kavi Sammelans, comedy specials and DD-era classics from Shemaroo's official Indian TV Classics channel.",
				'meta'  => array( '_rw_number' => '02', '_rw_video' => '74FQYh2j0cE' ),
			),
			array(
				'title' => 'RAJSHRI TALKIES',
				'body'  => "Family blockbusters from the studio that gave us Hum Aapke Hain Koun — straight from Rajshri's own channel.",
				'meta'  => array( '_rw_number' => '03', '_rw_playlist' => 'PL0CaUqi81mPnxS08v67qqzJawvLRakSud' ),
			),
			array(
				'title' => 'ULTRA BLOCKBUSTERS',
				'body'  => "90s Bollywood masala, full movies, from Ultra's official film library.",
				'meta'  => array( '_rw_number' => '04', '_rw_video' => 'G9jk_mk-s7w' ),
			),
			array(
				'title' => 'WWF ARENA',
				'body'  => "Hulk Hogan, The Undertaker, Shawn Michaels — classic 90s slams from WWE's own channel.",
				'meta'  => array( '_rw_number' => '05', '_rw_video' => 'BvZ2KQuCTds' ),
			),
			array(
				'title' => 'HIT MUSIC',
				'body'  => 'Chartbusters and remixes, sourced only from official record label channels.',
				'meta'  => array( '_rw_number' => '06', '_rw_video' => '1YddSDFIsk4' ),
			),
			array(
				'title' => 'CRICKET CORNER',
				'body'  => "Cricket highlights and India matches, official uploads straight from ICC's own channel.",
				'meta'  => array( '_rw_number' => '07', '_rw_video' => 'KrAN51nZ1HM' ),
			),
		),
		'rewind_show'    => array(
			array(
				'title' => 'Office Office: Chali Mussaddi Ki Beti',
				'body'  => "Musaddi Lal is back — Pankaj Kapur's classic babu battles the system all over again, straight from DD National.",
				'meta'  => array( '_rw_category' => 'CLASSIC', '_rw_tag_color' => 'lime', '_rw_video' => 'Mg4h9Au7JpE' ),
				'channel' => 'DD RETRO',
			),
			array(
				'title' => 'Waah Bhai Waah',
				'body'  => 'A hasya kavi sammelan special — the kind of comic-poetry night that ruled Doordarshan Sundays.',
				'meta'  => array( '_rw_category' => 'COMEDY', '_rw_tag_color' => 'pink', '_rw_video' => '74FQYh2j0cE' ),
				'channel' => 'SHEMAROO CLASSICS',
			),
			array(
				'title' => 'Hum Aapke Hain Koun',
				'body'  => 'Weddings, songs and Tuffy the dog — the family blockbuster that broke records.',
				'meta'  => array( '_rw_category' => 'MOVIE', '_rw_tag_color' => 'purple', '_rw_playlist' => 'PL0CaUqi81mPnxS08v67qqzJawvLRakSud' ),
				'channel' => 'RAJSHRI TALKIES',
			),
			array(
				'title' => 'Hell in a Cell, 1997',
				'body'  => 'Undertaker vs Shawn Michaels — the match that invented a whole new kind of brutal.',
				'meta'  => array( '_rw_category' => 'WWF', '_rw_tag_color' => 'orange', '_rw_video' => 'BvZ2KQuCTds' ),
				'channel' => 'WWF ARENA',
			),
			array(
				'title' => '90s Bollywood Hit Mix',
				'body'  => 'Non-stop chartbusters to take you straight back to the golden decade.',
				'meta'  => array( '_rw_category' => 'MUSIC', '_rw_tag_color' => 'cyan', '_rw_video' => '1YddSDFIsk4' ),
				'channel' => 'HIT MUSIC',
			),
			array(
				'title' => 'Barood',
				'body'  => "Akshay Kumar and Raveena Tandon in a 1998 full-throttle actioner, straight from Ultra's own vault.",
				'meta'  => array( '_rw_category' => 'MOVIE', '_rw_tag_color' => 'orange', '_rw_video' => 'G9jk_mk-s7w' ),
				'channel' => 'ULTRA BLOCKBUSTERS',
			),
			array(
				'title' => 'Shaktimaan',
				'body'  => 'India\'s own superhero — Mukesh Khanna spinning into the sky every Sunday from 1997. Look for it on Doordarshan\'s official channel.',
				'meta'  => array( '_rw_category' => 'SUPERHERO', '_rw_tag_color' => 'orange', '_rw_video' => '' ),
				'channel' => 'DD RETRO',
			),
			array(
				'title' => 'Byomkesh Bakshi',
				'body'  => 'Rajit Kapur as Sharadindu Bandyopadhyay\'s satyanweshi, solving cases in 1930s Calcutta. DD has run the full series on its own channel.',
				'meta'  => array( '_rw_category' => 'DETECTIVE', '_rw_tag_color' => 'cyan', '_rw_video' => '' ),
				'channel' => 'DD RETRO',
			),
			array(
				'title' => 'Chandrakanta',
				'body'  => 'Tilismi forts, ayyaars and Crookbond — the Sunday-morning fantasy that had the whole country guessing. Look for it on DD\'s channel.',
				'meta'  => array( '_rw_category' => 'FANTASY', '_rw_tag_color' => 'purple', '_rw_video' => '' ),
				'channel' => 'DD RETRO',
			),
			array(
				'title' => 'Malgudi Days',
				'body'  => 'R.K. Narayan\'s stories, Shankar Nag\'s direction, and that theme tune. Check DD\'s official uploads before any reupload channel.',
				'meta'  => array( '_rw_category' => 'CLASSIC', '_rw_tag_color' => 'lime', '_rw_video' => '' ),
				'channel' => 'DD RETRO',
			),
			array(
				'title' => 'Jungle Book: Mowgli',
				'body'  => 'The dubbed anime that ruled after-school hours, with Gulzar\'s title song. Rights sit with the studio — verify the channel before embedding.',
				'meta'  => array( '_rw_category' => 'KIDS', '_rw_tag_color' => 'yellow', '_rw_video' => '' ),
				'channel' => 'DD RETRO',
			),
			array(
				'title' => 'Surabhi',
				'body'  => 'Siddharth Kak and Renuka Shahane touring India\'s crafts, festivals and forgotten corners — and those postcard entries by the sackful.',
				'meta'  => array( '_rw_category' => 'CULTURE', '_rw_tag_color' => 'pink', '_rw_video' => '' ),
				'channel' => 'DD RETRO',
			),
			array(
				'title' => 'India vs Pakistan Thriller',
				'body'  => "Kohli's heroics in front of a packed house — an official ICC highlight package.",
				'meta'  => array( '_rw_category' => 'SPORTS', '_rw_tag_color' => 'yellow', '_rw_video' => 'KrAN51nZ1HM' ),
				'channel' => 'CRICKET CORNER',
			),
		),
		'rewind_track'   => array(
			array(
				'title' => '90s Bollywood Hit Mix',
				'meta'  => array( '_rw_artist' => 'Tips Official (official label channel)', '_rw_video' => '1YddSDFIsk4' ),
			),
			array(
				'title' => 'Taare Hain Baraati',
				'meta'  => array( '_rw_artist' => 'Virasat (1997) — Saregama Carvaan (official label channel)', '_rw_video' => 'AJObEYtVGvA' ),
			),
			array(
				'title' => 'Made in India',
				'meta'  => array( '_rw_artist' => 'Alisha Chinai (1995) — look on Sony Music India / Magnasound', '_rw_video' => '' ),
			),
			array(
				'title' => 'Bolo Ta Ra Ra',
				'meta'  => array( '_rw_artist' => 'Daler Mehndi (1995) — look on Magnasound / Sony Music India', '_rw_video' => '' ),
			),
			array(
				'title' => 'O Sanam',
				'meta'  => array( '_rw_artist' => 'Lucky Ali, from Sunoh (1996) — look on Sony Music India', '_rw_video' => '' ),
			),
			array(
				'title' => 'Dooba Dooba',
				'meta'  => array( '_rw_artist' => 'Silk Route, from Boondein (1998) — look on Sony Music India', '_rw_video' => '' ),
			),
			array(
				'title' => 'Ab Ke Sawan',
				'meta'  => array( '_rw_artist' => 'Shubha Mudgal (1999) — look on the label\'s official channel', '_rw_video' => '' ),
			),
			array(
				'title' => 'Maa Tujhe Salaam',
				'meta'  => array( '_rw_artist' => 'A.R. Rahman, Vande Mataram (1997) — look on Sony Music India', '_rw_video' => '' ),
			),
		),
		'rewind_vault'   => array(
			array(
				'title' => '1983 World Cup Glory',
				'body'  => 'Kapil\'s Devils beat the mighty West Indies at Lord\'s — India\'s first World Cup, and the day the country fell for the one-day game.',
				'meta'  => array( '_rw_label' => 'CRICKET', '_rw_theme' => 'cyan' ),
			),
			array(
				'title' => 'Hero Cup Semi-Final, 1993',
				'body'  => 'South Africa needed six off the last over at Eden Gardens. Azhar tossed the ball to Sachin — a part-time bowler — and India won by two runs.',
				'meta'  => array( '_rw_label' => 'CRICKET', '_rw_theme' => 'lime' ),
			),
			array(
				'title' => 'Bangalore Quarter-Final, 1996',
				'body'  => 'India vs Pakistan in the World Cup quarter-final at the Chinnaswamy. Ajay Jadeja tore into Waqar Younis at the death and India went through.',
				'meta'  => array( '_rw_label' => 'CRICKET', '_rw_theme' => 'yellow' ),
			),
			array(
				'title' => 'Desert Storm, Sharjah 1998',
				'body'  => 'A sandstorm stopped play; Sachin restarted it. 143 against Australia to reach the final, then 134 in the final itself — on his 25th birthday.',
				'meta'  => array( '_rw_label' => 'CRICKET', '_rw_theme' => 'orange' ),
			),
			array(
				'title' => 'Kumble\'s Perfect Ten, 1999',
				'body'  => 'All ten Pakistani wickets at the Feroz Shah Kotla — only the second bowler in Test history to take all ten in an innings.',
				'meta'  => array( '_rw_label' => 'CRICKET', '_rw_theme' => 'pink' ),
			),
			array(
				'title' => 'Taunton, World Cup 1999',
				'body'  => 'Ganguly 183, Dravid 145, and a stand of 318 against Sri Lanka — the biggest partnership in World Cup cricket at the time.',
				'meta'  => array( '_rw_label' => 'CRICKET', '_rw_theme' => 'purple' ),
			),
			array(
				'title' => 'Hell in a Cell, 1997',
				'body'  => 'Undertaker vs Shawn Michaels at Badd Blood — the very first Cell match, and Kane\'s arrival to tear the door off it.',
				'meta'  => array( '_rw_label' => 'WWF', '_rw_theme' => 'orange' ),
			),
			array(
				'title' => 'Austin 3:16, 1996',
				'body'  => 'Stone Cold\'s King of the Ring promo — three words that turned a mid-card heel into the biggest star of the Attitude Era.',
				'meta'  => array( '_rw_label' => 'WWF', '_rw_theme' => 'cyan' ),
			),
		),
	);
}

/**
 * Creates any starter item that is not already present.
 *
 * Matching is by post type + title, so an item you renamed or deleted on
 * purpose is not silently recreated as a duplicate of something you edited.
 *
 * @return array Counts keyed by post type.
 */
function rewind_run_seed() {
	$created  = array();
	$channels = array();

	foreach ( rewind_seed_data() as $type => $items ) {
		$created[ $type ] = 0;
		$order            = 0;

		foreach ( $items as $item ) {
			++$order;

			$existing = rewind_find_by_title( $item['title'], $type );
			if ( $existing ) {
				if ( 'rewind_channel' === $type ) {
					$channels[ $item['title'] ] = $existing->ID;
				}
				continue;
			}

			$post_id = wp_insert_post(
				array(
					'post_type'    => $type,
					'post_status'  => 'publish',
					'post_title'   => $item['title'],
					'post_content' => isset( $item['body'] ) ? $item['body'] : '',
					'menu_order'   => $order,
				),
				true
			);

			if ( is_wp_error( $post_id ) ) {
				continue;
			}

			foreach ( $item['meta'] as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}

			/* Shows point at a channel by ID, so channels must exist first —
			   they do, because seed data is ordered channels-first. */
			if ( isset( $item['channel'] ) && isset( $channels[ $item['channel'] ] ) ) {
				update_post_meta( $post_id, '_rw_channel', $channels[ $item['channel'] ] );
			}

			if ( 'rewind_channel' === $type ) {
				$channels[ $item['title'] ] = $post_id;
			}

			update_post_meta( $post_id, REWIND_SEED_FLAG, '1' );
			++$created[ $type ];
		}
	}

	return $created;
}

/**
 * Finds a post of a type by exact title.
 *
 * get_page_by_title() is deprecated as of WordPress 6.2, so this uses the
 * WP_Query `title` parameter instead.
 *
 * @param string $title Exact post title.
 * @param string $type  Post type.
 * @return WP_Post|null
 */
function rewind_find_by_title( $title, $type ) {
	$found = get_posts(
		array(
			'post_type'        => $type,
			'title'            => $title,
			'post_status'      => array( 'publish', 'draft', 'pending', 'private' ),
			'posts_per_page'   => 1,
			'suppress_filters' => false,
		)
	);

	return $found ? $found[0] : null;
}

/**
 * Adds the import screen under Tools.
 */
function rewind_seed_menu() {
	add_management_page(
		__( '90s REWIND starter content', 'the90sindia' ),
		__( '90s REWIND import', 'the90sindia' ),
		'manage_options',
		'rewind-seed',
		'rewind_seed_screen'
	);
}
add_action( 'admin_menu', 'rewind_seed_menu' );

/**
 * Renders the import screen and handles the button.
 */
function rewind_seed_screen() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$done = false;
	$made = array();

	if ( isset( $_POST['rewind_seed_nonce'] ) ) {
		$nonce = sanitize_text_field( wp_unslash( $_POST['rewind_seed_nonce'] ) );
		if ( wp_verify_nonce( $nonce, 'rewind_seed' ) ) {
			$made = rewind_run_seed();
			$done = true;
		}
	}

	echo '<div class="wrap">';
	echo '<h1>' . esc_html__( '90s REWIND starter content', 'the90sindia' ) . '</h1>';

	if ( $done ) {
		$total = array_sum( $made );
		echo '<div class="notice notice-success"><p>';
		if ( $total ) {
			printf(
				/* translators: %d: number of items created. */
				esc_html__( 'Imported %d items. Anything already present was left alone.', 'the90sindia' ),
				(int) $total
			);
		} else {
			esc_html_e( 'Nothing to import — every starter item is already here.', 'the90sindia' );
		}
		echo '</p></div>';
	}

	echo '<p>' . esc_html__( 'Creates the channels, shows, tracks and vault cards that shipped with the static site, so you can start from the real content instead of a blank site.', 'the90sindia' ) . '</p>';
	echo '<p>' . esc_html__( 'Safe to run more than once: it matches on title and skips anything that already exists, so nothing is duplicated or overwritten.', 'the90sindia' ) . '</p>';

	echo '<form method="post">';
	wp_nonce_field( 'rewind_seed', 'rewind_seed_nonce' );
	submit_button( __( 'Import starter content', 'the90sindia' ) );
	echo '</form>';
	echo '</div>';
}
