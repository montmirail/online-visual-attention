const pxperdeg = <?php echo $pxperdeg; ?>;
const monitorsize =  <?php echo $monitorsize; ?>;

UFOV.init({
  pxPerDeg: pxperdeg > 0 ? pxperdeg : undefined,
});


