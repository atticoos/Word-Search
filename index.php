<?php include('../header.php'); ?>

<div class="container">
	<div class="row">
		<div class="col-md-12"><h2>Word Search</h2></div>
	</div>
	<div class="col-md-12">
		<div class="col-md-2">
			Words
			<ul>
				<li>Gabrielle</li>
				<li>Lisa</li>
				<li>Billy</li>
				<li>Nelly</li>
				<li>Baby</li>
				<li>Gator</li>
				<li>Boo</li>
			</ul>
		</div>
		<div class="col-md-10">
			<canvas id="canvas" width="800" height="500"></canvas>
		</div>
	</div>
</div>

<style type="text/css">
#canvas { width: 800px; background-color: #fff; height: 500px; position: relative; cursor: pointer; }
</style>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script type="text/javascript" src="wordsearch.js"></script>
<?php include('../footer.php'); ?>