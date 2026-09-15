<?php
/**
 * A single channel, show, track or vault card.
 *
 * This is the page that gives every item its own URL. The front page stays a
 * one-page hub; these are what a search engine can actually index, and where
 * an editor's own writing about a show lives.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();

	$type    = get_post_type();
	$meta    = rewind_item_meta( get_the_ID() );
	$kind    = rewind_type_label( $type );
	$archive = get_post_type_archive_link( $type );
	?>

<main class="item-page">

	<nav class="item-crumbs" aria-label="Breadcrumb">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( '90s REWIND', 'the90sindia' ); ?></a>
		<span aria-hidden="true">›</span>
		<?php if ( $archive ) : ?>
			<a href="<?php echo esc_url( $archive ); ?>"><?php echo esc_html( $kind ); ?></a>
			<span aria-hidden="true">›</span>
		<?php endif; ?>
		<span><?php the_title(); ?></span>
	</nav>

	<header class="item-head">
		<?php if ( $meta['category'] ) : ?>
			<span class="item-tag" style="--tag-color: var(--<?php echo esc_attr( $meta['color'] ? $meta['color'] : 'lime' ); ?>)">
				<?php echo esc_html( $meta['category'] ); ?>
			</span>
		<?php endif; ?>

		<h1><?php the_title(); ?></h1>

		<?php if ( $meta['subtitle'] ) : ?>
			<p class="item-sub"><?php echo esc_html( $meta['subtitle'] ); ?></p>
		<?php endif; ?>
	</header>

	<?php echo rewind_player_markup( get_the_ID() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped — escaped internally. ?>

	<div class="item-body">
		<?php
		if ( trim( get_the_content() ) ) {
			the_content();
		} else {
			echo '<p class="item-empty">'
				. esc_html__( 'No write-up yet. Open this item in the dashboard and add your own memory of it — that is the part no other site has.', 'the90sindia' )
				. '</p>';
		}
		?>
	</div>

	<?php
	$related = rewind_related_items( get_the_ID(), $type );
	if ( $related ) :
		?>
	<section class="item-related">
		<h2><?php echo esc_html( sprintf( /* translators: %s: content type name. */ __( 'More %s', 'the90sindia' ), strtolower( $kind ) ) ); ?></h2>
		<ul class="item-related-list">
			<?php foreach ( $related as $rel ) : ?>
				<li>
					<a href="<?php echo esc_url( get_permalink( $rel ) ); ?>">
						<?php
						$thumb = rewind_still_url( $rel->ID );
						if ( $thumb ) :
							?>
							<img src="<?php echo esc_url( $thumb ); ?>" alt="" loading="lazy">
						<?php endif; ?>
						<span><?php echo esc_html( get_the_title( $rel ) ); ?></span>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</section>
	<?php endif; ?>

	<p class="item-back">
		<a class="btn-chunky" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( '← Back to 90s REWIND', 'the90sindia' ); ?>
		</a>
	</p>

</main>

	<?php
endwhile;

get_footer();
