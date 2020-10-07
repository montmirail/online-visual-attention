const pxperdeg = <?php echo $pxperdeg; ?>;
const monitorsize =  <?php echo $monitorsize; ?>;
const dots = <?php echo json_encode($order); ?>; //number of dots to attend to per trial (obtained from MOT/code.php)

MOT.init({
    pxPerDeg: pxperdeg > 0 ? pxperdeg : undefined,
    dots
});
