<?php
/**
 * Not-found page.
 *
 * A dead link is where visitors arrive from an old share or a typo, so this
 * offers a way onward rather than a dead end.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="main-content" class="item-page">

	<header class="item-head">
		<span class="item-tag" style="--tag-color: var(--orange)"><?php esc_html_e( 'NO SIGNAL', 'the90sindia' ); ?></span>
		<h1><?php esc_html_e( 'Nothing on this channel', 'the90sindia' ); ?></h1>
		<p class="item-sub"><?php esc_html_e( 'That page has been taken off air, or the address has a typo in it.', 'the90sindia' ); ?></p>
	</header>

	<div class="item-player item-player--empty">
		<p>📺</p>
		<p><?php esc_html_e( 'Please adjust your antenna.', 'the90sindia' ); ?></p>
	</div>

	<div class="item-body"><?php get_search_form(); ?></div>

	<?php
	$rewind_sections = array(
		'rewind_show'    => __( 'Browse the shows', 'the90sindia' ),
		'rewind_channel' => __( 'Flip through the channels', 'the90sindia' ),
		'rewind_track'   => __( 'Spin the Hit Parade', 'the90sindia' ),
		'rewind_vault'   => __( 'Open the vault', 'the90sindia' ),
	);
	?>
	<section class="item-related">
		<h2><?php esc_html_e( 'Try one of these', 'the90sindia' ); ?></h2>
		<ul class="notfound-links">
			<?php foreach ( $rewind_sections as $rewind_type => $rewind_label ) : ?>
				<?php $rewind_link = get_post_type_archive_link( $rewind_type ); ?>
				<?php if ( $rewind_link ) : ?>
					<li><a href="<?php echo esc_url( $rewind_link ); ?>"><?php echo esc_html( $rewind_label ); ?></a></li>
				<?php endif; ?>
			<?php endforeach; ?>
		</ul>
	</section>

	<p class="item-back">
		<a class="btn-chunky" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( '← Back to 90s REWIND', 'the90sindia' ); ?>
		</a>
	</p>

</main>

<?php
get_footer();
