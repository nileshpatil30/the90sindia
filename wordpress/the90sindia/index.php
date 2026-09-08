<?php
/**
 * Fallback template.
 *
 * Every URL that is not the front page or the portal page lands here. The site
 * is a single-page hub, so this shows the requested content inside a plain
 * wrapper rather than 404-ing.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main class="section" style="max-width: 760px; margin: 0 auto; padding: 24px 16px;">
	<?php
	if ( have_posts() ) {
		while ( have_posts() ) {
			the_post();
			echo '<h1 class="section-title">' . esc_html( get_the_title() ) . '</h1>';
			the_content();
		}
	} else {
		echo '<h1 class="section-title">' . esc_html__( 'Nothing here', 'the90sindia' ) . '</h1>';
		echo '<p><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Back to 90s REWIND', 'the90sindia' ) . '</a></p>';
	}
	?>
</main>

<?php
get_footer();
