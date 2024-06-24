<?php

$next = new DateInterval('P1D');
$datas = [];
$d = new DateTime("1985-01-01 00:00:00.000000", new DateTimeZone("Asia/Tokyo"));
// 一年後
$endDate = new DateTime('+1 year', new DateTimeZone("Asia/Tokyo"));
$last = "";
while ($d < $endDate) {
    $d->add($next);
    if ($last == $d->format('c')) {
        var_export($d);
        throw new Exception();
    } else {
        $last = $d->format('c');
    }
}
return $datas;