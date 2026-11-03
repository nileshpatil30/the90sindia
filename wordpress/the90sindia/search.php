<?php
/**
 * Search results.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="main-content" class="item-page">

	<nav class="item-crumbs" aria-label="<?php esc_attr_e( 'Breadcrumb', 'the90sindia' ); ?>">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( '90s REWIND', 'the90sindia' ); ?></a>
		<span aria-hidden="true">›</span>
		<span><?php esc_html_e( 'Search', 'the90sindia' ); ?></span>
	</nav>

	<header class="item-head">
		<h1>
			<?php
			printf(
				/* translators: %s: the search term. */
				esc_html__( 'Search: %s', 'the90sindia' ),
				esc_html( get_search_query() )
			);
			?>
		</h1>
		<p class="item-sub">
			<?php
			global $wp_query;
			printf(
				/* translators: %d: number of results. */
				esc_html( _n( '%d result', '%d results', (int) $wp_query->found_posts, 'the90sindia' ) ),
				(int) $wp_query->found_posts
			);
			?>
		</p>
	</header>

	<div class="item-body"><?php get_search_form(); ?></div>

	<?php if ( have_posts() ) : ?>
		<ul class="archive-grid">
			<?php
			while ( have_posts() ) :
				the_post();
				$rewind_still = rewind_still_url( get_the_ID() );
				?>
				<li class="archive-card">
					<a href="<?php the_permalink(); ?>">
						<?php if ( $rewind_still ) : ?>
							<img class="archive-card-art" src="<?php echo esc_url( $rewind_still ); ?>" alt="" loading="lazy">
						<?php endif; ?>
						<span class="archive-card-body">
							<span class="item-tag" style="--tag-color: var(--cyan)">
								<?php echo esc_html( rewind_type_label( get_post_type() ) ); ?>
							</span>
							<strong><?php the_title(); ?></strong>
							<span class="archive-card-blurb"><?php echo esc_html( wp_trim_words( rewind_plain_body( get_post() ), 22 ) ); ?></span>
						</span>
					</a>
				</li>
			<?php endwhile; ?>
		</ul>
		<?php the_posts_pagination( array( 'mid_size' => 2 ) ); ?>
	<?php else : ?>
		<p class="item-empty">
			<?php esc_html_e( 'Nothing matched. Try a shorter word — a show name, a channel, or a song title.', 'the90sindia' ); ?>
		</p>
	<?php endif; ?>

	<p class="item-back">
		<a class="btn-chunky" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( '← Back to 90s REWIND', 'the90sindia' ); ?>
		</a>
	</p>

</main>

<?php
get_footer();
