<?php
/**
 * A standard page — About, Privacy, Contact and anything else an editor adds.
 *
 * Without this, WordPress falls back to index.php, which is built for listings
 * rather than for reading a page of prose.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();
	?>

<main id="main-content" class="item-page">

	<nav class="item-crumbs" aria-label="<?php esc_attr_e( 'Breadcrumb', 'the90sindia' ); ?>">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( '90s REWIND', 'the90sindia' ); ?></a>
		<span aria-hidden="true">›</span>
		<span><?php the_title(); ?></span>
	</nav>

	<header class="item-head">
		<h1><?php the_title(); ?></h1>
	</header>

	<?php if ( has_post_thumbnail() ) : ?>
		<div class="item-player"><?php the_post_thumbnail( 'large', array( 'class' => 'page-hero' ) ); ?></div>
	<?php endif; ?>

	<div class="item-body">
		<?php
		the_content();
		wp_link_pages( array( 'before' => '<nav class="nav-links">', 'after' => '</nav>' ) );
		?>
	</div>

	<p class="item-back">
		<a class="btn-chunky" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php esc_html_e( '← Back to 90s REWIND', 'the90sindia' ); ?>
		</a>
	</p>

</main>

	<?php
endwhile;

get_footer();
