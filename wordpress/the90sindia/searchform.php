<?php
/**
 * Search form.
 *
 * @package The90sIndia
 */

defined( 'ABSPATH' ) || exit;

$rewind_search_id = wp_unique_id( 'rewind-search-' );
?>
<form role="search" method="get" class="rewind-search" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="<?php echo esc_attr( $rewind_search_id ); ?>">
		<?php esc_html_e( 'Search 90s REWIND', 'the90sindia' ); ?>
	</label>
	<div class="rewind-search-row">
		<input
			type="search"
			id="<?php echo esc_attr( $rewind_search_id ); ?>"
			name="s"
			value="<?php echo esc_attr( get_search_query() ); ?>"
			placeholder="<?php esc_attr_e( 'Shows, channels, songs…', 'the90sindia' ); ?>">
		<button type="submit" class="btn-chunky"><?php esc_html_e( 'GO', 'the90sindia' ); ?></button>
	</div>
</form>
