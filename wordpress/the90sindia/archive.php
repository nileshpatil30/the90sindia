<?php
/**
 * Listing page for a content type — /shows/, /channels/, /hit-parade/, /vault/.
 *
 * Gives each type a hub page of its own, so a visitor (or a crawler) arriving
 * on one item can reach every sibling.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

get_header();

/* This template also serves date, author and taxonomy archives, where the
   queried object is not a post type at all. */
$label = is_post_type_archive() ? rewind_type_label( get_query_var( 'post_type' ) ) : get_the_archive_title();
?>

<main id="main-content" class="item-page">

	<nav class="item-crumbs" aria-label="Breadcrumb">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( '90s REWIND', 'the90sindia' ); ?></a>
		<span aria-hidden="true">›</span>
		<span><?php echo esc_html( $label ); ?></span>
	</nav>

	<header class="item-head">
		<h1><?php echo esc_html( $label ); ?></h1>
		<?php
		$desc = wp_strip_all_tags( get_the_archive_description() );
		if ( $desc ) :
			?>
			<p class="item-sub"><?php echo esc_html( $desc ); ?></p>
		<?php endif; ?>
	</header>

	<?php if ( have_posts() ) : ?>
		<ul class="archive-grid">
			<?php
			while ( have_posts() ) :
				the_post();
				$still = rewind_still_url( get_the_ID() );
				$meta  = rewind_item_meta( get_the_ID() );
				?>
				<li class="archive-card">
					<a href="<?php the_permalink(); ?>">
						<?php if ( $still ) : ?>
							<img class="archive-card-art" src="<?php echo esc_url( $still ); ?>" alt="" loading="lazy">
						<?php endif; ?>
						<span class="archive-card-body">
							<?php if ( $meta['category'] ) : ?>
								<span class="item-tag" style="--tag-color: var(--<?php echo esc_attr( $meta['color'] ? $meta['color'] : 'lime' ); ?>)">
									<?php echo esc_html( $meta['category'] ); ?>
								</span>
							<?php endif; ?>
							<strong><?php the_title(); ?></strong>
							<?php
							$blurb = wp_trim_words( rewind_plain_body( get_post() ), 22 );
							if ( $blurb ) :
								?>
								<span class="archive-card-blurb"><?php echo esc_html( $blurb ); ?></span>
							<?php endif; ?>
						</span>
					</a>
				</li>
			<?php endwhile; ?>
		</ul>

		<?php
		the_posts_pagination(
			array(
				'mid_size'  => 2,
				'prev_text' => __( '← Newer', 'the90sindia' ),
				'next_text' => __( 'Older →', 'the90sindia' ),
			)
		);
		?>

	<?php else : ?>
		<p class="item-empty"><?php esc_html_e( 'Nothing here yet.', 'the90sindia' ); ?></p>
	<?php endif; ?>

	<p class="item-back">
		<a class="btn-chunky" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( '← Back to 90s REWIND', 'the90sindia' ); ?>
		</a>
	</p>

</main>

<?php
get_footer();
